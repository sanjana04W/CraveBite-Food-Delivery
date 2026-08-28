import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import bcrypt from "bcryptjs";

// POST /api/auth/setup-admin
// Call this ONCE to create the admin account.
// After calling, the endpoint becomes a no-op (admin already exists).
export async function POST() {
  try {
    await dbConnect();

    const existing = await Client.findOne({ role: "admin" });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Admin account already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash("SterlingAdmin@2026", 10);

    const admin = await Client.create({
      clientId: "ADMIN-001",
      firstName: "Admin",
      lastName: "Sterling",
      clientName: "Admin Sterling",
      email: "admin@sterlinglaw.com",
      phone: "+1 (555) 000-0000",
      password: hashedPassword,
      role: "admin",
      status: "Active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully!",
        credentials: {
          email: admin.email,
          password: "SterlingAdmin@2026",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Setup admin error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
