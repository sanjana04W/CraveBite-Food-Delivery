import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Article from "@/app/models/Article";
import { articlesData } from "@/data/practiceAreas";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const query = all ? {} : { status: "Published" };
    const articles = await Article.find(query).sort({ createdAt: -1 });
    if (articles && articles.length > 0) {
      return NextResponse.json({ success: true, data: articles }, { status: 200 });
    }
  } catch (_) {}

  // Fallback food stories
  const fallbackArticles = Object.values(articlesData).map((art, idx) => ({
    _id: `art-${idx}`,
    slug: art.slug,
    title: art.title,
    category: art.category,
    date: art.date,
    readingTime: art.readingTime,
    excerpt: art.summary,
    heroImage: art.heroImage,
    featured: idx === 0,
    status: "Published",
    createdAt: new Date().toISOString(),
  }));

  return NextResponse.json({ success: true, data: fallbackArticles }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    const existing = await Article.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ success: false, error: "An article with this slug already exists." }, { status: 409 });
    }
    const article = await Article.create(body);
    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
