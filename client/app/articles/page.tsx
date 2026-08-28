"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Mail, 
  Send, 
  CheckCircle2, 
  Tag,
  Loader2
} from "lucide-react";

const CATEGORIES = [
  "All Stories",
  "Culinary Secrets",
  "Chef's Craft",
  "Fresh & Healthy",
  "Dining Guides",
  "Street Food"
];

interface ArticleItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  summary: string;
  excerpt?: string;
  heroImage: string;
  featured?: boolean;
}

export default function FoodArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [articlesList, setArticlesList] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setArticlesList(data.data.map((a: any) => ({
            slug: a.slug,
            title: a.title,
            category: a.category,
            date: a.date || new Date(a.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            readingTime: a.readingTime || "5 min read",
            summary: a.summary || a.excerpt || "",
            heroImage: a.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop",
            featured: a.featured || false,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articlesList.filter((art) => {
    const matchesCategory = selectedCategory === "All Stories" || art.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail.includes("@")) {
      setSubscribeSuccess(true);
      setSubscribeEmail("");
      setTimeout(() => setSubscribeSuccess(false), 4000);
    }
  };

  return (
    <div className="w-full bg-stone-50 text-stone-900 font-sans">
      
      {/* Hero Header */}
      <section 
        className="relative w-full min-h-[380px] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-12 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.85) 60%, rgba(17, 24, 39, 0.6) 100%), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-2 text-xs text-orange-200 mb-4 font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-400">Culinary Stories & Recipes</span>
          </div>

          <span className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 shadow-xs">
            From Master Chefs
          </span>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            Food Stories, Recipes & Culinary Arts
          </h1>

          <p className="max-w-xl text-stone-300 text-xs sm:text-sm leading-relaxed font-medium">
            Explore secrets behind 48-hour sourdough fermentation, authentic wagyu searing techniques, farm-fresh sourcing, and dining guides.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-orange-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes & articles..."
              className="w-full bg-white border border-stone-200 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-semibold"
            />
          </div>

        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-xs font-bold">Loading culinary stories...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center text-stone-400">
            <p className="text-sm font-bold text-stone-600">No articles found.</p>
            <p className="text-xs mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/articles/${art.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="aspect-16/10 overflow-hidden relative bg-stone-100">
                  <img
                    src={art.heroImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-stone-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" /> {art.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-600" /> {art.readingTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-extrabold text-orange-600">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </section>

      {/* Newsletter Section */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
            Exclusive Recipes & Discounts
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-3">
            Get Weekly Chef Tips & Secret Promo Codes
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mb-6 max-w-lg mx-auto">
            Join 20,000+ food lovers who receive our weekend recipes, restaurant discounts, and chef spotlights.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Enter your email..."
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-400 focus:outline-hidden focus:border-orange-500 font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              Subscribe
            </button>
          </form>

          {subscribeSuccess && (
            <p className="text-xs text-emerald-400 font-bold mt-3">
              🎉 Thanks for subscribing! Check your inbox for your 20% discount code.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}