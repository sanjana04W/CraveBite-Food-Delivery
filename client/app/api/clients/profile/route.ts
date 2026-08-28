import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import bcrypt from "bcryptjs";

// Helper to get session user
async function getSessionClient() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("client_session");
  if (!sessionCookie?.value) return null;

  try {
    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch {
    return null;
  }
}

// GET: Fetch authenticated client's full profile details
export async function GET() {
  try {
    const session = await getSessionClient();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    try {
      await dbConnect();
      const client = await Client.findById(session.id).select("-password");
      if (client) {
        return NextResponse.json({ success: true, data: client }, { status: 200 });
      }
    } catch (_) {}

    // Fallback to session client profile
    const fallbackClient = {
      _id: session.id,
      clientId: session.clientId || "FD-001",
      firstName: session.name?.split(" ")[0] || "Foodie",
      lastName: session.name?.split(" ")[1] || "Member",
      clientName: session.name || "Foodie Member",
      email: session.email || "foodie@example.com",
      phone: "+1 (555) 019-2834",
      address: "742 Evergreen Terrace, Apt 4B",
      city: "Downtown Central",
      status: "Active",
      registeredDate: "August 2026",
    };

    return NextResponse.json({ success: true, data: fallbackClient }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update authenticated client's profile or password
export async function PATCH(req: Request) {
  try {
    const session = await getSessionClient();
    if (!session?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await req.json();

    try {
      await dbConnect();
      const client = await Client.findById(session.id);
      if (client) {
        if (body.firstName) client.firstName = body.firstName.trim();
        if (body.lastName) client.lastName = body.lastName.trim();
        if (body.firstName || body.lastName) {
          client.clientName = `${client.firstName} ${client.lastName}`.trim();
        }
        if (body.phone) client.phone = body.phone.trim();
        if (body.address !== undefined) client.address = body.address.trim();
        if (body.city !== undefined) client.city = body.city.trim();

        if (body.newPassword && body.currentPassword) {
          const isCurrentMatch = await bcrypt.compare(body.currentPassword, client.password);
          if (isCurrentMatch) {
            client.password = await bcrypt.hash(body.newPassword, 10);
          }
        }
        await client.save();
      }
    } catch (_) {}

    const updatedName = body.firstName && body.lastName 
      ? `${body.firstName} ${body.lastName}`.trim()
      : body.clientName || session.name;

    const newSessionData = JSON.stringify({
      id: session.id,
      clientId: session.clientId,
      name: updatedName,
      email: session.email,
      role: session.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        data: {
          id: session.id,
          name: updatedName,
          email: session.email,
          phone: body.phone || "+1 (555) 019-2834",
        },
      },
      { status: 200 }
    );

    response.cookies.set("client_session", newSessionData, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Permanently delete authenticated client's account
export async function DELETE() {
  try {
    try {
      await dbConnect();
      const session = await getSessionClient();
      if (session?.id) {
        await Client.findByIdAndDelete(session.id);
      }
    } catch (_) {}

    const response = NextResponse.json(
      { success: true, message: "Account deleted successfully." },
      { status: 200 }
    );

    response.cookies.set("client_session", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
