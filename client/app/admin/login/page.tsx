"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Flame, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ChefHat, 
  UtensilsCrossed, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshAdmin } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@cravebite.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to log in to Admin Portal");
      }

      await refreshAdmin();
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An error occurred during admin login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1F3A] font-sans p-4 sm:p-6 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/40 p-8 sm:p-10 relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B1F3A] text-[#C8A14A] shadow-md mb-2">
            <ChefHat className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-[#0B1F3A]">
            <span>Crave</span>
            <span className="text-orange-600">Bite</span>
            <span className="text-xs px-2 py-0.5 ml-1 bg-[#0B1F3A] text-white rounded-md uppercase font-bold tracking-wider">Admin</span>
          </div>
          <h1 className="text-lg font-serif font-bold text-stone-900">
            Restaurant Operations & Kitchen Portal
          </h1>
          <p className="text-xs text-stone-500">
            Authorized access for Restaurant Owners, Kitchen Leads, and Staff Operators.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-in fade-in">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminSignIn} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800">Admin Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cravebite.com"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800">Admin Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-orange-500 focus:bg-white font-medium transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-stone-400 hover:text-stone-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-orange-500/20 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
