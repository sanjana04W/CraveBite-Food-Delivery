import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import AdminSettings from "@/app/models/AdminSettings";

// GET — fetch admin settings (auto-create defaults if first visit)
export async function GET() {
  try {
    await dbConnect();
    let settings = await AdminSettings.findOne({ settingsId: "main" });
    if (!settings) {
      settings = await AdminSettings.create({ settingsId: "main" });
    }
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT — save admin settings
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const settings = await AdminSettings.findOneAndUpdate(
      { settingsId: "main" },
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
