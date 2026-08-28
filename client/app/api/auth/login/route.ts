import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide email and password" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Database Customer Check
    try {
      await dbConnect();
      const client = await Client.findOne({ email: cleanEmail });
      if (client && client.role !== "admin") {
        const isMatch = await bcrypt.compare(password, client.password);
        if (isMatch) {
          const sessionData = JSON.stringify({
            id: client._id.toString(),
            clientId: client.clientId,
            name: client.clientName || `${client.firstName} ${client.lastName}`,
            email: client.email,
            role: client.role || "user",
          });

          const response = NextResponse.json(
            {
              success: true,
              message: "Logged in successfully",
              client: {
                id: client._id.toString(),
                clientId: client.clientId,
                name: client.clientName || `${client.firstName} ${client.lastName}`,
                email: client.email,
                role: client.role || "user",
              },
            },
            { status: 200 }
          );

          response.cookies.set("client_session", sessionData, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
          });

          return response;
        }
      }
    } catch (_) {}

    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
