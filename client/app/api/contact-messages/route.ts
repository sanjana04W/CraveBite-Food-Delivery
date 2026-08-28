import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import ContactMessage from "@/app/models/ContactMessage";
import Notification from "@/app/models/Notification";

// GET — All messages (admin)
export async function GET() {
  try {
    await dbConnect();
    const messages = await ContactMessage.find().sort({ submittedAt: -1 });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — Create a new contact message (from public contact form)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const name = body.name || body.fullName;
    const email = body.email;
    const phone = body.phone || "";
    const subject = body.subject || body.inquiryType || "General Inquiry";
    const practiceArea = body.practiceArea || body.inquiryType || "";
    const message = body.message;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required." }, { status: 400 });
    }

    // Add the first thread item (the client's original message)
    const thread = [{
      id: Date.now().toString(),
      senderName: name,
      senderRole: "client",
      timestamp: new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      content: message,
    }];

    const newMessage = await ContactMessage.create({
      name, email,
      phone: phone || "",
      subject: subject || "General Inquiry",
      practiceArea: practiceArea || "",
      message,
      thread,
      status: "Unread",
    });

    // Fire notification (non-blocking)
    Notification.create({
      type: "Message",
      title: "New Message Received",
      description: `${name} sent a new message: "${(subject || "General Inquiry").substring(0, 60)}".`,
      link: "/admin/messages",
    }).catch(() => {});

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
