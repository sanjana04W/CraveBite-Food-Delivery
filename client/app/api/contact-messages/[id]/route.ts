import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import ContactMessage from "@/app/models/ContactMessage";

// PATCH - Update a contact message (status, add thread reply, add note, delete note)
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid message ID." }, { status: 400 });
    }
    const body = await req.json();
    const { action, status, reply, note, noteId } = body;

    const msg = await ContactMessage.findById(id);
    if (!msg) {
      return NextResponse.json({ success: false, error: "Message not found." }, { status: 404 });
    }

    if (action === "addReply" && reply) {
      msg.thread.push({
        id: Date.now().toString(),
        senderName: reply.senderName || "Admin",
        senderRole: "lawyer",
        timestamp: new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        content: reply.content,
      });
      msg.status = "Replied";
    } else if (action === "addNote" && note) {
      msg.notes.push({
        id: Date.now().toString(),
        content: note.content,
        createdBy: note.createdBy || "Admin",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      });
    } else if (action === "deleteNote" && noteId) {
      msg.notes = msg.notes.filter((n: any) => n.id !== noteId);
    } else if (status) {
      msg.status = status;
    }

    await msg.save();
    return NextResponse.json({ success: true, data: msg }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Permanently delete a contact message
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid message ID." }, { status: 400 });
    }
    const msg = await ContactMessage.findByIdAndDelete(id);
    if (!msg) {
      return NextResponse.json({ success: false, error: "Message not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Deleted." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
