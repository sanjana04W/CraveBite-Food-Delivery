"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Flame, 
  ShoppingBag, 
  Clock, 
  Star, 
  MapPin, 
  Search, 
  Sparkles, 
  Bike, 
  ShieldCheck, 
  Award, 
  UtensilsCrossed, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Plus, 
  Check, 
  Heart, 
  Tag, 
  Coffee, 
  Pizza, 
  Salad, 
  Soup,
  Calendar,
  Quote,
  TrendingUp,
  Percent
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useConsultation } from "@/components/ConsultationContext";
import { menuItemsData, foodCategories, specialOffers, MenuItem } from "@/data/menuData";
import { articlesData } from "@/data/practiceAreas";
import LoyaltySection from "@/components/LoyaltySection";

// --- Hero Image Slider Data ---
const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    badge: "Chef Special",
    badgeColor: "bg-orange-600",
    title: "Artisan Truffle & Wagyu Collection",
    subtitle: "Freshly prepared in under 20 minutes",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
    badge: "Bestseller",
    badgeColor: "bg-amber-600",
    title: "Wood-Fired Truffle & Burrata Pizza",
    subtitle: "48h fermented sourdough & buffalo mozzarella",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
    badge: "Trending Now",
    badgeColor: "bg-red-600",
    title: "Double Smash Wagyu Gourmet Burger",
    subtitle: "Aged cheddar, toasted brioche & secret relish",
  },
];

