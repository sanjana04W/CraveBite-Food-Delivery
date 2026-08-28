"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import BrandLogoIcon from "@/components/BrandLogoIcon";

export default function SignUpPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setSuccessMsg("Account created! Logging you in...");
      await refresh();
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-stone-950 font-sans text-stone-900">
      
      {/* Left Branding Hero Panel */}
      <div 
        className="lg:w-1/2 min-h-[260px] lg:min-h-screen relative p-8 lg:p-16 flex flex-col justify-between bg-cover bg-center text-white"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.85) 50%, rgba(17, 24, 39, 0.4) 100%), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop')`,
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
          <div className="inline-flex items-center gap-2 bg-orange-600/90 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 50k+ Happy Foodies</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Create Your Account & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Get Rs. 10 Off 1st Order.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
            Enjoy 30-minute delivery on artisan sourdough pizzas, smash burgers, Asian noodle bowls, and Belgian desserts.
          </p>
        </div>

        <div className="text-xs text-stone-400">
          © {new Date().getFullYear()} CraveBite Food Delivery Inc.
        </div>
      </div>

      {/* Right Sign Up Form */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950">Join CraveBite</h2>
            <p className="text-xs text-stone-500 mt-0.5">Start ordering your favorite meals in seconds</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Alex"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Morgan"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@example.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Confirm Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="text-orange-600 rounded-sm"
                />
                <span className="text-[11px]">I agree to Terms & Conditions</span>
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-orange-600 font-bold hover:underline"
              >
                {showPassword ? "Hide" : "Show"} Passwords
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition transform active:scale-98 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account & Claim Rs. 10 Coupon</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}