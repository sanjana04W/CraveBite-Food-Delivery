import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Case from "@/app/models/Case";
import mongoose from "mongoose";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    let caseItem = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      caseItem = await Case.findById(id);
    }
    if (!caseItem) {
      caseItem = await Case.findOne({ caseId: id });
    }

    if (!caseItem) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: caseItem }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { caseId: id };

    const updated = await Case.findOneAndUpdate(
      query,
      { $set: { ...body, lastUpdated: new Date() } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { caseId: id };

    if (body.action === "addNote") {
      const note = {
        id: Date.now().toString(),
        note: body.note,
        createdBy: body.createdBy || "Attorney-at-Law",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      };
      const updated = await Case.findOneAndUpdate(
        query,
        { $push: { notes: { $each: [note], $position: 0 } }, $set: { lastUpdated: new Date() } },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    if (body.action === "deleteNote") {
      const updated = await Case.findOneAndUpdate(
        query,
        { $pull: { notes: { id: body.noteId } }, $set: { lastUpdated: new Date() } },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    if (body.status) {
      const updated = await Case.findOneAndUpdate(
        query,
        { $set: { status: body.status, lastUpdated: new Date() } },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { caseId: id };
    const deleted = await Case.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Case deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
