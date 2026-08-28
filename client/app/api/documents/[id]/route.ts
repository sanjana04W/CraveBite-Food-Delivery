import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import LegalDocument from "@/app/models/LegalDocument";
import mongoose from "mongoose";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    let doc = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await LegalDocument.findById(id);
    }
    if (!doc) {
      doc = await LegalDocument.findOne({ docId: id });
    }
    if (!doc) {
      doc = await LegalDocument.findOne({ name: id });
    }

    if (!doc) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doc }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { docId: id };

    const updated = await LegalDocument.findOneAndUpdate(
      query,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
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

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { docId: id };

    if (body.status) {
      const updated = await LegalDocument.findOneAndUpdate(
        query,
        { $set: { status: body.status } },
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
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { docId: id };
    const deleted = await LegalDocument.findOneAndDelete(query);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Document deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
