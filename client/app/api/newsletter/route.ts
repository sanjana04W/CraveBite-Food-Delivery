import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Subscriber from "@/app/models/Subscriber";
import Notification from "@/app/models/Notification";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: true, message: "You are already subscribed to updates!" },
        { status: 200 }
      );
    }

    const subscriber = await Subscriber.create({ email: cleanEmail });

    // Send admin notification
    Notification.create({
      type: "message",
      title: "New Newsletter Subscriber",
      description: `${cleanEmail} subscribed for legal updates.`,
      link: "/admin/messages",
      read: false,
    }).catch(() => {});

    return NextResponse.json(
      { success: true, message: "Thank you! You have successfully subscribed to updates." },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
