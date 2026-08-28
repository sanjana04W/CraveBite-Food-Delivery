"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Flame, 
  Bike, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Clock, 
  Heart, 
  ChevronRight, 
  ShoppingBag, 
  UtensilsCrossed, 
  CheckCircle2, 
  Users,
  Leaf
} from "lucide-react";
import { useConsultation } from "@/components/ConsultationContext";

export default function AboutPage() {
  const { openModal } = useConsultation();

  const chefs = [
    {
      name: "Chef Marco Rossi",
      role: "Head Pizzaiolo & Italian Director",
      bio: "20 years of Neapolitan sourdough mastery. Trained in Naples with authentic wood-fired fermentation techniques.",
      photo: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Chef Liam Chen",
      role: "Executive Burger & Asian Specialist",
      bio: "Pioneer of high-heat smash patty science and 16-hour slow simmered tonkotsu ramen broths.",
      photo: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Chef Chloe Martin",
      role: "Master Pastry & Dessert Chocolatier",
      bio: "Belgian-trained artisan chocolatier creating single-origin molten lava fondants and churned gelatos.",
      photo: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const pillars = [
    {
      icon: Leaf,
      title: "100% Farm-Fresh Sourcing",
      desc: "We partner directly with organic family farms. No frozen patties, no artificial enhancers, and zero refined trans fats."
    },
    {
      icon: Bike,
      title: "30-Minute Speed Guarantee",
      desc: "Our rider fleet uses precision thermal bags with moisture vents so hot items arrive piping hot and fries stay crisp."
    },
    {
      icon: ShieldCheck,
      title: "5-Star Kitchen Hygiene",
      desc: "Every dish is prepared in certified commercial spotless kitchens with strict safety protocols and tamper-proof seals."
    },
    {
      icon: Heart,
      title: "Eco-Friendly Recyclable Packaging",
      desc: "100% biodegradable and compostable boxes made from recycled sugarcane bagasse and kraft paper."
    }
  ];

  return (
    <div className="w-full bg-stone-50 text-stone-900 font-sans">
      
      {/* 1. Hero Header */}
      <section 
        className="relative w-full min-h-[460px] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-12 flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.85) 60%, rgba(17, 24, 39, 0.6) 100%), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-2 text-xs text-orange-200 mb-4 font-bold">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-orange-400">About CraveBite</span>
          </div>

          <span className="inline-block bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full mb-3 shadow-xs">
            Our Culinary Mission
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            Crafting Unforgettable Flavors, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Delivered in Minutes.
            </span>
          </h1>

          <p className="max-w-xl text-stone-300 text-xs sm:text-sm leading-relaxed font-medium">
            Born out of passion for authentic artisan cuisine, CraveBite bridges the gap between 5-star restaurant kitchens and fast doorstep delivery.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              The CraveBite Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-950 leading-tight">
              We Believed Delivery Food Should Taste as Incredible as Dining In.
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              In 2021, our founders noticed a recurring frustration: food delivery often meant soggy crusts, lukewarm fries, and bland commercial fast food. We set out to reinvent the entire chain.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              We brought together master pizzaiolos, Wagyu beef artisans, ramen chefs, and food scientists. We designed specialized thermal transit boxes and built small-batch kitchens that start cooking the moment you hit order.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-orange-600">50K+</div>
                <p className="text-xs font-bold text-stone-500">Orders Delivered</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">28 min</div>
                <p className="text-xs font-bold text-stone-500">Average Delivery</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-500">4.95 ★</div>
                <p className="text-xs font-bold text-stone-500">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 relative bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop"
                alt="Chefs in Kitchen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Small-Batch Cooking
                </span>
                <h4 className="text-lg font-black mt-1">Cooked to Order with Precision Heat</h4>
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 3. Core Pillars */}
      <section className="bg-stone-100 py-16 lg:py-24 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Our Core Standards
            </span>
            <h2 className="text-3xl font-black text-stone-950 mt-1">
              What Sets CraveBite Apart
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-stone-900 mb-2">{p.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Meet Our Master Chefs */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
            Culinary Artisans
          </span>
          <h2 className="text-3xl font-black text-stone-950 mt-1">
            Meet the Masterminds in Our Kitchen
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefs.map((chef, idx) => (
            <motion.div
              key={chef.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition group flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden relative bg-stone-100">
                <img
                  src={chef.photo}
                  alt={chef.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-orange-600 transition">
                    {chef.name}
                  </h3>
                  <p className="text-xs font-bold text-orange-600 mb-2">{chef.role}</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{chef.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-white/10 px-3 py-1 rounded-full">
            Taste The CraveBite Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-4">
            Ready to Order Your First Gourmet Feast?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mb-8 max-w-xl mx-auto">
            Use coupon <strong className="text-orange-400">CRAVE20</strong> for 20% off your entire order today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/practice-areas"
              className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Online Menu</span>
            </Link>

            <button
              onClick={openModal}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Reserve Table / Catering</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}