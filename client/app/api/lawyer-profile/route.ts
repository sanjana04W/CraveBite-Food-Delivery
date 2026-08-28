import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import LawyerProfile from "@/app/models/LawyerProfile";

// GET - Fetch the single lawyer profile (creates default if none exists)
export async function GET() {
  try {
    await dbConnect();
    let profile = await LawyerProfile.findOne({ profileId: "main" });

    // Auto-create default profile on first request
    if (!profile) {
      profile = await LawyerProfile.create({ profileId: "main" });
    }

    return NextResponse.json({ success: true, data: profile }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Update the lawyer profile (upsert)
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Remove fields that shouldn't be overwritten
    delete body.profileId;
    delete body._id;

    const profile = await LawyerProfile.findOneAndUpdate(
      { profileId: "main" },
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: profile }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
