"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Bike, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import BrandLogoIcon from "@/components/BrandLogoIcon";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      await refresh();
      // Customer login always redirects to customer store/home
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-stone-950 font-sans text-stone-900">
      
      {/* Left Branding Hero Panel */}
      <div 
        className="lg:w-1/2 min-h-[280px] lg:min-h-screen relative p-8 lg:p-16 flex flex-col justify-between bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 50%, rgba(17, 24, 39, 0.4) 100%), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="group-hover:scale-105 transition transform">
            <BrandLogoIcon className="w-10 h-10" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white">
              <span>Crave</span>
              <span className="text-orange-500">Bite</span>
            </div>
            <p className="text-[9px] uppercase font-bold text-stone-400 -mt-1 tracking-widest">Fresh Food Delivery</p>
          </div>
        </Link>

        <div className="my-auto py-8 space-y-4 max-w-lg">
          <span className="inline-block bg-orange-600/90 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
            Customer Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Order Fast, Eat Fresh, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Track in Real-Time.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
            Sign in to access your order history, save multiple delivery addresses, unlock exclusive weekend promo codes, and manage table reservations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-xs font-bold text-stone-300">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-orange-500" />
              <span>30-Min Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Hygienic Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Exclusive 20% OFF Deals</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-stone-400">
          © {new Date().getFullYear()} CraveBite Food Delivery Inc.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950">Customer Sign In</h2>
            <p className="text-xs text-stone-500 mt-1">Sign in to track orders, save delivery addresses, and re-order your favorite meals</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-stone-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-orange-600 hover:underline font-bold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition transform active:scale-98 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500 pt-2">
            Don't have an account yet?{" "}
            <Link href="/signup" className="text-orange-600 font-bold hover:underline">
              Create Free Account
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}