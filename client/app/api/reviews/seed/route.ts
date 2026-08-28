import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Review from "@/app/models/Review";

const sampleReviews = [
  {
    name: "Sarah Chen",
    role: "Property Dispute Client",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    quote: "The team handled my property dispute with remarkable professionalism. I was kept informed at every stage and the outcome exceeded my expectations. I couldn't recommend them more highly.",
    rating: 5,
    status: "Approved",
    featured: true,
  },
  {
    name: "Marcus Williams",
    role: "Corporate Law Client",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop",
    quote: "Exceptional corporate legal advice that helped us navigate a complex merger. The attention to detail and responsiveness made all the difference during a stressful period.",
    rating: 5,
    status: "Approved",
    featured: true,
  },
  {
    name: "Elena Rostova",
    role: "Family Law Client",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
    quote: "Compassionate, dedicated, and highly skilled counsel during a sensitive child custody negotiation. They achieved the best possible outcome for my family.",
    rating: 5,
    status: "Approved",
    featured: true,
  },
  {
    name: "David Perera",
    role: "Labour Dispute Client",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    quote: "Very thorough analysis of my employment contract and prompt resolution with my former employer. Honest and transparent legal support throughout.",
    rating: 5,
    status: "Approved",
    featured: true,
  },
];

export async function POST() {
  try {
    await dbConnect();
    const count = await Review.countDocuments();
    if (count > 0) {
      return NextResponse.json({ success: false, message: `Already seeded (${count} reviews exist).` }, { status: 409 });
    }
    await Review.insertMany(sampleReviews);
    return NextResponse.json({ success: true, message: `Seeded ${sampleReviews.length} reviews.` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
