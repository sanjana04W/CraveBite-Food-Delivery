"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { useTestRole } from "./TestRoleContext";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentRole, roleConfig, canAccess, setRole } = useTestRole();

  if (!canAccess(pathname)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold tracking-widest uppercase text-stone-500 bg-stone-100 px-3 py-1 rounded-full mb-3">
          Restricted Zone
        </span>

        <h2 className="text-xl font-serif font-bold text-[#0B1F3A] mb-2">
          Access Restricted for {roleConfig.shortTitle}
        </h2>

        <p className="text-xs text-[#667085] leading-relaxed mb-6">
          Your current test role (<strong className="text-[#0B1F3A]">{roleConfig.badgeEmoji} {roleConfig.title}</strong>) does not have permission to view or manage this section.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link
            href="/admin"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#163359] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            👑 Switch to Owner Role
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
