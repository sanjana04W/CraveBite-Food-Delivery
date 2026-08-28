"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  UtensilsCrossed, 
  Users, 
  Clock, 
  Sparkles,
  Phone,
  Mail,
  ShieldCheck
} from "lucide-react";

const DINING_EXPERIENCES = [
  "Dinner Table for Two",
  "Family Gathering & Birthday Party",
  "Corporate Event & Office Catering",
  "Private Chef Dining Experience",
  "Custom Buffet & Wedding Catering",
  "Weekend Brunch Reservation"
];

const TIME_SLOTS = [
  "12:30 PM (Lunch)",
  "1:30 PM (Lunch)",
  "6:30 PM (Dinner)",
  "7:30 PM (Dinner)",
  "8:30 PM (Dinner)",
  "9:30 PM (Late Night Feast)"
];

export default function ConsultationPage() {
  const [selectedExperience, setSelectedExperience] = useState(DINING_EXPERIENCES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[2]);
  const [guestCount, setGuestCount] = useState("2 Guests");
  const [reservationDate, setReservationDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    description: "",
    consent: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          practiceArea: selectedExperience,
          preferredDate: reservationDate,
          preferredTime: selectedTime,
          description: `Guests: ${guestCount}. Requests: ${formData.description}`,
          consent: formData.consent,
        }),
      });
    } catch (_) {}
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ fullName: "", email: "", phone: "", description: "", consent: true });
    setReservationDate("");
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB] text-stone-900 font-sans pb-20">
      
      {/* 1. Hero Header */}
      <section 
        className="relative w-full min-h-[380px] sm:min-h-[440px] text-white pt-28 pb-20 px-6 lg:px-16 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 50%, rgba(17, 24, 39, 0.45) 100%), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')`
        }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-orange-200 mb-6 font-bold"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-orange-400 font-bold">Reserve Table & Catering</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl font-black text-white leading-tight"
          >
            Book a Gourmet Table or <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Private Event Catering
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-stone-300 text-xs sm:text-sm max-w-xl mt-3 font-medium"
          >
            Reserve your dining table or plan an unforgettable corporate catering feast crafted by our master chefs.
          </motion.p>
        </div>
      </section>

      {/* 2. Reservation Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-10">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-stone-900">Reservation Request Confirmed!</h3>
                <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-bold text-stone-900">{formData.fullName}</strong>. Our kitchen & front-desk manager has received your reservation for <strong className="text-orange-600">{selectedExperience}</strong>. We will confirm via SMS & Email.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    Make Another Booking
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-orange-600 shadow-xs border border-orange-100">
                  <UtensilsCrossed className="w-7 h-7" />
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mb-2">
                    Reserve Your Dining Experience
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Fill out your reservation details below and our dining concierge will confirm your table within minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Your Full Name <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Email Address <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Phone Number <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Party Size
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      >
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 - 4 Guests</option>
                        <option>5 - 8 Guests (Family Table)</option>
                        <option>10+ Guests (Private Event)</option>
                        <option>25+ Guests (Full Hall / Catering)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Preferred Time Slot
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Dining Experience / Occasion <span className="text-orange-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-left text-xs text-stone-800 flex items-center justify-between focus:outline-hidden focus:border-orange-500 font-medium cursor-pointer"
                      >
                        <span>{selectedExperience}</span>
                        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isDropdownOpen ? "rotate-180 text-orange-600" : ""}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                          {DINING_EXPERIENCES.map((exp) => (
                            <button
                              key={exp}
                              type="button"
                              onClick={() => {
                                setSelectedExperience(exp);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors"
                            >
                              {exp}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        className="w-full bg-stone-50/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      Special Dietary Requests or Custom Menu Notes
                    </label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g. Vegetarian seating, gluten-free crust options, birthday candle on dessert, or baby high-chair needed..."
                      className="w-full bg-stone-50/70 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-orange-600 rounded border-stone-300 focus:ring-orange-500 shrink-0 cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-xs text-stone-600 leading-relaxed font-medium cursor-pointer">
                      I confirm my reservation request and agree to receive SMS and email booking status updates.
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition transform active:scale-98 cursor-pointer"
                    >
                      Confirm Table & Catering Booking
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
