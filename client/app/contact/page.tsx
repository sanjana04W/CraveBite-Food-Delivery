"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Bike, 
  UtensilsCrossed, 
  Store, 
  Sparkles,
  HelpCircle
} from "lucide-react";

const INQUIRY_TYPES = [
  "Order Status / Delivery Issue",
  "Partner Your Restaurant with CraveBite",
  "Become a CraveBite Delivery Rider",
  "Corporate & Party Event Catering",
  "Feedback / Food Quality Review",
  "General Inquiry"
];

const FAQS = [
  {
    question: "What is your average delivery time?",
    answer: "Our average citywide delivery time is 25-35 minutes. Every order is dispatched with thermal insulation and real-time live GPS tracking."
  },
  {
    question: "What if there is an issue with my order?",
    answer: "We guarantee 100% foodie satisfaction. If any dish is missing, damaged, or delayed, our 24/7 live support will instantly re-deliver or issue a full refund."
  },
  {
    question: "How do restaurants partner with CraveBite?",
    answer: "Fill out the contact form selecting 'Partner Your Restaurant'. Our restaurant partnership team will reach out within 24 hours with menu onboarding and tablet setup."
  },
  {
    question: "Do you offer corporate or event catering?",
    answer: "Yes! We cater office lunches, summits, and private parties with live chef setups, buffet warmers, and dedicated attendants."
  }
];

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          fullName,
          email,
          phone,
          practiceArea: inquiryType,
          subject: inquiryType,
          message,
        }),
      });
      setSubmitted(true);
    } catch (_) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-stone-50 text-stone-900 font-sans">
      
      {/* 1. Hero Header */}
      <section 
        className="relative w-full min-h-[380px] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-12 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.85) 60%, rgba(17, 24, 39, 0.6) 100%), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-2 text-xs text-orange-200 mb-4 font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-400">Contact & Support</span>
          </div>

          <span className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 shadow-xs">
            24/7 Foodie Assistance
          </span>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            We're Here to Help You Feast
          </h1>

          <p className="max-w-xl text-stone-300 text-xs sm:text-sm leading-relaxed font-medium">
            Reach out for live order support, restaurant partnership onboarding, rider fleet careers, or custom event catering.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Form & Info Grid */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards & Details */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
                Get In Touch
              </span>
              <h2 className="text-3xl font-black text-stone-950 mt-1">
                Fast Channels to Reach Our Team
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
                Whether you need immediate help with an ongoing delivery or want to partner your kitchen, we respond in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">24/7 Customer Support</h4>
                  <p className="text-xs text-stone-500 mt-0.5">+1 (555) CRAVE-FOOD / +1 (555) 019-2834</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">● Live Phone & Chat Agents Available</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Email & Inquiries</h4>
                  <p className="text-xs text-stone-500 mt-0.5">support@cravebite.com</p>
                  <p className="text-xs text-stone-500">partnerships@cravebite.com</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md transition flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Kitchen & Delivery Hours</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Monday – Sunday: 10:00 AM – 2:00 AM</p>
                  <p className="text-[11px] text-stone-400">Late night deliveries active across all zones</p>
                </div>
              </motion.div>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-center"
              >
                <Store className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <h5 className="text-xs font-bold text-stone-900">Restaurant Partners</h5>
                <p className="text-[10px] text-stone-500">Over 150+ Top Kitchens</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center"
              >
                <Bike className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <h5 className="text-xs font-bold text-stone-900">Rider Fleet</h5>
                <p className="text-[10px] text-stone-500">Flexible shifts & daily payouts</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900">Message Received!</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{fullName}</strong>. Our culinary support team has received your message regarding <em>{inquiryType}</em> and will reply to <strong>{email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-stone-950">Send Us a Message</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Fill in the details below and we will get back to you promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Inquiry Topic *
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                      >
                        {INQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Your Message / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your question, feedback, or partnership request..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 rounded-2xl text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? "Sending..." : "Submit Inquiry"}</span>
                  </button>
                </form>
              )}

            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Frequently Asked Questions */}
      <section className="bg-stone-100 py-16 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-1">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition"
              >
                <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed pl-6">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}