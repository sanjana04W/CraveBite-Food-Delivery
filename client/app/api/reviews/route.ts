import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Review from "@/app/models/Review";
import Notification from "@/app/models/Notification";

// GET /api/reviews — fetch reviews (all for admin or approved for public)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const search = searchParams.get("search");
    const rating = searchParams.get("rating");
    const status = searchParams.get("status");

    const query: any = {};

    if (!all) {
      query.status = "Approved";
    } else {
      if (status && status !== "All" && status !== "All Statuses") {
        query.status = status;
      }
      if (rating && rating !== "All" && rating !== "All Ratings") {
        query.rating = Number(rating);
      }
      if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [
          { name: regex },
          { role: regex },
          { quote: regex },
        ];
      }
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    // Calculate admin stats
    const allReviews = await Review.find({});
    const total = allReviews.length;
    const approved = allReviews.filter((r) => r.status === "Approved").length;
    const fiveStar = allReviews.filter((r) => r.rating === 5).length;
    const avgRating = total > 0
      ? (allReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / total).toFixed(1)
      : "5.0";

    return NextResponse.json({
      success: true,
      data: reviews,
      stats: { total, approved, fiveStar, avgRating },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/reviews — submit a new client review
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, role, quote, rating, avatar } = body;

    if (!name || !quote) {
      return NextResponse.json(
        { success: false, error: "Please provide your name and review." },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      name: name.trim(),
      role: role?.trim() || "Legal Client",
      quote: quote.trim(),
      rating: Number(rating) || 5,
      avatar: avatar?.trim() || "",
      status: "Approved",
    });

    // Send admin notification
    Notification.create({
      type: "message",
      title: "New Client Review Received",
      description: `${newReview.name} left a ${newReview.rating}-star review: "${newReview.quote.slice(0, 45)}..."`,
      link: "/admin/reviews",
      read: false,
    }).catch(() => {});

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
