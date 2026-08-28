"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Users, 
  Flame,
  Star, 
  Newspaper, 
  MessageSquare, 
  Bell,
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Bike
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useAdminProfile } from "./AdminProfileContext";
import { useTestRole } from "./TestRoleContext";
import BrandLogoIcon from "@/components/BrandLogoIcon";

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const { displayName, displayTitle, profilePhoto, initials } = useAdminProfile();
  const { currentRole, roleConfig, canAccess } = useTestRole();

  const activeDisplayName = currentRole === "owner" ? (displayName || roleConfig.defaultUserName) : roleConfig.defaultUserName;
  const activeDisplayTitle = currentRole === "owner" ? (displayTitle || roleConfig.defaultUserTitle) : roleConfig.defaultUserTitle;
  const activeInitials = currentRole === "owner" ? (initials || roleConfig.initials) : roleConfig.initials;
  const activeAvatarBg = roleConfig.avatarBg;

  const navItems = [
    { name: "Dashboard",              href: "/admin",               icon: LayoutDashboard },
    { name: "Live Orders Manager",    href: "/admin/cases",         icon: ShoppingBag },
    { name: "Food Menu & Dishes",     href: "/admin/practice-areas",icon: UtensilsCrossed },
    { name: "Table & Catering Inquiries", href: "/admin/consultations", icon: Flame },
    { name: "Customers & Foodies",    href: "/admin/clients",       icon: Users },
    { name: "Foodie Reviews",         href: "/admin/reviews",       icon: Star },
    { name: "Culinary Stories & Blog",href: "/admin/articles",      icon: Newspaper },
    { name: "Support Inquiries",      href: "/admin/messages",      icon: MessageSquare },
    { name: "Notifications",          href: "/admin/notifications", icon: Bell },
    { name: "Platform Settings",      href: "/admin/settings",      icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 bg-stone-950 text-white z-50 transition-all duration-300 flex flex-col border-r border-stone-800 ${
          collapsed ? "w-20" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header / Logo */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          {!collapsed ? (
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="group-hover:scale-105 transition transform">
                <BrandLogoIcon className="w-9 h-9" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center text-base tracking-tight font-black">
                  <span className="text-white">Crave</span>
                  <span className="text-orange-500">Bite</span>
                </div>
                <span className="text-[8px] tracking-[0.2em] font-bold text-stone-400 uppercase -mt-0.5 font-sans">
                  Restaurant Manager
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/admin" className="mx-auto group-hover:scale-105 transition transform">
              <BrandLogoIcon className="w-9 h-9" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems
            .filter((item) => canAccess(item.href))
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/20"
                      : "text-stone-400 hover:text-white hover:bg-white/5"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${activeAvatarBg}`}>
              {activeInitials}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <h4 className="text-xs font-bold text-white truncate">{activeDisplayName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-amber-400 font-semibold truncate flex items-center gap-1">
                    <span>{roleConfig.badgeEmoji}</span> {roleConfig.shortTitle}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>
    </>
  );
}