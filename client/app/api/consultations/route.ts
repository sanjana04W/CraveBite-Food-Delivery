import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Consultation from "@/app/models/Consultation";
import Notification from "@/app/models/Notification";


function generateRequestId() {
  const year = new Date().getFullYear();

  const randomNumber = Math.floor(100 + Math.random() * 900);

  return `CR-${year}-${randomNumber}`;
}

// ==========================================
// POST - Create consultation request
// ==========================================

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      practiceArea,
      description,
      consent,
    } = body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !practiceArea ||
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        {
          success: false,
          error: "Please agree to be contacted regarding your consultation request.",
        },
        { status: 400 }
      );
    }

    // Generate unique request ID
    let requestId = generateRequestId();

    let existingRequest = await Consultation.findOne({
      requestId,
    });

    while (existingRequest) {
      requestId = generateRequestId();

      existingRequest = await Consultation.findOne({
        requestId,
      });
    }

    // Create consultation
    const consultation = await Consultation.create({
      requestId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      practiceArea: practiceArea.trim(),
      description: description.trim(),
      consent: true,
      status: "New",
      submittedDate: new Date(),
    });

    // Fire notification (non-blocking)
    Notification.create({
      type: "Consultation",
      title: "New Consultation Request",
      description: `${fullName.trim()} submitted a new consultation request for ${practiceArea.trim()}.`,
      link: "/admin/consultations",
    }).catch(() => {});

    return NextResponse.json(

      {
        success: true,
        message: "Consultation request submitted successfully.",
        consultation: {
          id: consultation._id,
          requestId: consultation.requestId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Consultation POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unable to submit consultation request.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// GET - Get all consultation requests
// ==========================================

export async function GET() {
  try {
    await dbConnect();

    const consultations = await Consultation.find({})
      .sort({ submittedDate: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        consultations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Consultation GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unable to load consultation requests.",
      },
      { status: 500 }
    );
  }
}