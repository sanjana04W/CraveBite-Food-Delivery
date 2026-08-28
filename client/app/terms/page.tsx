"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Bike, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Mail, 
  Clock, 
  RotateCcw,
  UtensilsCrossed
} from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "August 26, 2026";

  const keyGuarantees = [
    {
      icon: Bike,
      title: "30-Min Fast Delivery",
      desc: "Fresh, hot food dispatched in temperature-regulated insulated boxes with real-time GPS tracking."
    },
    {
      icon: RotateCcw,
      title: "Hassle-Free Refunds",
      desc: "If any item arrives damaged or missing, report within 2 hours for an instant full refund or re-delivery."
    },
    {
      icon: AlertTriangle,
      title: "Allergy & Dietary Transparency",
      desc: "Clear ingredient disclosures on all dishes, with vegan, vegetarian, and gluten-free tags."
    },
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      desc: "No hidden surge fees. What you see at checkout is your complete and final order total."
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
            <span className="text-stone-300">Terms of Service</span>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Customer Agreement & Terms</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
            CraveBite Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-orange-400" />
            <span>Effective Date & Last Updated: {lastUpdated}</span>
          </p>
        </div>
      </section>

      {/* 2. Key Highlights */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyGuarantees.map((item) => {
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

      {/* 3. Detailed Terms Articles */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        
        {/* Agreement Intro */}
        <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Please read these Terms of Service (&quot;Terms&quot;) carefully before ordering food, booking restaurant tables, or creating an account with <strong>CraveBite Food Delivery Inc.</strong> (&quot;CraveBite,&quot; &quot;we,&quot; or &quot;us&quot;).
          </p>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            By accessing our platform or placing an order, you agree to be bound by these Terms. If you do not agree to all terms and conditions, you may not access or use our delivery platform.
          </p>
        </div>

        {/* Section 1 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">1</span>
            <span>Placing Orders & Pricing</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>All orders placed through CraveBite are subject to kitchen availability and confirmation:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Menu Pricing:</strong> Dish prices, ingredient add-ons, and applicable taxes are clearly displayed at checkout before payment.</li>
              <li><strong>Promotions & Coupons:</strong> Valid promo codes (e.g. <code>CRAVE20</code>) must be applied prior to placing the order. Discounts cannot be applied retroactively after order confirmation.</li>
              <li><strong>Minimum Order:</strong> Free delivery applies automatically to carts meeting our minimum threshold (Rs. 30.00). Standard delivery fees apply to smaller orders.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">2</span>
            <span>Delivery Policy & Customer Handoff</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>We take pride in our 30-minute average delivery speed:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Accurate Delivery Address:</strong> You are responsible for providing precise street addresses, unit numbers, gate codes, and an active contact number.</li>
              <li><strong>Driver Waiting Period:</strong> Our couriers will attempt to contact you for up to 10 minutes upon arrival at your delivery location. Uncollected food cannot be refunded once delivered to the specified address.</li>
              <li><strong>Inclement Weather & Traffic:</strong> Delivery estimates are provided in good faith. Severe weather conditions or unexpected traffic gridlock may occasionally extend transit times.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">3</span>
            <span>Cancellations, Refunds & Quality Guarantee</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>Because our dishes are prepared fresh upon ordering, the following cancellation and refund policies apply:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li><strong>Cancellation Window:</strong> You may cancel an order free of charge within <strong>3 minutes</strong> of placing it (before kitchen line cooking begins).</li>
              <li><strong>Missing or Incorrect Items:</strong> If an item is missing or incorrect, submit a photo to customer support within 2 hours of delivery for an immediate credit refund or re-delivery.</li>
              <li><strong>Quality Guarantee:</strong> If a dish arrives cold or compromised, our support team will promptly issue a replacement or refund to your original payment method.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">4</span>
            <span>Food Allergens & Dietary Notice</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>While our chefs adhere to strict kitchen sanitization and allergen separation protocols:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li>Our kitchens handle common allergens including <strong>nuts, dairy, gluten, shellfish, soy, and eggs</strong>.</li>
              <li>If you have a severe food allergy, please note it in the special instructions box when adding items to your cart or contact our kitchen directly before ordering.</li>
              <li>CraveBite cannot guarantee 100% airborne zero-cross-contamination in shared commercial kitchen spaces.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-black">5</span>
            <span>Table Reservations & Catering Inquiries</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>For table bookings and private event catering:</p>
            <ul className="list-disc pl-5 space-y-2 text-stone-600">
              <li>Reservations submitted through our Table Booking portal are held for 15 minutes past the scheduled time before being released to waitlisted guests.</li>
              <li>Large party catering requests (15+ guests) must be confirmed at least 24 hours in advance with our kitchen operations team.</li>
            </ul>
          </div>
        </section>

        {/* Section 6: Contact */}
        <section className="bg-gradient-to-tr from-stone-900 to-stone-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-md space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-500" />
            <span>Support & Legal Inquiries</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Have questions about these terms or need immediate assistance with an existing order? Our customer support desk is available 7 days a week:
          </p>
          <div className="pt-2 text-xs sm:text-sm space-y-1 text-orange-200">
            <p><strong>CraveBite Customer Support & Operations</strong></p>
            <p>Email: <a href="mailto:support@cravebite.com" className="text-orange-400 hover:underline">support@cravebite.com</a></p>
            <p>Hotline: +1 (555) 019-2834 (7 Days: 10:00 AM – 2:00 AM EST)</p>
            <p>Headquarters: 128 Culinary Ave, Downtown Food District, Suite 400</p>
          </div>
        </section>

      </main>
    </div>
  );
}
