import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import bcrypt from "bcryptjs";
import { getAdminCredentials, updateAdminCredentials } from "@/app/lib/adminAuthStore";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("client_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie);
    if (session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Both current and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "New password must be at least 6 characters." }, { status: 400 });
    }

    const adminCreds = getAdminCredentials();

    // Verify current password against store
    let isMatch = false;
    if (adminCreds.plainPassword && currentPassword === adminCreds.plainPassword) {
      isMatch = true;
    } else if (adminCreds.passwordHash) {
      isMatch = await bcrypt.compare(currentPassword, adminCreds.passwordHash);
    } else if (currentPassword === "admin123") {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Current password is incorrect." }, { status: 400 });
    }

    // Hash and update admin credentials
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateAdminCredentials({
      plainPassword: newPassword,
      passwordHash: hashedPassword,
    });

    try {
      await dbConnect();
      const admin = await Client.findById(session.id);
      if (admin) {
        admin.password = hashedPassword;
        await admin.save();
      }
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Password updated successfully. You can now use your new password to log in." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
