"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Bike, 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Share2, 
  ShoppingBag, 
  ChevronRight,
  Flame,
  Sparkles
} from "lucide-react";
import { useCart } from "@/components/CartContext";

export default function OrderTrackModal() {
  const { isTrackingOpen, setIsTrackingOpen, activeOrder } = useCart();
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 0: Confirmed, 1: Preparing, 2: On Way, 3: Delivered

  useEffect(() => {
    if (!isTrackingOpen) return;
    // Simulate real-time progress for demo excitement
    const timer1 = setTimeout(() => setCurrentStepIndex(1), 3000);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 9000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isTrackingOpen]);

  if (!isTrackingOpen || !activeOrder) return null;

  const steps = [
    { title: "Order Confirmed", desc: "Received by restaurant", icon: CheckCircle2, time: "Just now" },
    { title: "Cooking in Kitchen", desc: "Chef is preparing your meal fresh", icon: UtensilsCrossed, time: "Est. 12 mins" },
    { title: "Rider on the Way", desc: "Thermal pouch sealed & in transit", icon: Bike, time: "Est. 18 mins" },
    { title: "Delivered & Enjoy", desc: "Arrived at your door", icon: Sparkles, time: "30 mins total" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setIsTrackingOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-stone-100">
        
        {/* Header with animated status */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
            <Flame className="w-48 h-48 text-white" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white">
                Live Food Tracker
              </span>
              <h3 className="text-xl font-black mt-1">Order #{activeOrder.orderId}</h3>
              <p className="text-xs text-orange-100 font-medium">Estimated Arrival in ~28 mins</p>
            </div>
            <button
              onClick={() => setIsTrackingOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Stepper */}
        <div className="p-6">
          <div className="space-y-6 relative">
            {/* Connecting Vertical Line */}
            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-stone-200" />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.title} className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isCurrent
                        ? "bg-orange-600 text-white ring-4 ring-orange-100 shadow-md scale-110"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-100 text-stone-400 border border-stone-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isDone ? "text-stone-900" : "text-stone-400"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-stone-400">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Courier Card */}
          <div className="mt-6 p-4 bg-orange-50/70 border border-orange-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                🚴
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900">David Miller (Crave Rider)</h5>
                <p className="text-[11px] text-stone-500">Yamaha Aerox • ⭐ 4.95 (1.2k deliveries)</p>
              </div>
            </div>
            <a
              href="tel:5550192834"
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-orange-600 hover:bg-orange-600 hover:text-white transition shadow-2xs"
              title="Call courier"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Delivery Address & Ordered Items Overview */}
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-start gap-2 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800">Delivering to:</strong> {activeOrder.deliveryAddress.fullName}, {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1">
              <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
                <span>Items in this Order ({activeOrder.items.length})</span>
                <span className="text-orange-600 font-extrabold">Rs. {activeOrder.total.toFixed(2)}</span>
              </div>
              {activeOrder.items.map((ci) => (
                <div key={ci.id} className="flex justify-between text-stone-600 text-[11px]">
                  <span>{ci.quantity}x {ci.menuItem.name}</span>
                  <span className="font-medium">Rs. {ci.itemTotalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dismiss CTA */}
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="w-full mt-5 py-3 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            Done (Keep Tracking in Background)
          </button>
        </div>

      </div>
    </div>
  );
}
