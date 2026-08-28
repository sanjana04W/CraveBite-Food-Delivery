import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/mongodb";
import AdminProfile from "@/app/models/AdminProfile";
import Client from "@/app/models/Client";
import { getAdminCredentials, updateAdminCredentials } from "@/app/lib/adminAuthStore";

// GET — fetch admin profile
export async function GET() {
  try {
    const adminCreds = getAdminCredentials();
    try {
      await dbConnect();
      let profile = await AdminProfile.findOne({ profileId: "main" });
      if (!profile) {
        profile = await AdminProfile.create({
          profileId: "main",
          firstName: adminCreds.firstName,
          lastName: adminCreds.lastName,
          title: adminCreds.title,
          phone: adminCreds.phone,
        });
      }
      return NextResponse.json({
        success: true,
        data: {
          ...profile.toObject(),
          email: adminCreds.email,
        }
      }, { status: 200 });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      data: {
        profileId: "main",
        firstName: adminCreds.firstName,
        lastName: adminCreds.lastName,
        title: adminCreds.title,
        phone: adminCreds.phone,
        email: adminCreds.email,
        address: "Downtown Culinary District",
        bio: "Managing culinary standards, fresh farm supply chains, and rapid 30-minute doorstep deliveries across the city.",
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT — update admin profile & email + sync in session cookie
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, title, address, experience, bio, profilePhoto, email } = body;

    // Update persistent store
    const updatedCreds = updateAdminCredentials({
      ...(email ? { email: email.trim().toLowerCase() } : {}),
      ...(firstName ? { firstName: firstName.trim() } : {}),
      ...(lastName ? { lastName: lastName.trim() } : {}),
      ...(title ? { title: title.trim() } : {}),
      ...(phone ? { phone: phone.trim() } : {}),
    });

    try {
      await dbConnect();
      await AdminProfile.findOneAndUpdate(
        { profileId: "main" },
        { $set: { firstName, lastName, phone, title, address, experience, bio, profilePhoto } },
        { new: true, upsert: true }
      );
    } catch (_) {}

    const fullName = [updatedCreds.firstName, updatedCreds.lastName].filter(Boolean).join(" ") || "Admin";

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("client_session")?.value;
    const session = sessionCookie ? JSON.parse(sessionCookie) : { id: "admin-master-id", role: "admin" };

    const updatedSession = JSON.stringify({
      ...session,
      name: fullName,
      email: updatedCreds.email,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      data: {
        ...body,
        email: updatedCreds.email,
        firstName: updatedCreds.firstName,
        lastName: updatedCreds.lastName,
        title: updatedCreds.title,
      }
    }, { status: 200 });

    response.cookies.set("client_session", updatedSession, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
