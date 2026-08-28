import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Case from "@/app/models/Case";

const sampleCases = [
  {
    caseId: "CASE-2026-001",
    title: "Property Ownership Dispute",
    clientName: "Sarah Johnson",
    clientEmail: "sarah@email.com",
    clientPhone: "+94 77 123 4567",
    clientId: "CL-2026-001",
    practiceArea: "Property Law",
    openedDate: new Date("2026-08-01"),
    priority: "High",
    status: "Active",
    courtInstitution: "District Court of Colombo",
    caseReferenceNumber: "DC/2026/892",
    description: "Legal matter concerning a dispute regarding ownership of residential property located at Galle Road.",
    notes: [
      {
        id: "n1",
        note: "Need to review the original deed before the next client meeting.",
        createdBy: "Attorney-at-Law",
        date: "August 2, 2026",
      },
    ],
  },
  {
    caseId: "CASE-2026-002",
    title: "Divorce Settlement & Child Custody",
    clientName: "John Perera",
    clientEmail: "john.perera@example.com",
    clientPhone: "+94 71 987 6543",
    clientId: "CL-2026-002",
    practiceArea: "Family Law",
    openedDate: new Date("2026-07-20"),
    priority: "Medium",
    status: "Pending",
    courtInstitution: "District Court of Mount Lavinia",
    caseReferenceNumber: "ML/2026/410",
    description: "Divorce proceeding involving equitable distribution of matrimonial assets and parenting agreements.",
    notes: [],
  },
  {
    caseId: "CASE-2026-003",
    title: "Employment & Labour Dispute",
    clientName: "Emily Silva",
    clientEmail: "emily.silva@example.com",
    clientPhone: "+94 76 555 4321",
    clientId: "CL-2026-003",
    practiceArea: "Labour Law",
    openedDate: new Date("2026-06-10"),
    priority: "Low",
    status: "Completed",
    courtInstitution: "Labour Tribunal Colombo",
    caseReferenceNumber: "LT/2026/112",
    description: "Unfair termination claim successfully resolved through mediated settlement.",
    notes: [],
  },
];

export async function POST() {
  try {
    await dbConnect();
    const count = await Case.countDocuments();
    if (count > 0) {
      return NextResponse.json({ success: false, message: `Already seeded (${count} cases exist).` }, { status: 409 });
    }
    await Case.insertMany(sampleCases);
    return NextResponse.json({ success: true, message: `Seeded ${sampleCases.length} sample cases.` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
