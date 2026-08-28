import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import Case from "@/app/models/Case";
import AdminProfile from "@/app/models/AdminProfile";

export async function GET() {
  try {
    await dbConnect();

    const [clientsCount, casesCount, activeCasesCount, completedCasesCount, profile] = await Promise.all([
      Client.countDocuments(),
      Case.countDocuments(),
      Case.countDocuments({ status: "Active" }),
      Case.countDocuments({ status: { $in: ["Completed", "Closed"] } }),
      AdminProfile.findOne({ profileId: "main" }).lean(),
    ]);

    // Parse years of experience from profile (e.g. "12", "12 Years", "15+")
    let years = 15;
    if (profile && (profile as any).experience) {
      const parsed = parseInt(String((profile as any).experience).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed) && parsed > 0) {
        years = parsed;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalClients: clientsCount,
        totalCases: casesCount,
        activeCases: activeCasesCount,
        completedCases: completedCasesCount,
        yearsExperience: years,
        satisfactionRate: 98,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
