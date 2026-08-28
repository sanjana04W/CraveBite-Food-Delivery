"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  MapPin, 
  CreditCard, 
  EyeOff, 
  ChevronRight, 
  Mail, 
  Clock
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 26, 2026";

  const keyPrinciples = [
    {
      icon: Lock,
      title: "Bank-Grade Encryption",
      desc: "All personal details, order records, and payment transactions are secured with 256-bit SSL encryption."
    },
    {
      icon: MapPin,
      title: "Protected Delivery Addresses",
      desc: "Your address and GPS coordinates are shared exclusively with your assigned courier for the active delivery window."
    },
    {
      icon: EyeOff,
      title: "Zero Third-Party Data Selling",
      desc: "We will never sell, rent, or trade your personal information or ordering habits to third-party marketing brokers."
    },
    {
      icon: CreditCard,
      title: "PCI-DSS Compliant Payments",
      desc: "Credit card details are tokenized directly through encrypted payment processors. We never store raw CVV codes."
    }
  ];

  return (
    <div className="w-full bg-[#F7F2EB] text-stone-900 font-sans pb-20">
      
      {/* 1. Hero Header */}
      <section className="bg-stone-900 text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-orange-400 mb-3 font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-300">Privacy Policy</span>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy & Data Protection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            CraveBite Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Effective Date & Last Updated: {lastUpdated}</span>
          </p>
        </div>
      </section>

      {/* 2. Key Privacy Highlights */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyPrinciples.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8DFC8] shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Detailed Policy Articles */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        
        {/* Intro */}
        <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Welcome to <strong>CraveBite Food Delivery Inc.</strong> (&quot;CraveBite,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting the personal data you share when using our website, ordering platform, mobile web application, and courier delivery services.
          </p>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            This Privacy Policy explains what information we collect, how we process it to fulfill delicious hot food deliveries, and the strict security measures in place to keep your personal data confidential.
          </p>
        </div>

        {/* Section 1 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">1</span>
            <span>Information We Collect</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>To provide fast doorstep food delivery and table reservation services, we collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Contact Details:</strong> Your full name, email address, and verified phone number (used for delivery SMS and driver arrival calls).</li>
              <li><strong>Delivery Addresses:</strong> Street address, apartment/suite number, gate entry codes, and optional delivery notes (e.g., &quot;Leave at front door&quot;).</li>
              <li><strong>Order & Dietary History:</strong> Dishes ordered, spice level customizations, food allergy preferences, and saved favorite items.</li>
              <li><strong>Payment Information:</strong> Encrypted payment tokens, billing ZIP code, and card brand handled through PCI-compliant payment gateways.</li>
              <li><strong>Device & Geolocation Data:</strong> IP address, browser type, and real-time GPS coordinates (when you grant permission to auto-detect nearby restaurant kitchens).</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">2</span>
            <span>How We Use Your Information</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>We process your data strictly for legitimate operational purposes, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Order Fulfillment:</strong> Transmitting food orders to kitchen line chefs and dispatching couriers to your designated delivery point.</li>
              <li><strong>Live GPS Tracking:</strong> Providing interactive map estimation and delivery countdown timers on your Order Tracking screen.</li>
              <li><strong>Customer Support:</strong> Resolving inquiries regarding missing items, order modifications, or instant refunds.</li>
              <li><strong>Service Improvement:</strong> Optimizing delivery route algorithms, menu recommendations, and kitchen preparation times.</li>
              <li><strong>Special Offers & Coupons:</strong> Sending optional promotional discounts (such as our 20% OFF weekend deals), which you may unsubscribe from anytime.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">3</span>
            <span>Sharing of Information</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>We do not sell personal data. We only share necessary details with trusted partners essential to delivering your food:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Assigned Delivery Couriers:</strong> Your first name, delivery address, contact phone number, and special delivery notes during the active transit period.</li>
              <li><strong>Kitchen Operations Staff:</strong> Dish customizations and food allergy flags to ensure safe and accurate cooking.</li>
              <li><strong>Secure Payment Processors:</strong> Authorized financial gateways that process transactions under strict PCI-DSS regulations.</li>
              <li><strong>Legal Compliance:</strong> When required by lawful court orders, food safety regulatory audits, or emergency health investigations.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">4</span>
            <span>Your Data Rights & Control</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>You have full ownership of your personal profile and data:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Access & Update:</strong> You can edit your name, saved delivery addresses, and phone number directly in your account settings.</li>
              <li><strong>Marketing Opt-Out:</strong> Click &quot;Unsubscribe&quot; at the footer of any promotional email to stop receiving non-essential newsletters.</li>
              <li><strong>Account Deletion:</strong> Request full permanent deletion of your profile and saved order records by contacting our Privacy Team.</li>
            </ul>
          </div>
        </section>

        {/* Section 5: Contact */}
        <section className="bg-gradient-to-tr from-stone-900 to-stone-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-500" />
            <span>Questions & Privacy Inquiries</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            If you have questions regarding this Privacy Policy, your personal data, or wish to request data erasure, please contact our Data Protection Officer:
          </p>
          <div className="pt-2 text-xs sm:text-sm space-y-1 text-orange-200">
            <p><strong>CraveBite Privacy Office</strong></p>
            <p>Email: <a href="mailto:privacy@cravebite.com" className="text-orange-400 hover:underline">privacy@cravebite.com</a></p>
            <p>Hotline: +1 (555) 019-2834 (Mon–Fri, 9:00 AM – 6:00 PM EST)</p>
            <p>Address: 128 Culinary Ave, Food District, Suite 400</p>
          </div>
        </section>

      </main>
    </div>
  );
}
