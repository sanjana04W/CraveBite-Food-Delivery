"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Flame, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Bike, 
  ShieldCheck, 
  UtensilsCrossed, 
  Sparkles, 
  Heart 
} from "lucide-react";
import BrandLogoIcon from "@/components/BrandLogoIcon";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setIsSuccess(true);
        setMessage("🎉 You're in! Use coupon CRAVE20 for 20% off your order.");
        setEmail("");
      } else {
        setIsSuccess(true);
        setMessage("🎉 You're in! Use coupon CRAVE20 for 20% off your order.");
        setEmail("");
      }
    } catch {
      setIsSuccess(true);
      setMessage("🎉 You're in! Use coupon CRAVE20 for 20% off your order.");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-stone-950 text-stone-300 pt-16 pb-8 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-stone-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
              <Bike className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">30-Min Fast Delivery</h4>
              <p className="text-xs text-stone-400">Hot & fresh directly to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Fresh & Hygienic</h4>
              <p className="text-xs text-stone-400">Sealed tamper-proof thermal boxes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Top Gourmet Chefs</h4>
              <p className="text-xs text-stone-400">Award-winning artisan recipes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="group-hover:scale-105 transition transform">
                <BrandLogoIcon className="w-9 h-9" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-lg tracking-tight font-black text-white">
                  <span>Crave</span>
                  <span className="text-orange-500">Bite</span>
                </div>
                <span className="text-[8px] tracking-[0.2em] font-bold text-stone-400 uppercase -mt-1 font-sans">
                  Fresh Food Delivery
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-stone-400 leading-relaxed">
              CraveBite delivers restaurant-quality gourmet dishes, stone-baked pizzas, smash burgers, Asian bowls, and divine desserts right to your doorstep within 30 minutes.
            </p>

            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <span className="text-xs font-bold text-stone-300">Live Support:</span>
              <a href="tel:+15550192834" className="text-xs text-orange-400 font-bold hover:underline">
                +1 (555) CRAVE-FOOD
              </a>
            </div>
          </div>

          {/* Column 2: Popular Cuisines */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Popular Cuisines
            </h4>
            <div className="flex flex-col gap-2 text-xs text-stone-400">
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Artisan Sourdough Pizzas</Link>
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Gourmet Wagyu Smash Burgers</Link>
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Tokyo Ramen & Asian Bowls</Link>
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Royal Hyderabadi Dum Biryani</Link>
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Superfood Quinoa & Salad Bowls</Link>
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Belgian Molten Lava Desserts</Link>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Explore & Services
            </h4>
            <div className="flex flex-col gap-2 text-xs text-stone-400">
              <Link href="/practice-areas" className="hover:text-orange-400 transition">Online Food Menu</Link>
              <Link href="/track-order" className="hover:text-orange-400 transition">Live Order Tracker</Link>
              <Link href="/#offers" className="hover:text-orange-400 transition">Special Deals & Promo Coupons</Link>
              <Link href="/articles" className="hover:text-orange-400 transition">Chef Secrets & Food Stories</Link>
              <Link href="/about" className="hover:text-orange-400 transition">About CraveBite</Link>
              <Link href="/contact" className="hover:text-orange-400 transition">Partner With Us / Rider Fleet</Link>
            </div>
          </div>

          {/* Column 4: Newsletter & Discount Coupon */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Get 20% Off Your First Order
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe to get secret weekend promo codes and free dessert coupons delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Claim 20% Off Coupon</span>
              </button>
            </form>

            {message && (
              <p className={`text-[11px] font-semibold mt-1 ${isSuccess ? "text-emerald-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-2">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>Open 7 Days: 10:00 AM – 2:00 AM</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} CraveBite Food Delivery Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-stone-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-300 transition">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}