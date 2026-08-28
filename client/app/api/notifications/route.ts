import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Notification from "@/app/models/Notification";

// GET — fetch all notifications (newest first)
export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — create a new notification (called internally by other API routes)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { type, title, description, link } = body;
    if (!type || !title || !description) {
      return NextResponse.json({ success: false, error: "type, title, and description are required." }, { status: 400 });
    }
    const notification = await Notification.create({ type, title, description, link: link || "/admin" });
    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH — mark ALL notifications as read
export async function PATCH() {
  try {
    await dbConnect();
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    return NextResponse.json({ success: true, message: "All marked as read." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — clear ALL notifications
export async function DELETE() {
  try {
    await dbConnect();
    await Notification.deleteMany({});
    return NextResponse.json({ success: true, message: "All notifications cleared." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
