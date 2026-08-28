import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import Case from "@/app/models/Case";
import Appointment from "@/app/models/Appointment";
import LegalDocument from "@/app/models/LegalDocument";
import Article from "@/app/models/Article";
import ContactMessage from "@/app/models/ContactMessage";
import Consultation from "@/app/models/Consultation";

import Review from "@/app/models/Review";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        success: true,
        results: {
          clients: [],
          cases: [],
          appointments: [],
          documents: [],
          articles: [],
          messages: [],
          consultations: [],
          reviews: [],
        },
      });
    }

    const regex = new RegExp(q, "i");

    // Search across collections in parallel
    const [clients, cases, appointments, documents, articles, messages, consultations, reviews] =
      await Promise.all([
        Client.find({
          $or: [
            { clientName: regex },
            { firstName: regex },
            { lastName: regex },
            { email: regex },
            { phone: regex },
            { clientId: regex },
          ],
        })
          .limit(5)
          .select("clientId clientName firstName lastName email phone")
          .lean(),

        Case.find({
          $or: [
            { title: regex },
            { clientName: regex },
            { caseId: regex },
            { caseReferenceNumber: regex },
            { practiceArea: regex },
          ],
        })
          .limit(5)
          .select("caseId title clientName status practiceArea priority")
          .lean(),

        Appointment.find({
          $or: [
            { clientName: regex },
            { appointmentId: regex },
            { clientEmail: regex },
            { consultationType: regex },
          ],
        })
          .limit(5)
          .select("appointmentId clientName dateISO time status consultationType")
          .lean(),

        LegalDocument.find({
          $or: [
            { name: regex },
            { docId: regex },
            { clientName: regex },
            { caseTitle: regex },
            { documentType: regex },
          ],
        })
          .limit(5)
          .select("docId name fileUrl documentType status size")
          .lean(),

        Article.find({
          $or: [{ title: regex }, { category: regex }, { slug: regex }],
        })
          .limit(5)
          .select("slug title category status")
          .lean(),

        ContactMessage.find({
          $or: [
            { name: regex },
            { email: regex },
            { subject: regex },
            { message: regex },
          ],
        })
          .limit(5)
          .select("_id name email subject status")
          .lean(),

        Consultation.find({
          $or: [
            { name: regex },
            { email: regex },
            { phone: regex },
            { practiceArea: regex },
          ],
        })
          .limit(5)
          .select("_id name email practiceArea preferredDate status")
          .lean(),

        Review.find({
          $or: [
            { name: regex },
            { role: regex },
            { quote: regex },
          ],
        })
          .limit(5)
          .select("_id name role quote rating status")
          .lean(),
      ]);

    const totalMatches =
      clients.length +
      cases.length +
      appointments.length +
      documents.length +
      articles.length +
      messages.length +
      consultations.length +
      reviews.length;

    return NextResponse.json({
      success: true,
      query: q,
      totalMatches,
      results: {
        clients,
        cases,
        appointments,
        documents,
        articles,
        messages,
        consultations,
        reviews,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
