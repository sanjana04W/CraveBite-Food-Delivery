"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

export default function CartDrawer() {
  const { user } = useAuth();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    discount,
    tax,
    grandTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    totalItemsCount,
    setIsCheckoutOpen,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");

  if (!isCartOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput("");
  };

  const freeDeliveryThreshold = 30;
  const progressToFreeDelivery = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Delicious Cart</h2>
                <p className="text-xs text-orange-100 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-orange-50 border-b border-orange-100 px-5 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-orange-600" />
                {remainingForFree > 0 ? (
                  <span>Add <strong className="text-orange-600">${remainingForFree.toFixed(2)}</strong> more for <strong>FREE Delivery</strong></span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You unlocked FREE delivery!
                  </span>
                )}
              </div>
              <span className="text-stone-500">{Math.round(progressToFreeDelivery)}%</span>
            </div>
            <div className="w-full bg-orange-200/70 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-1">Your cart is hungry!</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our hot pizzas, smash burgers, bowls, and desserts to satisfy your cravings.
                </p>
                <Link
                  href="/practice-areas"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
                >
                  Explore Delicious Menu
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 hover:border-orange-200 transition"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-stone-200">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-full h-full object-cover"
                    />
                    {item.menuItem.isVeg ? (
                      <span className="absolute top-1 left-1 w-3.5 h-3.5 bg-white rounded-xs border border-emerald-600 flex items-center justify-center p-0.5" title="Vegetarian">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      </span>
                    ) : (
                      <span className="absolute top-1 left-1 w-3.5 h-3.5 bg-white rounded-xs border border-red-600 flex items-center justify-center p-0.5" title="Non-Vegetarian">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      </span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-stone-900 truncate leading-snug">
                          {item.menuItem.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 p-1 -mr-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {item.selectedCustomizations && Object.entries(item.selectedCustomizations).length > 0 && (
                        <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                          {Object.values(item.selectedCustomizations).join(", ")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                      <span className="text-xs font-extrabold text-orange-600">
                        Rs. {item.itemTotalPrice.toFixed(2)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center bg-white border border-stone-200 rounded-lg shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-stone-50 rounded-l-md transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-stone-50 rounded-r-md transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary / Coupon / Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-stone-200 p-5 bg-stone-50/70 space-y-4">
              
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Coupon <strong>{appliedCoupon}</strong> applied!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-red-600 underline text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. CRAVE20)"
                        className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-orange-500 uppercase font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-500 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">Rs. {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600 uppercase text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded-sm">FREE</span>
                  ) : (
                    <span className="font-semibold text-stone-800">Rs. {deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-stone-800">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-950 pt-2 border-t border-stone-300">
                  <span>Total Amount</span>
                  <span className="text-orange-600">Rs. {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition transform active:scale-98 cursor-pointer"
              >
                {user ? (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Sign In & Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
