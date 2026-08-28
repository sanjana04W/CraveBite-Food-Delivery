"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Flame, 
  Bike, 
  DollarSign, 
  Star, 
  UtensilsCrossed, 
  Loader2, 
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { useAdminProfile } from "./components/AdminProfileContext";
import { useTestRole } from "./components/TestRoleContext";

export default function AdminDashboardHome() {
  const { displayName } = useAdminProfile();
  const { currentRole, roleConfig, canAccess } = useTestRole();
  const [loading, setLoading] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [orders, setOrders] = useState([
    { id: "CB-849201", customer: "Sophia Taylor", items: "2x Truffle Burrata Pizza, 1x Lava Cake", total: 47.97, status: "Cooking in Kitchen", time: "5 mins ago", rider: "David M." },
    { id: "CB-849200", customer: "Liam Johnson", items: "1x Double Wagyu Burger, Fries", total: 19.50, status: "Rider on the Way", time: "14 mins ago", rider: "Alex R." },
    { id: "CB-849199", customer: "Emily Davis", items: "1x Royal Dum Biryani, Garlic Naan", total: 21.49, status: "Delivered", time: "32 mins ago", rider: "Chris P." },
    { id: "CB-849198", customer: "Michael Brown", items: "2x Tonkotsu Ramen Bowls", total: 34.50, status: "Delivered", time: "48 mins ago", rider: "Sam K." },
  ]);

  const ownerStats = [
    { title: "TODAY'S REVENUE", count: "Rs. 3,420.50", note: "+18% vs yesterday", icon: DollarSign, badgeBg: "bg-emerald-50 text-emerald-600", href: "/admin/cases" },
    { title: "ACTIVE ORDERS", count: "12 Orders", note: "4 in kitchen, 8 on road", icon: ShoppingBag, badgeBg: "bg-orange-50 text-orange-600", href: "/admin/cases" },
    { title: "ACTIVE CUSTOMERS", count: "1,240 Foodies", note: "Registered accounts", icon: Users, badgeBg: "bg-indigo-50 text-indigo-600", href: "/admin/clients" },
    { title: "AVG DELIVERY SPEED", count: "26.4 mins", note: "Under 30-min goal", icon: Bike, badgeBg: "bg-amber-50 text-amber-600", href: "/admin/cases" },
  ];

  const kitchenStats = [
    { title: "IN KITCHEN QUEUE", count: "4 Tickets", note: "2 cooking, 2 queued", icon: Flame, badgeBg: "bg-orange-50 text-orange-600", href: "/admin/cases" },
    { title: "READY FOR PICKUP", count: "3 Orders", note: "Awaiting courier", icon: ShoppingBag, badgeBg: "bg-emerald-50 text-emerald-600", href: "/admin/cases" },
    { title: "DISHES IN STOCK", count: "28 Active", note: "2 items marked sold out", icon: UtensilsCrossed, badgeBg: "bg-amber-50 text-amber-600", href: "/admin/practice-areas" },
    { title: "AVG PREP TIME", count: "14.2 mins", note: "Target: 15 mins", icon: Clock, badgeBg: "bg-indigo-50 text-indigo-600", href: "/admin/cases" },
  ];

  const staffStats = [
    { title: "TODAY'S ORDERS", count: "24 Orders", note: "12 active, 12 delivered", icon: ShoppingBag, badgeBg: "bg-orange-50 text-orange-600", href: "/admin/cases" },
    { title: "TABLE INQUIRIES", count: "5 Requests", note: "3 need confirmation", icon: Flame, badgeBg: "bg-amber-50 text-amber-600", href: "/admin/consultations" },
    { title: "CUSTOMER SUPPORT", count: "2 Inquiries", note: "Unresolved messages", icon: Users, badgeBg: "bg-indigo-50 text-indigo-600", href: "/admin/messages" },
    { title: "AVG REVIEW SCORE", count: "4.9 ★", note: "Based on 32 reviews", icon: Star, badgeBg: "bg-emerald-50 text-emerald-600", href: "/admin/reviews" },
  ];

  const stats = currentRole === "kitchen" ? kitchenStats : currentRole === "staff" ? staffStats : ownerStats;

  const updateOrderStatus = (orderId: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-sans space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-950 via-stone-900 to-orange-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-white/10 px-3 py-1 rounded-full">
              Restaurant Operations & Live Dispatch
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${roleConfig.badgeClass}`}>
              {roleConfig.badgeEmoji} {roleConfig.title}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            {greeting}, {displayName || "Chef Manager"}
          </h1>
          <p className="text-xs text-stone-300 mt-1 font-medium">{todayFormatted} • Operational Mode: <strong className="text-amber-300">{roleConfig.tagline}</strong></p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {canAccess("/admin/practice-areas") && (
            <Link
              href="/admin/practice-areas"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>{currentRole === "kitchen" ? "Dish Stock & Menu" : "Add Menu Dish"}</span>
            </Link>
          )}
          <Link
            href="/admin/cases"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Orders Board</span>
          </Link>
          {currentRole === "staff" && canAccess("/admin/consultations") && (
            <Link
              href="/admin/consultations"
              className="px-4 py-2.5 bg-purple-600/60 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Table Inquiries</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <Link
              key={st.title}
              href={st.href}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-orange-300 transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    {st.title}
                  </span>
                  <div className="text-2xl font-black text-stone-950 mt-1">{st.count}</div>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${st.badgeBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-3 pt-2 border-t border-stone-100 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{st.note}</span>
              </p>
            </Link>
          );
        })}
      </div>

      {/* Live Orders Feed */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-black text-base text-stone-950 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Live Kitchen & Delivery Orders</span>
            </h3>
            <p className="text-xs text-stone-500">Real-time incoming orders and courier dispatches</p>
          </div>
          <Link
            href="/admin/cases"
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>View Orders Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-extrabold uppercase text-stone-400 border-b border-stone-100">
                <th className="pb-3 font-bold">Order ID</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Items</th>
                <th className="pb-3 font-bold">Total</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Rider</th>
                <th className="pb-3 font-bold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 font-black text-stone-900">{ord.id}</td>
                  <td className="py-3 font-bold text-stone-900">{ord.customer}</td>
                  <td className="py-3 max-w-xs truncate">{ord.items}</td>
                  <td className="py-3 font-bold text-stone-900">Rs. {ord.total.toFixed(2)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "Rider on the Way"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-stone-500">{ord.rider}</td>
                  <td className="py-3 text-right">
                    {ord.status === "Cooking in Kitchen" && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, "Rider on the Way")}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer"
                      >
                        Hand to Rider
                      </button>
                    )}
                    {ord.status === "Rider on the Way" && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, "Delivered")}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs cursor-pointer"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {ord.status === "Delivered" && (
                      <span className="text-[11px] text-emerald-600 font-bold">Completed ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">Food Menu Catalog</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Add new signature dishes, adjust seasonal prices, update allergens, and manage ingredients.
          </p>
          <Link
            href="/admin/practice-areas"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-1"
          >
            <span>Manage Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">Table & Catering Inquiries</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Review incoming table reservations, VIP dinner requests, and corporate catering requests.
          </p>
          <Link
            href="/admin/consultations"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-1"
          >
            <span>View Reservations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">Foodie Reviews & Ratings</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Moderate customer reviews, feature 5-star testimonials on the homepage, and monitor quality scores.
          </p>
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline pt-1"
          >
            <span>Moderate Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}