// --- Animated Counter Component ---
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1800;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * (1 - Math.pow(1 - progress, 3)));

      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counterInterval);
        setCount(end);
      }
    }, frameDuration);

    return () => clearInterval(counterInterval);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Home() {
  const { addToCart, applyCoupon, setIsCartOpen } = useCart();
  const { openModal } = useConsultation();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg" | "chef-special">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationInput, setLocationInput] = useState("742 Evergreen Terrace, Downtown");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);
  const [customizationChoices, setCustomizationChoices] = useState<Record<string, string>>({});
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  // Auto-navigate hero slides quickly every 2.0 seconds (pauses on hover)
  useEffect(() => {
    if (isHeroHovered) return;
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isHeroHovered]);

  // Filtered dishes
  const filteredDishes = menuItemsData.filter((dish) => {
    const matchesCategory = selectedCategory === "all" || dish.categorySlug === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDiet = true;
    if (dietaryFilter === "veg") matchesDiet = dish.isVeg;
    if (dietaryFilter === "non-veg") matchesDiet = !dish.isVeg;
    if (dietaryFilter === "chef-special") matchesDiet = !!dish.isChefSpecial;

    return matchesCategory && matchesSearch && matchesDiet;
  });

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const openDishCustomizer = (dish: MenuItem) => {
    setSelectedDishModal(dish);
    const initialChoices: Record<string, string> = {};
    dish.customizations?.forEach((group) => {
      if (group.options.length > 0) {
        initialChoices[group.name] = group.options[0].label;
      }
    });
    setCustomizationChoices(initialChoices);
  };

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Verified Foodie • 42 Orders",
      avatar: "MV",
      rating: 5,
      comment: "The Truffle Burrata Margherita arrived steaming hot in 22 minutes! Sourdough crust had the most incredible crunch and leopard char. CraveBite is hands down the best delivery app in the city.",
      dish: "Truffle Burrata Margherita"
    },
    {
      name: "Elena Rostova",
      role: "Verified Foodie • 28 Orders",
      avatar: "ER",
      rating: 5,
      comment: "The Double Smash Wagyu Cheeseburger is pure perfection. Melty aged cheddar, caramelized onions, and zero grease. Packaging is 10/10, everything stayed crispy!",
      dish: "Double Smash Wagyu Burger"
    },
    {
      name: "Devon James",
      role: "Verified Foodie • 19 Orders",
      avatar: "DJ",
      rating: 5,
      comment: "Ordered the Royal Hyderabadi Dum Biryani for a family weekend dinner. Fragrant saffron aroma filled the entire room as soon as we unsealed the handi. Absolute royalty!",
      dish: "Royal Dum Biryani"
    }
  ];

  return (
    <div className="w-full bg-stone-50 text-stone-900 font-sans overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-orange-50/80 via-amber-50/40 to-stone-50 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 text-orange-800 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                <Bike className="w-3.5 h-3.5 text-orange-600" />
                <span>Superfast 30-Minute Food Delivery in Your Area</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.1]">
                Crave It? <br />
                We Deliver It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Fresh & Hot.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed font-medium">
                Indulge in artisanal wood-fired pizzas, crispy Wagyu smash burgers, authentic Tokyo ramen bowls, dum biryanis, and decadent molten desserts crafted by master chefs.
              </p>

              {/* Delivery Search Bar */}
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-stone-200/80 flex flex-col sm:flex-row items-center gap-2 max-w-xl">
                <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
                  <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter delivery address..."
                    className="w-full text-xs sm:text-sm font-semibold text-stone-900 placeholder-stone-400 focus:outline-hidden"
                  />
                </div>
                <a
                  href="#menu"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-6 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition transform active:scale-95 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Food</span>
                </a>
              </div>

              {/* Quick Perks */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-stone-700">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Hygienic Thermal Packaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Free Delivery on 1st Order (Rs. 0 Fee)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Live GPS Tracking</span>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Cards (Auto-Navigating 3-Image Slider) */}
            <div className="lg:col-span-5 relative">
              <div 
                className="relative mx-auto max-w-md"
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseLeave={() => setIsHeroHovered(false)}
              >
                
                {/* Main Hero Image Slider */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 bg-stone-950 group select-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroSlideIdx}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={HERO_SLIDES[heroSlideIdx].image}
                        alt={HERO_SLIDES[heroSlideIdx].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                        <span className={`${HERO_SLIDES[heroSlideIdx].badgeColor} text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-xs inline-block mb-1`}>
                          {HERO_SLIDES[heroSlideIdx].badge}
                        </span>
                        <h3 className="text-lg font-black leading-tight drop-shadow-sm">{HERO_SLIDES[heroSlideIdx].title}</h3>
                        <p className="text-xs text-stone-200 mt-0.5 drop-shadow-xs">{HERO_SLIDES[heroSlideIdx].subtitle}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Previous / Next Arrow Controls (Visible on hover or mobile) */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => setHeroSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                      aria-label="Previous slide"
                      className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer border border-white/20 shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
                      aria-label="Next slide"
                      className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer border border-white/20 shadow-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Slide Indicators / Dots */}
                  <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setHeroSlideIdx(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === heroSlideIdx
                            ? "w-6 bg-gradient-to-r from-orange-500 to-amber-400 shadow-xs"
                            : "w-1.5 bg-white/50 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Badge 1: 30 Min Delivery */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 animate-bounce duration-1000 z-20">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-stone-950">Fast Delivery</div>
                    <div className="text-[10px] font-bold text-orange-600">Avg. 25 - 30 mins</div>
                  </div>
                </div>

                {/* Floating Badge 2: 4.9 Star Rating */}
                <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-stone-950">4.9 / 5 Rating</div>
                    <div className="text-[10px] font-bold text-stone-500">50k+ Happy Foodies</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Live Platform Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 p-6 bg-white rounded-3xl shadow-lg border border-stone-100">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-orange-600">
                <Counter value={50000} suffix="+" />
              </div>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Orders Delivered</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-stone-900">
                <Counter value={28} suffix=" min" />
              </div>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Average Speed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">
                <Counter value={120} suffix="+" />
              </div>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Gourmet Dishes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                <Counter value={99} suffix="%" />
              </div>
              <p className="text-xs font-bold text-stone-600 mt-0.5">Positive Foodie Reviews</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SPECIAL OFFERS & COUPONS BANNER (#offers)                              */}
      {/* ========================================================================= */}
      <section id="offers" className="py-12 bg-stone-100 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Exclusive Foodie Discounts
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1">
                Grab Today's Hottest Promo Codes
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-xs">
              Click any coupon to copy and apply automatically to your cart total.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialOffers.map((offer, idx) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br ${offer.bgGradient} overflow-hidden group transition-shadow hover:shadow-2xl`}
              >
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
                  <Percent className="w-36 h-36" />
                </div>

                <span className="inline-block bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-3">
                  {offer.badge}
                </span>

                <div className="text-3xl font-black">{offer.discount}</div>
                <h3 className="text-base font-bold mt-1">{offer.title}</h3>
                <p className="text-xs text-white/80 mt-1 mb-5">{offer.description}</p>

                <div className="flex items-center justify-between bg-black/20 backdrop-blur-xs rounded-2xl p-2 pl-3 border border-white/20">
                  <span className="font-mono text-sm font-black tracking-wider text-white">
                    {offer.code}
                  </span>
                  <button
                    onClick={() => handleCopyCoupon(offer.code)}
                    className="px-3 py-1.5 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs font-extrabold shadow-xs transition transform active:scale-95 cursor-pointer"
                  >
                    {copiedCode === offer.code ? "Applied! ✓" : "Apply Code"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE FOOD MENU CATALOG (#menu)                                  */}
      {/* ========================================================================= */}
      <section id="menu" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Our Delicious Kitchen
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-950 mt-3">
            Explore Handcrafted Dishes
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 font-medium">
            Prepared fresh to order using certified organic produce, authentic Italian flour, and prime meats.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start lg:justify-center mb-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                : "bg-white border border-stone-200 text-stone-700 hover:border-orange-500"
            }`}
          >
            All Cuisines ({menuItemsData.length})
          </button>

          {foodCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                  : "bg-white border border-stone-200 text-stone-700 hover:border-orange-500"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Dietary Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-2xl border border-stone-200">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setDietaryFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                dietaryFilter === "all" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setDietaryFilter("veg")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                dietaryFilter === "veg" ? "bg-emerald-700 text-white" : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietaryFilter("non-veg")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                dietaryFilter === "non-veg" ? "bg-red-700 text-white" : "text-red-700 hover:bg-red-50"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Non-Veg</span>
            </button>
            <button
              onClick={() => setDietaryFilter("chef-special")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                dietaryFilter === "chef-special" ? "bg-amber-600 text-white" : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Chef Specials</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dish or ingredient..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
            />
          </div>

        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min((idx % 4) * 0.08, 0.3) }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group"
            >
              {/* Dish Photo */}
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
                
                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg shadow-xs">
                  {dish.category}
                </span>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{dish.rating}</span>
                </div>

                {/* Veg/Non-Veg & Spice Tags */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  {dish.isVeg ? (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      🌿 Veg
                    </span>
                  ) : (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      🥩 Non-Veg
                    </span>
                  )}
                  {dish.isChefSpecial && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                      ⭐ Chef Special
                    </span>
                  )}
                </div>
              </div>

              {/* Dish Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {dish.prepTime}
                    </span>
                    <span>•</span>
                    <span>{dish.calories} kcal</span>
                    <span>•</span>
                    <span>🌶️ {dish.spiceLevel}</span>
                  </div>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-stone-950">
                      Rs. {dish.price.toFixed(2)}
                    </span>
                    {dish.originalPrice && (
                      <span className="text-xs text-stone-400 line-through ml-1.5 font-medium">
                        Rs. {dish.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {dish.customizations ? (
                    <button
                      onClick={() => openDishCustomizer(dish)}
                      className="flex items-center gap-1 bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(dish, 1)}
                      className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 transition transform active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. HOW CRAVEBITE WORKS                                                    */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Seamless Ordering
            </span>
            <h2 className="text-3xl font-black text-stone-950 mt-2">
              Hot Food at Your Door in 3 Easy Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: 1,
                title: "Choose Your Favorite Dishes",
                desc: "Browse our wood-fired pizzas, gourmet smash burgers, ramen bowls, and dessert menus. Customize crusts, toppings, and sides.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                num: 2,
                title: "Chef Fresh Prep & Packaging",
                desc: "Our kitchen fires up your meal immediately. Every order is packed in tamper-proof, insulated thermal containers.",
                color: "bg-amber-100 text-amber-600",
              },
              {
                num: 3,
                title: "Superfast 30-Min Delivery",
                desc: "Track your rider in real time with live GPS tracking until your piping-hot meal arrives right at your doorstep.",
                color: "bg-emerald-100 text-emerald-600",
              },
            ].map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-3xl bg-stone-50 border border-stone-200 text-center relative group hover:border-orange-300 transition-shadow duration-300 hover:shadow-xl"
              >
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-xl font-black mx-auto mb-4 group-hover:scale-110 transition transform`}>
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-stone-900">{step.title}</h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. LOYALTY & REWARDS: FAMILY FIRST                                        */}
      {/* ========================================================================= */}
      <LoyaltySection />

      {/* ========================================================================= */}
      {/* 6. TABLE RESERVATION & CATERING CTA BANNER                                */}
      {/* ========================================================================= */}
      <section className="py-16 bg-gradient-to-r from-stone-950 via-stone-900 to-orange-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-900/50 px-3 py-1 rounded-full border border-orange-500/30">
                VIP Dining & Party Catering
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">
                Planning a Birthday Party, Corporate Event or Romantic Dinner?
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Reserve prime tables at partner restaurants or book custom live-chef buffet catering for your home and office gatherings.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={openModal}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-xl shadow-orange-500/25 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Book Table / Event Catering</span>
              </button>

              <Link
                href="/contact"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 text-center"
              >
                <span>Partner Your Restaurant</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOODIE REVIEWS & TESTIMONIALS                                          */}
      {/* ========================================================================= */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
            Happy Foodies
          </span>
          <h2 className="text-3xl font-black text-stone-950 mt-2">
            Loved by 50,000+ City Food Lovers
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl flex flex-col justify-between relative transition-shadow duration-300"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-stone-700 leading-relaxed font-medium mb-4">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                    <p className="text-[10px] text-stone-400">{t.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  {t.dish}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. CHEF SECRETS & FOOD STORIES                                            */}
      {/* ========================================================================= */}
      <section className="py-16 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                Culinary Stories
              </span>
              <h2 className="text-3xl font-black text-stone-950 mt-1">
                Chef Secrets & Food Trends
              </h2>
            </div>
            <Link
              href="/articles"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(articlesData).map((art, idx) => (
              <motion.div
                key={art.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="flex flex-col"
              >
                <Link
                  href={`/articles/${art.slug}`}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full"
                >
                  <div className="aspect-16/10 overflow-hidden relative">
                    <img
                      src={art.heroImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-stone-400 mb-1">
                        {art.date} • {art.readingTime}
                      </div>
                      <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                        {art.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-orange-600">
                      <span>Read Full Story</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. DISH CUSTOMIZATION MODAL                                               */}
      {/* ========================================================================= */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100 animate-in zoom-in-95"
          >
            {/* Modal Image Header */}
            <div className="relative aspect-16/9 bg-stone-900">
              <img
                src={selectedDishModal.image}
                alt={selectedDishModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedDishModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-extrabold uppercase bg-orange-600 px-2 py-0.5 rounded-sm">
                  {selectedDishModal.category}
                </span>
                <h3 className="text-lg font-black mt-1">{selectedDishModal.name}</h3>
                <p className="text-xs text-stone-200 line-clamp-1">{selectedDishModal.description}</p>
              </div>
            </div>

            {/* Customization Options */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedDishModal.customizations?.map((group) => (
                <div key={group.name}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    {group.name}
                  </h4>
                  <div className="space-y-1.5">
                    {group.options.map((opt) => (
                      <label
                        key={opt.label}
                        onClick={() =>
                          setCustomizationChoices((prev) => ({
                            ...prev,
                            [group.name]: opt.label,
                          }))
                        }
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          customizationChoices[group.name] === opt.label
                            ? "border-orange-600 bg-orange-50/70 font-bold text-orange-950"
                            : "border-stone-200 text-stone-700 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={group.name}
                            checked={customizationChoices[group.name] === opt.label}
                            onChange={() => {}}
                            className="text-orange-600 focus:ring-orange-500"
                          />
                          <span>{opt.label}</span>
                        </div>
                        {opt.extraPrice > 0 ? (
                          <span className="text-orange-600 font-extrabold">
                            +Rs. {opt.extraPrice.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-stone-400 font-medium">Free</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Price:</span>
                <div className="text-base font-black text-orange-600">
                  Rs. {selectedDishModal.price.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(selectedDishModal, 1, customizationChoices);
                  setSelectedDishModal(null);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
              >
                Add to Cart & Order
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}