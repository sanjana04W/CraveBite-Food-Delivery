import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import Appointment from "@/app/models/Appointment";

function todayStr() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// PATCH — Update appointment (status, reschedule, add/delete note)
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
    const { action, status, dateISO, time, note, noteId } = body;
    const appt = await Appointment.findById(id);
    if (!appt) return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });

    if (action === "addNote" && note) {
      appt.privateNotes.push({ id: Date.now().toString(), content: note.content, author: note.author || "Lawyer", date: todayStr() });
    } else if (action === "deleteNote" && noteId) {
      appt.privateNotes = appt.privateNotes.filter((n: any) => n.id !== noteId);
    } else if (action === "reschedule" && dateISO && time) {
      const prevDate = appt.dateISO.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      appt.dateISO = new Date(dateISO);
      appt.time = time;
      appt.status = "Rescheduled";
      appt.timeline.push({ date: todayStr(), action: `Rescheduled from ${prevDate} to ${new Date(dateISO).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${time}` });
    } else if (status) {
      const prevStatus = appt.status;
      appt.status = status;
      const actionMap: Record<string, string> = {
        Confirmed: "Appointment Confirmed",
        Completed: "Consultation Completed",
        Cancelled: "Appointment Cancelled",
        "No Show": "Marked as No Show",
        Upcoming: "Returned to Upcoming",
      };
      if (status !== prevStatus && actionMap[status]) {
        appt.timeline.push({ date: todayStr(), action: actionMap[status] });
      }
    }

    await appt.save();
    return NextResponse.json({ success: true, data: appt }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — Permanently delete an appointment
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
    const appt = await Appointment.findByIdAndDelete(id);
    if (!appt) return NextResponse.json({ success: false, error: "Not found." }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
