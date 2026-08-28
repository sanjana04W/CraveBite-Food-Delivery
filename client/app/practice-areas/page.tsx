"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Flame, 
  ShoppingBag, 
  Clock, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  UtensilsCrossed, 
  Tag, 
  Bike,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useConsultation } from "@/components/ConsultationContext";
import { menuItemsData, foodCategories, MenuItem } from "@/data/menuData";

export default function MenuPage() {
  const { addToCart } = useCart();
  const { openModal } = useConsultation();

  const [activeCategory, setActiveCategory] = useState("all");
  const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non-veg" | "chef-special">("all");
  const [search, setSearch] = useState("");
  const [liveDishes, setLiveDishes] = useState<MenuItem[]>(menuItemsData);
  const [loadingDishes, setLoadingDishes] = useState(true);

  // Fetch live dishes from admin-managed database
  useEffect(() => {
    const fetchDishes = async () => {
      setLoadingDishes(true);
      try {
        const res = await fetch("/api/practice-areas");
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: MenuItem[] = data.data.map((item: any) => ({
            id: item._id || item.slug,
            slug: item.slug,
            name: item.title || item.name,
            category: item.category || "Artisan Pizzas",
            categorySlug: (item.category || "artisan-pizzas").toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and"),
            price: typeof item.price === "number" ? item.price : 15.99,
            rating: item.rating || 4.9,
            reviewsCount: item.reviewsCount || 120,
            prepTime: item.prepTime || "20 min",
            calories: item.calories || 550,
            isVeg: item.isVeg !== undefined ? item.isVeg : true,
            isChefSpecial: item.isChefSpecial || false,
            isPopular: true,
            image: item.image || item.heroImage || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
            description: item.description || "",
            customizations: item.customizations || [],
          }));
          setLiveDishes(mapped);
        }
      } catch (err) {
        console.error("Using local menu data as fallback:", err);
        setLiveDishes(menuItemsData);
      } finally {
        setLoadingDishes(false);
      }
    };
    fetchDishes();
  }, []);

  const filteredDishes = liveDishes.filter((dish) => {
    const matchesCat = activeCategory === "all" || dish.categorySlug === activeCategory;
    const matchesSearch =
      search === "" ||
      dish.name.toLowerCase().includes(search.toLowerCase()) ||
      dish.description.toLowerCase().includes(search.toLowerCase());

    let matchesDiet = true;
    if (dietFilter === "veg") matchesDiet = dish.isVeg;
    if (dietFilter === "non-veg") matchesDiet = !dish.isVeg;
    if (dietFilter === "chef-special") matchesDiet = !!dish.isChefSpecial;

    return matchesCat && matchesSearch && matchesDiet;
  });

  const whyChooseFood = [
    {
      title: "100% Farm-Fresh Ingredients",
      description: "Organic seasonal produce, certified flour, and farm-raised meats with zero preservatives.",
    },
    {
      title: "30-Minute Speed Guarantee",
      description: "Riders equipped with insulated thermal bags to ensure peak heat and crispiness.",
    },
    {
      title: "Master Chef Recipes",
      description: "Authentic culinary heritage crafted by award-winning head chefs and pizzaiolos.",
    },
    {
      title: "Tamper-Evident Packaging",
      description: "100% sealed, contactless, and eco-friendly recyclable food boxes.",
    },
    {
      title: "Customizable Toppings & Diets",
      description: "Gluten-free crusts, vegan cheeses, extra sauces, and customizable spice levels.",
    },
    {
      title: "Live GPS Delivery Tracker",
      description: "Watch your delivery courier move in real-time from our kitchen to your door.",
    },
  ];

  return (
    <div className="w-full bg-stone-50 text-stone-900 font-sans">
      
      {/* ========================================================= */}
      {/* 1. HERO BANNER                                            */}
      {/* ========================================================= */}
      <section 
        className="relative w-full min-h-[420px] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-12 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.85) 60%, rgba(17, 24, 39, 0.6) 100%), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          
          <div className="flex items-center gap-2 text-xs text-orange-200 mb-4 font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-400">Gourmet Food Menu</span>
          </div>

          <span className="inline-block bg-orange-600/90 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 shadow-xs">
            Piping Hot & Fast
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight">
            Delicious Online Food Menu
          </h1>

          <p className="max-w-xl text-stone-300 text-xs sm:text-sm leading-relaxed font-medium">
            Browse our chef-crafted wood-fired sourdough pizzas, smash burgers, Tokyo ramen, and artisan desserts. Order online for 30-minute delivery.
          </p>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CUISINE CATEGORIES SHOWCASE                            */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Category Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Signature Cuisines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1">
              Explore Our Specialty Kitchens
            </h2>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes or ingredients..."
              className="w-full bg-white border border-stone-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-semibold shadow-xs"
            />
          </div>
        </div>

        {/* Cuisine Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {foodCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? "all" : cat.slug)}
              className={`rounded-3xl overflow-hidden border p-5 transition-shadow duration-300 flex flex-col justify-between cursor-pointer group ${
                activeCategory === cat.slug
                  ? "bg-orange-50/80 border-orange-500 shadow-lg ring-2 ring-orange-400/20"
                  : "bg-white border-stone-200 shadow-xs hover:shadow-md hover:border-orange-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                  {cat.itemCount} Dishes
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-orange-600">
                <span>{activeCategory === cat.slug ? "Viewing Dishes ✓" : "Browse Category"}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dietary Switcher */}
        <div className="flex items-center gap-2 mb-8 bg-white p-2.5 rounded-2xl border border-stone-200 w-fit">
          <button
            onClick={() => setDietFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              dietFilter === "all" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            All Dishes
          </button>
          <button
            onClick={() => setDietFilter("veg")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              dietFilter === "veg" ? "bg-emerald-700 text-white" : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pure Vegetarian</span>
          </button>
          <button
            onClick={() => setDietFilter("non-veg")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              dietFilter === "non-veg" ? "bg-red-700 text-white" : "text-red-700 hover:bg-red-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Non-Vegetarian</span>
          </button>
          <button
            onClick={() => setDietFilter("chef-special")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              dietFilter === "chef-special" ? "bg-amber-600 text-white" : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Chef Specials</span>
          </button>
        </div>

        {/* Dishes Listing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min((idx % 4) * 0.08, 0.3) }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                  {dish.category}
                </span>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{dish.rating}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-[11px] font-semibold text-stone-400">
                    <span className="flex items-center gap-1 text-orange-600">
                      <Clock className="w-3 h-3" /> {dish.prepTime}
                    </span>
                    <span>•</span>
                    <span>{dish.calories} kcal</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-base font-black text-stone-950">
                    Rs. {dish.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(dish, 1)}
                    className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 transition transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ========================================================= */}
      {/* 3. WHY CHOOSE CRAVEBITE SECTION                           */}
      {/* ========================================================= */}
      <section className="bg-stone-100 py-16 lg:py-24 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                  alt="Kitchen Quality Standards"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-6 right-6 bg-orange-600 text-white p-5 rounded-2xl shadow-xl flex flex-col items-center text-center">
                <span className="text-2xl font-black">100%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Fresh Promise</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                The CraveBite Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-950 mt-1 mb-8">
                Gourmet Dining Standards Delivered to You
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseFood.map((point, idx) => (
                  <motion.div 
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{point.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{point.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. TABLE RESERVATION / PARTY CTA BANNER                   */}
      {/* ========================================================= */}
      <section className="py-16 bg-stone-900 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="max-w-4xl mx-auto px-4 text-center"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-white/10 px-3 py-1 rounded-full">
            VIP Event & Catering Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-4">
            Need Custom Catering or Table Booking?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mb-8 max-w-xl mx-auto">
            Book private dining tables or let our master chefs cater your birthday parties, corporate summits, and weekend celebrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openModal}
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-bold shadow-lg transition transform active:scale-95 cursor-pointer"
            >
              Reserve Table / Catering
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-bold transition"
            >
              Contact Chef Support
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}