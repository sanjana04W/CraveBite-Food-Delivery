"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bike, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  UtensilsCrossed, 
  Sparkles, 
  Search, 
  ChevronRight, 
  ShoppingBag,
  Flame,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/components/CartContext";

export default function TrackOrderPage() {
  const { activeOrder, orderHistory } = useCart();
  const [searchId, setSearchId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const currentOrder = searchedOrder || activeOrder || (orderHistory.length > 0 ? orderHistory[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = orderHistory.find((o) => 
      o.orderId.toLowerCase() === searchId.trim().toLowerCase() ||
      o.deliveryAddress.phone.includes(searchId.trim())
    );

    if (found) {
      setSearchedOrder(found);
      setErrorMsg("");
    } else {
      setErrorMsg(`No active order found with ID "${searchId}". Showing sample tracking.`);
      // Mock order for demo
      setSearchedOrder({
        orderId: searchId.toUpperCase(),
        items: [
          { id: "1", menuItem: { name: "Truffle Burrata Margherita Pizza" }, quantity: 1, itemTotalPrice: 18.99 },
          { id: "2", menuItem: { name: "Double Smash Wagyu Cheeseburger" }, quantity: 1, itemTotalPrice: 16.50 },
        ],
        subtotal: 35.49,
        deliveryFee: 0,
        tax: 2.84,
        total: 38.33,
        deliveryAddress: {
          fullName: "Demo Foodie",
          phone: "+1 (555) 019-2834",
          street: "742 Evergreen Terrace, Apt 4B",
          city: "Downtown Central"
        },
        paymentMethod: "cod",
        status: "Rider on the Way",
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: "20-25 mins"
      });
    }
  };

  const steps = [
    { title: "Order Confirmed", desc: "Received and dispatched to kitchen", icon: CheckCircle2, time: "12 mins ago", done: true },
    { title: "Cooking & Packing", desc: "Chef prepared fresh in stone oven", icon: UtensilsCrossed, time: "6 mins ago", done: true },
    { title: "Rider on the Way", desc: "Thermal bag sealed & courier en route", icon: Bike, time: "Now (~14 mins left)", done: true, current: true },
    { title: "Delivered", desc: "Doorstep delivery completed", icon: Sparkles, time: "Est. 12:45 PM", done: false }
  ];

  return (
    <div className="w-full min-h-screen bg-stone-50 text-stone-900 font-sans">
      
      {/* 1. Header */}
      <section 
        className="relative w-full min-h-[320px] text-white pt-28 pb-12 px-4 sm:px-6 lg:px-12 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.85) 60%, rgba(17, 24, 39, 0.6) 100%), url('https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-2 text-xs text-orange-200 mb-4 font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-400">Live Order Tracker</span>
          </div>

          <span className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2 shadow-xs">
            Real-Time GPS Tracking
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
            Track Your Food Delivery
          </h1>

          <p className="max-w-xl text-stone-300 text-xs sm:text-sm font-medium">
            Enter your CraveBite Order ID or phone number to check live preparation and rider transit.
          </p>
        </div>
      </section>

      {/* 2. Main Tracking Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl border border-stone-200 shadow-md flex flex-col sm:flex-row gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. CB-842910) or phone number..."
              className="w-full bg-transparent pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 placeholder-stone-400 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {currentOrder ? (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
            
            {/* Order Card Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-white/20 px-2.5 py-1 rounded-full">
                  Status: {currentOrder.status || "In Transit"}
                </span>
                <h2 className="text-2xl font-black mt-2">Order #{currentOrder.orderId}</h2>
                <p className="text-xs text-orange-100 mt-0.5">
                  Estimated Doorstep Arrival: ~18 - 25 mins
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-orange-100 font-bold">Total Amount</div>
                <div className="text-2xl font-black">Rs. {currentOrder.total?.toFixed(2) || "38.33"}</div>
              </div>
            </div>

            {/* Stepper */}
            <div className="p-6 sm:p-8 border-b border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition shadow-sm ${
                          step.current
                            ? "bg-orange-600 text-white ring-4 ring-orange-200 scale-110"
                            : step.done
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-100 text-stone-400 border border-stone-300"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{step.title}</h4>
                        <p className="text-[10px] text-stone-500 mt-0.5">{step.desc}</p>
                        <span className="text-[10px] font-bold text-orange-600 mt-1 inline-block">{step.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Rider Box */}
            <div className="p-6 bg-orange-50/60 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-xl shadow-xs">
                  🚴
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">David Miller (Assigned Courier)</h4>
                  <p className="text-[11px] text-stone-500">Yamaha Aerox • ⭐ 4.95 Rating • 1,240 deliveries</p>
                </div>
              </div>

              <a
                href="tel:5550192834"
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-200 hover:border-orange-500 text-orange-600 rounded-xl text-xs font-bold shadow-2xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Rider</span>
              </a>
            </div>

            {/* Delivery Address & Order Items */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Delivery Address</span>
                </h4>
                <div className="text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">{currentOrder.deliveryAddress.fullName}</div>
                  <div>{currentOrder.deliveryAddress.street}</div>
                  <div>{currentOrder.deliveryAddress.city}</div>
                  <div className="text-stone-500 pt-1">Phone: {currentOrder.deliveryAddress.phone}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-orange-600" />
                  <span>Order Items ({currentOrder.items.length})</span>
                </h4>
                <div className="text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                  {currentOrder.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between items-center pb-1 border-b border-stone-200 last:border-0 last:pb-0">
                      <span>{it.quantity}x {it.menuItem?.name || "Gourmet Dish"}</span>
                      <span className="font-bold text-stone-900">Rs. {it.itemTotalPrice?.toFixed(2) || "16.50"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No active orders yet</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-6">
              When you place an order, you can track your food live from kitchen prep to your doorstep.
            </p>
            <Link
              href="/practice-areas"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Explore Menu & Order Now
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
