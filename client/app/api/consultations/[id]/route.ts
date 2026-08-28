import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Consultation from "@/app/models/Consultation";
import mongoose from "mongoose";

// ==========================================
// GET - Get one consultation
// ==========================================

export async function GET(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid consultation ID.",
        },
        { status: 400 }
      );
    }

    const consultation = await Consultation.findById(id).lean();

    if (!consultation) {
      return NextResponse.json(
        {
          success: false,
          error: "Consultation request not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        consultation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get consultation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unable to load consultation.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PATCH - Update consultation status
// ==========================================

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid consultation ID.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { status } = body;

    if (!["New", "Viewed", "Contacted"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status.",
        },
        { status: 400 }
      );
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!consultation) {
      return NextResponse.json(
        {
          success: false,
          error: "Consultation request not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        consultation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update consultation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Unable to update consultation.",
      },
      { status: 500 }
    );
  }
}
// ==========================================
// DELETE - Delete a consultation request
// ==========================================

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid consultation ID." }, { status: 400 });
    }
    const consultation = await Consultation.findByIdAndDelete(id);
    if (!consultation) {
      return NextResponse.json({ success: false, error: "Consultation not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Deleted successfully." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Unable to delete." }, { status: 500 });
  }
}
