import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import PracticeArea from "@/app/models/PracticeArea";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug };
    const area = await PracticeArea.findOne(query);
    if (!area) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: area }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const body = await req.json();
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug };
    const area = await PracticeArea.findOneAndUpdate(query, body, { new: true, runValidators: true });
    if (!area) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: area }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const query = mongoose.Types.ObjectId.isValid(slug) ? { _id: slug } : { slug };
    const area = await PracticeArea.findOneAndDelete(query);
    if (!area) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
