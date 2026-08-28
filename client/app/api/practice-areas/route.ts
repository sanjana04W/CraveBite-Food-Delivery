import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import PracticeArea from "@/app/models/PracticeArea";
import { menuItemsData } from "@/data/menuData";

// GET /api/practice-areas — fetch all dishes
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const query = all ? {} : { status: "Published", visibility: true };
    let areas = await PracticeArea.find(query).sort({ order: 1, createdAt: 1 });

    // If database has no dishes yet, auto-seed with initial gourmet catalog
    if (!areas || areas.length === 0) {
      const seedItems = menuItemsData.map((item, idx) => ({
        slug: item.id || `dish-${idx + 1}`,
        title: item.name,
        category: item.category,
        iconName: "Flame",
        description: item.description,
        subtitle: `${item.calories} kcal • ${item.prepTime}`,
        heroImage: item.image,
        image: item.image,
        price: item.price,
        prepTime: item.prepTime,
        calories: item.calories,
        isVeg: item.isVeg,
        rating: item.rating,
        reviewsCount: item.reviewsCount,
        isChefSpecial: item.isChefSpecial || false,
        customizations: item.customizations || [],
        overviewDescription: item.description,
        services: [],
        commonMatters: [],
        faqs: [],
        status: "Published",
        visibility: true,
        order: idx + 1,
        views: item.reviewsCount * 12,
      }));

      await PracticeArea.insertMany(seedItems);
      areas = await PracticeArea.find(query).sort({ order: 1, createdAt: 1 });
    }

    return NextResponse.json({ success: true, data: areas }, { status: 200 });
  } catch (error: any) {
    // Fallback to in-memory menu items
    const fallbackList = menuItemsData.map((item, idx) => ({
      _id: `pa-${idx}`,
      slug: item.id,
      title: item.name,
      category: item.category,
      iconName: "Flame",
      description: item.description,
      subtitle: `${item.calories} kcal • ${item.prepTime}`,
      heroImage: item.image,
      image: item.image,
      price: item.price,
      prepTime: item.prepTime,
      calories: item.calories,
      isVeg: item.isVeg,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      isChefSpecial: item.isChefSpecial || false,
      customizations: item.customizations || [],
      status: "Published",
      visibility: true,
      order: idx + 1,
    }));
    return NextResponse.json({ success: true, data: fallbackList }, { status: 200 });
  }
}

// POST /api/practice-areas — admin creates a new dish
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const title = body.title || body.name;
    let slug = body.slug;
    if (!slug && title) {
      slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    if (!slug) slug = `dish-${Date.now()}`;

    // Ensure unique slug
    const existing = await PracticeArea.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newDish = await PracticeArea.create({
      slug,
      title: title || "New Gourmet Dish",
      category: body.category || "Artisan Pizzas",
      iconName: body.iconName || "Flame",
      description: body.description || "",
      subtitle: body.subtitle || `${body.calories || 500} kcal • ${body.prepTime || "20 min"}`,
      heroImage: body.image || body.heroImage || "",
      image: body.image || body.heroImage || "",
      price: typeof body.price === "number" ? body.price : parseFloat(body.price) || 15.99,
      prepTime: body.prepTime || "20 min",
      calories: typeof body.calories === "number" ? body.calories : parseInt(body.calories) || 500,
      isVeg: typeof body.isVeg === "boolean" ? body.isVeg : true,
      rating: body.rating || 4.9,
      reviewsCount: body.reviewsCount || 1,
      isChefSpecial: body.isChefSpecial || false,
      customizations: body.customizations || [],
      status: body.status || "Published",
      visibility: body.visibility !== undefined ? body.visibility : true,
      order: body.order || 0,
    });

    return NextResponse.json({ success: true, data: newDish }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
