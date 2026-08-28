import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import LegalDocument from "@/app/models/LegalDocument";

const sampleDocs = [
  {
    docId: "DOC-2026-001",
    name: "Property Deed - Galle Road.pdf",
    fileUrl: "/uploads/sample-property-deed.pdf",
    fileType: "PDF",
    size: "2.4 MB",
    bytes: 2516582,
    uploadedDate: new Date("2026-08-02"),
    status: "Approved",
    documentType: "Legal Agreement",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@email.com",
    clientPhone: "+94 77 123 4567",
    clientId: "CL-2026-001",
    caseId: "CASE-2026-001",
    caseTitle: "Property Ownership Dispute",
    practiceArea: "Property Law",
    caseStatus: "Active",
    notes: "Original registered title deed certified by registrar.",
  },
  {
    docId: "DOC-2026-002",
    name: "National Identity Card Copy.pdf",
    fileUrl: "/uploads/sample-id-copy.pdf",
    fileType: "PDF",
    size: "1.1 MB",
    bytes: 1153433,
    uploadedDate: new Date("2026-08-02"),
    status: "Approved",
    documentType: "Identity Document",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@email.com",
    clientPhone: "+94 77 123 4567",
    clientId: "CL-2026-001",
    caseId: "CASE-2026-001",
    caseTitle: "Property Ownership Dispute",
    practiceArea: "Property Law",
    caseStatus: "Active",
    notes: "Verified against original ID card.",
  },
  {
    docId: "DOC-2026-003",
    name: "Labour Tribunal Notice.pdf",
    fileUrl: "/uploads/sample-court-notice.pdf",
    fileType: "PDF",
    size: "850 KB",
    bytes: 870400,
    uploadedDate: new Date("2026-08-05"),
    status: "Under Review",
    documentType: "Court Document",
    clientName: "Emily Silva",
    clientEmail: "emily.silva@example.com",
    clientPhone: "+94 76 555 4321",
    clientId: "CL-2026-003",
    caseId: "CASE-2026-003",
    caseTitle: "Employment & Labour Dispute",
    practiceArea: "Labour Law",
    caseStatus: "Completed",
    notes: "Summons received for preliminary inquiry.",
  },
];

export async function POST() {
  try {
    await dbConnect();
    const count = await LegalDocument.countDocuments();
    if (count > 0) {
      return NextResponse.json({ success: false, message: `Already seeded (${count} documents exist).` }, { status: 409 });
    }
    await LegalDocument.insertMany(sampleDocs);
    return NextResponse.json({ success: true, message: `Seeded ${sampleDocs.length} sample documents.` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
