"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import BrandLogoIcon from "@/components/BrandLogoIcon";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F2EB] font-sans text-stone-900 relative p-6">
      
      {/* Top Logo & Brand Name */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="group-hover:scale-105 transition transform">
          <BrandLogoIcon className="w-11 h-11" />
        </div>
        <div>
          <div className="text-2xl font-black tracking-tight text-stone-950 leading-none">
            <span>Crave</span>
            <span className="text-orange-600">Bite</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mt-1 block">
            Food Delivery
          </span>
        </div>
      </Link>

      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/60 p-8 sm:p-10 border border-stone-200/70">
        
        {/* Icon Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>
        </div>

        {/* Heading & Description */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
            Forgot Your Password?
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
            No problem. Enter your CraveBite account email and we&apos;ll send you a secure password recovery link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-900">Check your inbox</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              We have sent a secure password reset link to <strong className="font-bold">{email}</strong>.
            </p>
            <Link
              href="/login"
              className="inline-block pt-2 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
            >
              ← Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Account Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your customer email address" 
                  className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:border-orange-500 bg-stone-50/70 font-medium transition"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md shadow-orange-500/20 cursor-pointer transform active:scale-98"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* Back to Sign In Link */}
        <div className="text-center mt-6">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>

      {/* Footer Info Note */}
      <div className="text-center mt-8 text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
        <Lock className="w-3.5 h-3.5 text-stone-400" />
        <span>Password reset links expire after 1 hour for your security.</span>
      </div>

    </div>
  );
}