"use client";

import React, { use } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Share2, 
  UtensilsCrossed, 
  ShoppingBag 
} from "lucide-react";
import { articlesData } from "@/data/practiceAreas";
import { foodArticlesData } from "@/data/articlesData";
import { useCart } from "@/components/CartContext";

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { setIsCartOpen } = useCart();

  const slug = resolvedParams.slug;
  const article = foodArticlesData[slug] || articlesData[slug] || Object.values(articlesData)[0];

  const relatedArticles = Object.values(articlesData)
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-stone-500 font-bold">
          <Link href="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link href="/articles" className="hover:text-orange-600 transition">Food Stories</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full border border-orange-200">
          {article.category}
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-stone-950 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-stone-500 pt-2">
          <span className="flex items-center gap-1.5 text-stone-800">
            <User className="w-4 h-4 text-orange-600" /> {article.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-orange-600" /> {article.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-600" /> {article.readingTime}
          </span>
        </div>
      </section>

      {/* Hero Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <div className="aspect-16/9 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900">
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        {article.summary && (
          <div className="p-6 bg-orange-50/80 border-l-4 border-orange-600 rounded-2xl mb-8 text-stone-800 text-sm font-semibold leading-relaxed">
            {article.summary}
          </div>
        )}

        <div className="space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">
          {article.content?.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-stone-950">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-stone-600">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Order Food CTA within article */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg sm:text-xl font-black">Craving something delicious?</h3>
            <p className="text-xs text-orange-100 mt-1">Get our chef-special dishes delivered fresh to your door in 30 mins.</p>
          </div>
          <Link
            href="/practice-areas"
            className="px-6 py-3 bg-white text-orange-600 hover:bg-stone-100 rounded-xl text-xs font-black shadow-md transition transform active:scale-95 shrink-0 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Menu Now</span>
          </Link>
        </div>
      </article>

      {/* Related Stories */}
      {relatedArticles.length > 0 && (
        <section className="bg-stone-100 py-16 border-t border-stone-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-stone-950 mb-8">More Culinary Stories</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/articles/${rel.slug}`}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition group flex flex-col"
                >
                  <div className="aspect-16/9 overflow-hidden bg-stone-100">
                    <img
                      src={rel.heroImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        {rel.category}
                      </span>
                      <h3 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 transition mt-2">
                        {rel.title}
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-orange-600">
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}