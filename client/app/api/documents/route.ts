import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import LegalDocument from "@/app/models/LegalDocument";
import Notification from "@/app/models/Notification";

// GET /api/documents — list all legal documents
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const caseId = searchParams.get("caseId");

    const query: any = {};

    if (status && status !== "All" && status !== "All Statuses") {
      query.status = status;
    }
    if (type && type !== "All Documents" && type !== "All") {
      query.documentType = type;
    }
    if (caseId) {
      query.caseId = caseId;
    }
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { clientName: regex },
        { caseTitle: regex },
        { caseId: regex },
        { documentType: regex },
      ];
    }

    const documents = await LegalDocument.find(query).sort({ uploadedDate: -1, createdAt: -1 });

    // Calculate stats
    const allDocs = await LegalDocument.find({});
    const total = allDocs.length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyUploaded = allDocs.filter((d) => new Date(d.uploadedDate) >= sevenDaysAgo).length;
    const underReview = allDocs.filter((d) => d.status === "Under Review").length;

    // Total bytes calculation
    const totalBytes = allDocs.reduce((acc, d) => acc + (d.bytes || 0), 0);
    let storageUsed = `${(totalBytes / 1024).toFixed(1)} KB`;
    if (totalBytes >= 1024 * 1024) {
      storageUsed = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return NextResponse.json({
      success: true,
      data: documents,
      stats: { total, recentlyUploaded, underReview, storageUsed, totalBytes },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/documents — create / record a new legal document
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const count = await LegalDocument.countDocuments();
    const year = new Date().getFullYear();
    const docId = `DOC-${year}-${String(count + 1).padStart(3, "0")}`;

    const newDoc = await LegalDocument.create({
      ...body,
      docId: body.docId || docId,
      uploadedDate: body.uploadedDate ? new Date(body.uploadedDate) : new Date(),
    });

    // Auto-fire notification
    Notification.create({
      type: "document",
      title: "New Legal Document Uploaded",
      description: `Document "${newDoc.name}" has been uploaded for client ${newDoc.clientName || "General"}.`,
      link: `/admin/documents/${newDoc.docId}`,
      read: false,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
