import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Appointment from "@/app/models/Appointment";
import Notification from "@/app/models/Notification";

// GET — All appointments sorted by date
export async function GET() {
  try {
    await dbConnect();
    const appointments = await Appointment.find().sort({ dateISO: 1 });
    return NextResponse.json({ success: true, data: appointments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — Create a new appointment (admin only)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { clientName, clientEmail, clientPhone, dateISO, time, duration, consultationType, locationOrLink, originalProblem, privateNotes } = body;

    if (!clientName || !clientEmail || !dateISO || !time) {
      return NextResponse.json({ success: false, error: "Client name, email, date, and time are required." }, { status: 400 });
    }

    // Generate unique appointmentId: AP-{year}-{3-digit seq}
    const year = new Date(dateISO).getFullYear();
    const count = await Appointment.countDocuments();
    const appointmentId = `AP-${year}-${String(count + 1).padStart(3, "0")}`;

    const todayStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const notes = privateNotes
      ? [{ id: Date.now().toString(), content: privateNotes, author: "Lawyer", date: todayStr }]
      : [];

    const appointment = await Appointment.create({
      appointmentId,
      clientName, clientEmail,
      clientPhone: clientPhone || "",
      dateISO: new Date(dateISO),
      time,
      duration: duration || "30 Minutes",
      consultationType: consultationType || "Online",
      status: "Upcoming",
      locationOrLink: locationOrLink || "",
      originalProblem: originalProblem || "",
      privateNotes: notes,
      timeline: [{ date: todayStr, action: "Appointment Created" }],
    });

    // Fire notification (non-blocking)
    Notification.create({
      type: "Appointment",
      title: "New Appointment Scheduled",
      description: `Appointment created for ${clientName} on ${new Date(dateISO).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
      link: "/admin/appointments",
    }).catch(() => {});

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
