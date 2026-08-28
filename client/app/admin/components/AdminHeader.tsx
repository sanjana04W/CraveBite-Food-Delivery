"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Menu, Search, Bell, MessageSquare, ChevronDown, ChevronUp,
  User, Settings, LogOut, X, Loader2, Users, Briefcase,
  Calendar, FileText, Newspaper, Inbox, Star, Shield, Check, TrendingUp
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useAdminProfile } from "./AdminProfileContext";
import { useTestRole, ROLES, TestRole } from "./TestRoleContext";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

interface SearchResults {
  clients: any[];
  cases: any[];
  appointments: any[];
  documents: any[];
  articles: any[];
  messages: any[];
  consultations: any[];
  reviews: any[];
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { adminUser, logout } = useAdminAuth();
  const { displayName, displayTitle, profilePhoto, initials } = useAdminProfile();
  const { currentRole, roleConfig, setRole, canAccess } = useTestRole();

  const activeDisplayName = currentRole === "owner" ? (displayName || roleConfig.defaultUserName) : roleConfig.defaultUserName;
  const activeDisplayTitle = currentRole === "owner" ? (displayTitle || roleConfig.defaultUserTitle) : roleConfig.defaultUserTitle;
  const activeInitials = currentRole === "owner" ? (initials || roleConfig.initials) : roleConfig.initials;
  const activeAvatarBg = roleConfig.avatarBg;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Live badge counts
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages]           = useState(0);

  const fetchCounts = useCallback(async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        fetch("/api/notifications"),
        fetch("/api/contact-messages"),
      ]);
      const notifData = await notifRes.json();
      const msgData   = await msgRes.json();
      if (notifData.success) setUnreadNotifications((notifData.data as any[]).filter((n: any) => !n.read).length);
      if (msgData.success)   setUnreadMessages((msgData.data as any[]).filter((m: any) => m.status === "Unread").length);
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [fetchCounts]);

  // Handle Search API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results);
          setSearchDropdownOpen(true);
        }
      } catch (_) {
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown, profile menu & role menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalMatches = searchResults
    ? (searchResults.clients?.length || 0) +
      (searchResults.cases?.length || 0) +
      (searchResults.appointments?.length || 0) +
      (searchResults.documents?.length || 0) +
      (searchResults.articles?.length || 0) +
      (searchResults.messages?.length || 0) +
      (searchResults.consultations?.length || 0) +
      (searchResults.reviews?.length || 0)
    : 0;

  return (
    <header className="h-20 bg-[#FAF6F0] border-b border-[#E8DFC8]/80 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg bg-[#F3ECE0] text-[#0B1F3A] hover:bg-[#EAE1D2] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A]">Dashboard</h1>
          <p className="text-[11px] text-[#667085] hidden sm:block">Home / Kitchen & Delivery Operations</p>
        </div>
      </div>

      {/* Center Search Bar with Real-Time Live Dropdown */}
      <div ref={searchContainerRef} className="hidden md:block relative max-w-md w-full mx-8">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#667085]" />
          <input 
            type="text" 
            placeholder="Search orders, menu items, customers, reservations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchResults) setSearchDropdownOpen(true); }}
            className="w-full bg-[#F3ECE0]/90 border border-[#E5DBCA] rounded-xl pl-10 pr-9 py-2 text-xs text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-orange-500 transition-colors"
          />
          {searching ? (
            <Loader2 className="absolute right-3 w-3.5 h-3.5 text-[#C8A14A] animate-spin" />
          ) : searchQuery ? (
            <button 
              onClick={() => { setSearchQuery(""); setSearchResults(null); setSearchDropdownOpen(false); }}
              className="absolute right-3 text-[#667085] hover:text-[#0B1F3A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Live Search Results Dropdown */}
        {searchDropdownOpen && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden max-h-[70vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-3 bg-[#F8F9FB] border-b border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#667085]">
              <span>Results for &quot;<strong>{searchQuery}</strong>&quot;</span>
              <span className="font-semibold text-[#0B1F3A]">{totalMatches} found</span>
            </div>

            {totalMatches === 0 ? (
              <div className="p-6 text-center text-xs text-[#667085]">
                No matching records found across orders, menu items, or customers.
              </div>
            ) : (
              <div className="p-2 divide-y divide-[#E5E7EB] text-xs">
                
                {/* Orders Results */}
                {searchResults.cases && searchResults.cases.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-[#C8A14A]" /> Orders
                    </div>
                    {searchResults.cases.map((c: any) => (
                      <Link
                        key={c._id}
                        href={`/admin/cases`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors">{c.title}</p>
                          <p className="text-[10px] text-[#667085]">{c.caseId} • Customer: {c.clientName}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-[#C8A14A]/10 text-[#0B1F3A]">
                          {c.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Customers Results */}
                {searchResults.clients && searchResults.clients.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-[#C8A14A]" /> Customers
                    </div>
                    {searchResults.clients.map((cl: any) => (
                      <Link
                        key={cl._id}
                        href={`/admin/clients`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors">{cl.clientName || `${cl.firstName} ${cl.lastName}`}</p>
                          <p className="text-[10px] text-[#667085]">{cl.email} • {cl.phone}</p>
                        </div>
                        <span className="text-[9px] font-mono text-[#667085]">{cl.clientId}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Documents Results */}
                {searchResults.documents && searchResults.documents.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-[#C8A14A]" /> Documents
                    </div>
                    {searchResults.documents.map((d: any) => (
                      <Link
                        key={d._id}
                        href={`/admin/documents/${d.docId}`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors">{d.name}</p>
                          <p className="text-[10px] text-[#667085]">{d.documentType} • {d.size}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 text-[#0B1F3A]">
                          {d.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Appointments Results */}
                {searchResults.appointments && searchResults.appointments.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#C8A14A]" /> Appointments
                    </div>
                    {searchResults.appointments.map((a: any) => (
                      <Link
                        key={a._id}
                        href={`/admin/appointments`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors">{a.clientName}</p>
                          <p className="text-[10px] text-[#667085]">{a.time} • {a.consultationType}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700">
                          {a.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Consultations Results */}
                {searchResults.consultations && searchResults.consultations.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <Inbox className="w-3 h-3 text-[#C8A14A]" /> Consultations
                    </div>
                    {searchResults.consultations.map((con: any) => (
                      <Link
                        key={con._id}
                        href={`/admin/consultations`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors">{con.name}</p>
                          <p className="text-[10px] text-[#667085]">{con.practiceArea} • {con.email}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700">
                          {con.status || "Pending"}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Articles Results */}
                {searchResults.articles && searchResults.articles.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <Newspaper className="w-3 h-3 text-[#C8A14A]" /> Food Stories & Recipes
                    </div>
                    {searchResults.articles.map((art: any) => (
                      <Link
                        key={art._id}
                        href={`/admin/articles`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors truncate">{art.title}</p>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-100 text-[#0B1F3A]">{art.category}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Reviews Results */}
                {searchResults.reviews && searchResults.reviews.length > 0 && (
                  <div className="py-2">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-[#C8A14A]" /> Foodie Reviews
                    </div>
                    {searchResults.reviews.map((rev: any) => (
                      <Link
                        key={rev._id}
                        href={`/admin/reviews`}
                        onClick={() => setSearchDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F9FB] transition-colors group"
                      >
                        <div>
                          <p className="font-semibold text-[#0B1F3A] group-hover:text-[#C8A14A] transition-colors">{rev.name}</p>
                          <p className="text-[10px] text-[#667085] truncate max-w-xs">&ldquo;{rev.quote}&rdquo;</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700">
                          {rev.rating}★
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Revenue Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs whitespace-nowrap">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Rs. 11,300</span>
        </div>

        {/* ── TEST ROLE SWITCHER DROPDOWN ── */}
        <div ref={roleDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="whitespace-nowrap flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs text-xs font-semibold text-stone-800 transition-all cursor-pointer"
            title="Switch testing role to preview access limits"
          >
            <Shield className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-500 uppercase tracking-tight text-[11px] hidden sm:inline">TEST ROLE:</span>
              <span className="font-bold text-stone-900">{roleConfig.shortTitle}</span>
            </div>
            {roleDropdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-500 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 ml-0.5" />
            )}
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-1.5 border-b border-stone-100 mb-1 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Switch Test Role</p>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">Live Preview</span>
              </div>

              {(Object.keys(ROLES) as TestRole[]).map((roleKey) => {
                const r = ROLES[roleKey];
                const isSelected = currentRole === roleKey;

                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => {
                      setRole(roleKey);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                      isSelected ? "bg-amber-50/80 font-semibold" : "hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{r.badgeEmoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{r.title}</p>
                        <p className="text-[10px] text-stone-500 truncate">{r.defaultUserName} • {r.defaultUserTitle}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-pink-500 shrink-0 ml-2 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bell Notifications */}
        <Link href="/admin/notifications"
          className="w-9 h-9 rounded-full bg-[#F3ECE0]/80 hover:bg-[#EAE1D2] border border-[#E5DBCA]/80 text-[#0B1F3A] flex items-center justify-center relative transition-colors shrink-0"
          title={unreadNotifications > 0 ? `${unreadNotifications} unread notification${unreadNotifications !== 1 ? "s" : ""}` : "Notifications"}>
          <Bell className="w-4 h-4 text-stone-600" />
          {unreadNotifications > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />}
        </Link>

        {/* Messages */}
        <Link href="/admin/messages"
          className="w-9 h-9 rounded-full bg-[#F3ECE0]/80 hover:bg-[#EAE1D2] border border-[#E5DBCA]/80 text-[#0B1F3A] flex items-center justify-center relative transition-colors shrink-0"
          title={unreadMessages > 0 ? `${unreadMessages} unread message${unreadMessages !== 1 ? "s" : ""}` : "Messages"}>
          <MessageSquare className="w-4 h-4 text-stone-600" />
          {unreadMessages > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" />}
        </Link>

        <div className="h-6 w-px bg-[#E8DFC8] mx-0.5" />

        {/* Profile Dropdown */}
        <div className="relative shrink-0">
          <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-[#F3ECE0]/80 border border-[#E5DBCA] transition-all cursor-pointer">
            {/* Avatar */}
            {currentRole === "owner" && profilePhoto ? (
              <img src={profilePhoto} alt={activeDisplayName}
                className="w-8 h-8 rounded-full object-cover border border-[#C8A14A]/40 shrink-0" />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${activeAvatarBg}`}>
                {activeInitials}
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0B1F3A] leading-tight block truncate max-w-[120px]">{activeDisplayName}</span>
              <span className="text-[10px] text-stone-500 font-medium leading-tight block truncate max-w-[120px]">{activeDisplayTitle}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-[#E5E7EB]/60 sm:hidden">
                <p className="text-xs font-bold text-[#0B1F3A]">{activeDisplayName}</p>
                <p className="text-[10px] text-stone-500">{activeDisplayTitle}</p>
              </div>

              <Link href="/admin/profile" onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#0B1F3A] hover:bg-[#F8F9FB]">
                <User className="w-4 h-4 text-[#667085]" /> My Profile
              </Link>

              {canAccess("/admin/settings") && (
                <Link href="/admin/settings" onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#0B1F3A] hover:bg-[#F8F9FB]">
                  <Settings className="w-4 h-4 text-[#667085]" /> Platform Settings
                </Link>
              )}

              <div className="h-px bg-[#E5E7EB] my-1" />
              <button onClick={async () => { await logout(); window.location.href = "/admin/login"; }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 cursor-pointer">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}