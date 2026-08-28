import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminCredentials } from "@/app/lib/adminAuthStore";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide admin email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const adminCreds = getAdminCredentials();

    if (cleanEmail === adminCreds.email.toLowerCase().trim()) {
      let isMatch = false;
      if (adminCreds.plainPassword && password === adminCreds.plainPassword) {
        isMatch = true;
      } else if (adminCreds.passwordHash) {
        isMatch = await bcrypt.compare(password, adminCreds.passwordHash);
      }

      if (isMatch) {
        const fullName = `${adminCreds.firstName} ${adminCreds.lastName}`.trim() || "Admin Owner";
        const sessionData = JSON.stringify({
          id: "admin-master-id",
          name: fullName,
          email: adminCreds.email,
          role: "admin",
        });

        const response = NextResponse.json(
          {
            success: true,
            message: "Logged in successfully to Admin Portal",
            admin: {
              id: "admin-master-id",
              name: fullName,
              email: adminCreds.email,
              role: "admin",
            },
          },
          { status: 200 }
        );

        // Use admin_session cookie - completely separate from customer client_session
        response.cookies.set("admin_session", sessionData, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          sameSite: "lax",
        });

        return response;
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid password for admin account." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "No admin account found with this email address." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
