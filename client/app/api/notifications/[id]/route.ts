import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import Notification from "@/app/models/Notification";

// PATCH - toggle read/unread for a single notification
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
    }
    const body = await req.json();
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: body.read } },
      { new: true }
    );
    if (!notification) {
      return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notification }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - permanently delete a single notification
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid ID." }, { status: 400 });
    }
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Deleted." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
