import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Case from "@/app/models/Case";
import Notification from "@/app/models/Notification";

// GET /api/cases — list all cases
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const practice = searchParams.get("practice");
    const priority = searchParams.get("priority");

    const query: any = {};

    if (status && status !== "All Cases" && status !== "All") {
      query.status = status;
    }
    if (practice && practice !== "All Practice Areas" && practice !== "All") {
      query.practiceArea = practice;
    }
    if (priority && priority !== "All Priorities" && priority !== "All") {
      query.priority = priority;
    }
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { title: regex },
        { clientName: regex },
        { caseId: regex },
        { caseReferenceNumber: regex },
        { courtInstitution: regex },
      ];
    }

    const cases = await Case.find(query).sort({ openedDate: -1, createdAt: -1 });

    // Calculate stats
    const allCases = await Case.find({});
    const total = allCases.length;
    const active = allCases.filter((c) => c.status === "Active").length;
    const pending = allCases.filter((c) => c.status === "Pending").length;
    const completed = allCases.filter((c) => c.status === "Completed" || c.status === "Closed").length;

    return NextResponse.json({
      success: true,
      data: cases,
      stats: { total, active, pending, completed },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/cases — create a new order / case
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const orderRandom = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `CB-${orderRandom}`;

    const newCase = await Case.create({
      ...body,
      caseId: body.caseId || generatedId,
      openedDate: body.openedDate ? new Date(body.openedDate) : new Date(),
      lastUpdated: new Date(),
    });

    // Auto-fire admin notification
    Notification.create({
      type: "order",
      title: `🍔 New Order Placed (${newCase.caseId})`,
      description: `${newCase.clientName} placed a delivery order for "${newCase.title.substring(0, 60)}" (${newCase.caseReferenceNumber || `Rs. ${body.total || ""}`}).`,
      link: `/admin/cases`,
      read: false,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: newCase }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
