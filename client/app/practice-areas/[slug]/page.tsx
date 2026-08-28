"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { 
  Flame, 
  ShoppingBag, 
  Clock, 
  Star, 
  ChevronRight, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  UtensilsCrossed, 
  Bike,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useConsultation } from "@/components/ConsultationContext";
import { practiceAreasData } from "@/data/practiceAreas";
import { menuItemsData } from "@/data/menuData";

export default function CuisineDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { addToCart } = useCart();
  const { openModal } = useConsultation();

  // Look up from practiceAreasData or fallback to first
  const currentCategory = practiceAreasData[resolvedParams.slug] || practiceAreasData["artisan-pizzas"] || Object.values(practiceAreasData)[0];

  // Get matching dishes
  const categoryDishes = menuItemsData.filter((d) => 
    resolvedParams.slug.includes(d.categorySlug) || 
    d.category.toLowerCase().includes(currentCategory.title.toLowerCase().split(" ")[0])
  );

  const displayDishes = categoryDishes.length > 0 ? categoryDishes : menuItemsData.slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-stone-500 font-bold">
          <Link href="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/practice-areas" className="hover:text-orange-600 transition">Food Menu</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900">{currentCategory.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-5">
            <span className="inline-block bg-orange-100 text-orange-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-orange-200">
              Signature Specialty
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-stone-950 tracking-tight leading-tight">
              {currentCategory.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
              {currentCategory.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#dishes"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition transform active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order From This Cuisine</span>
              </a>

              <button
                onClick={openModal}
                className="px-6 py-3 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Book Table / Catering</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 bg-stone-900">
              <img
                src={currentCategory.heroImage}
                alt={currentCategory.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Kitchen Standards & Highlights */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Kitchen Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1">
              Why Our {currentCategory.title} Stands Out
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentCategory.services?.map((srv, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-orange-300 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-3">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-stone-900 mb-1">{srv.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Dishes Section */}
      <section id="dishes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Freshly Prepared
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1">
              Popular Dishes in this Category
            </h2>
          </div>
          <Link
            href="/practice-areas"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition flex flex-col group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
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
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {currentCategory.faqs && currentCategory.faqs.length > 0 && (
        <section className="bg-stone-100 py-16 border-t border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                Good to Know
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {currentCategory.faqs.map((faq, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                  <h4 className="text-sm font-bold text-stone-900 mb-2">{faq.question}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}