import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import bcrypt from "bcryptjs";
import Notification from "@/app/models/Notification";


// GET: Fetch all clients for the admin dashboard
export async function GET() {
  try {
    await dbConnect();
    // Exclude admin accounts and password field from the list
    const clients = await Client.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: clients }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Register a new client from the signup page
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate password length
    if (!body.password || body.password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if email already exists
    const existingClient = await Client.findOne({ email: body.email?.toLowerCase().trim() });
    if (existingClient) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Generate unique client ID e.g. CL-2026-001
    const count = await Client.countDocuments({ role: { $ne: "admin" } });
    const clientId = `CL-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create client
    const newClient = await Client.create({
      clientId,
      firstName: body.firstName,
      lastName: body.lastName,
      clientName: `${body.firstName} ${body.lastName}`,
      email: body.email?.toLowerCase().trim(),
      phone: body.phone || "N/A",
      password: hashedPassword,
      role: "user",
      registeredDate: new Date(),
      consultations: 0,
      appointments: 0,
      status: "Active",
    });

    // Fire notification (non-blocking)
    Notification.create({
      type: "Client",
      title: "New Client Registered",
      description: `${body.firstName} ${body.lastName} has created a new client account.`,
      link: "/admin/clients",
    }).catch(() => {});

    const sessionData = JSON.stringify({
      id: newClient._id.toString(),
      clientId: newClient.clientId,
      name: newClient.clientName || `${newClient.firstName} ${newClient.lastName}`,
      email: newClient.email,
      role: newClient.role || "user",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        client: {
          id: newClient._id.toString(),
          clientId: newClient.clientId,
          name: newClient.clientName,
          email: newClient.email,
          role: newClient.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("client_session", sessionData, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;

  } catch (error: any) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
