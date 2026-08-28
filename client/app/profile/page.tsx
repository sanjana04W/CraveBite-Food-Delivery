"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Shield,
  Edit3,
  X,
  Save,
  ShoppingBag,
  Clock,
  MapPin,
  Flame,
  Bike,
  Plus
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "@/components/CartContext";

export default function ClientProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { orderHistory, setIsTrackingOpen, setActiveOrder } = useCart();

  const [profileData, setProfileData] = useState({
    name: user?.name || "Food Lover",
    email: user?.email || "foodie@example.com",
    phone: "+1 (555) 019-2834",
    status: "VIP Foodie",
    favoriteCuisine: "Artisan Pizzas & Smash Burgers",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profileData.name,
    phone: profileData.phone,
    favoriteCuisine: profileData.favoriteCuisine,
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setProfileData((prev) => ({ ...prev, ...editForm }));
      setSaving(false);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 600);
  };

  const handleTrack = (order: any) => {
    setActiveOrder(order);
    setIsTrackingOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 text-stone-900 font-sans pb-16">
      
      {/* Top Header */}
      <section className="pt-28 pb-10 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white text-orange-600 flex items-center justify-center font-black text-2xl shadow-xl">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                {profileData.status}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">{profileData.name}</h1>
              <p className="text-xs text-orange-100">{profileData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/practice-areas"
              className="px-5 py-2.5 bg-white text-orange-600 hover:bg-stone-100 rounded-xl text-xs font-black shadow-md transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Food Now</span>
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Profile Overview Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-black text-sm text-stone-900">Foodie Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Favorite Cuisines</label>
                    <input
                      type="text"
                      value={editForm.favoriteCuisine}
                      onChange={(e) => setEditForm({ ...editForm, favoriteCuisine: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">Full Name</span>
                    <p className="font-bold text-stone-900">{profileData.name}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Email Address</span>
                    <p className="font-bold text-stone-900">{profileData.email}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Contact Phone</span>
                    <p className="font-bold text-stone-900">{profileData.phone}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">Favorite Cuisines</span>
                    <p className="font-bold text-stone-900">{profileData.favoriteCuisine}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Saved Delivery Addresses */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Saved Delivery Addresses</span>
              </h3>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>Home (Primary)</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-extrabold px-2 py-0.5 rounded-md">Default</span>
                </div>
                <p className="text-stone-600">742 Evergreen Terrace, Apt 4B</p>
                <p className="text-stone-400 text-[11px]">Downtown Central</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-stone-900">Office / Work</div>
                <p className="text-stone-600">500 Madison Ave, Floor 12</p>
                <p className="text-stone-400 text-[11px]">Financial District</p>
              </div>
            </div>
          </div>

          {/* Orders History List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-black text-base text-stone-950">Recent Food Orders</h3>
                  <p className="text-xs text-stone-500">Track current status or reorder favorite meals</p>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  {orderHistory.length} Total Orders
                </span>
              </div>

              {orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-stone-800">No previous orders yet</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-4">
                    Explore our wood-fired pizzas, smash burgers, and ramen bowls.
                  </p>
                  <Link
                    href="/practice-areas"
                    className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs inline-block"
                  >
                    Start First Order
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-orange-50/20 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-stone-900">#{ord.orderId}</span>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600">
                          {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2 pt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-black text-sm text-stone-900">Rs. {ord.total.toFixed(2)}</span>
                        <button
                          onClick={() => handleTrack(ord)}
                          className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1"
                        >
                          <Bike className="w-3.5 h-3.5 text-amber-400" />
                          <span>Track Live</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
