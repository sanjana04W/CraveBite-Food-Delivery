"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

export default function LoyaltySection() {
  return (
    <section className="py-12 lg:py-16 bg-white overflow-hidden border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Loyalty Container */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-3xl lg:rounded-[36px] overflow-hidden shadow-2xl border border-stone-200 grid grid-cols-1 lg:grid-cols-12 min-h-[460px]"
        >
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* LEFT PANEL: Deep Navy Blue Branding                               */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 bg-[#0E2841] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* C&B Top Logo Emblem with Heartbeat Pulse */}
              <div className="flex items-center">
                <svg className="w-64 h-16 text-orange-500 drop-shadow-md" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left Pulse Line */}
                  <path d="M0 30 H42 L50 12 L58 48 L66 18 L74 38 H88" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Outer Solid Orange Ring */}
                  <circle cx="120" cy="30" r="27" stroke="#F97316" strokeWidth="4" fill="#0A1E32" />
                  
                  {/* Inner Dotted Orange Ring */}
                  <circle cx="120" cy="30" r="20" stroke="#FB923C" strokeWidth="2.2" strokeDasharray="3.5 3.5" />
                  
                  {/* C&B Central Bold Text */}
                  <text x="120" y="36.5" fill="#FB923C" fontSize="16" fontWeight="950" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.8">
                    C&B
                  </text>
                  
                  {/* Right Pulse Line */}
                  <path d="M152 30 H166 L174 14 L182 46 L190 12 L198 36 H240" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Bold Orange Title */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-orange-500 leading-none uppercase font-sans">
                  FAMILY
                </h3>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none uppercase font-sans mt-1">
                  FIRST
                </h3>
              </div>

              {/* Subtitle description */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal max-w-sm">
                Introducing CraveBite's Family First Loyalty Program; rewarding you and your loved ones for your continued cravings.
              </p>
            </div>

            {/* CTA Button in Orange Theme */}
            <div className="pt-8 relative z-10">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-7 py-3 rounded-full text-xs font-black tracking-wider uppercase shadow-lg shadow-orange-500/30 transition transform active:scale-95 cursor-pointer"
              >
                <span>SEE MORE</span>
              </Link>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* RIGHT PANEL: 3 Reward Steps on White Background                   */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            
            {/* Headline */}
            <div className="mb-10 text-left">
              <p className="font-serif italic text-sm sm:text-base text-stone-500 tracking-wide">
                A little loyalty goes
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight uppercase mt-0.5">
                A LONG WAYYY!
              </h2>
            </div>

            {/* 3 Step Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 text-center">
              
              {/* Step 1: Join Us */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-3 group"
              >
                {/* Scalloped Circle Badge with 3 Joined Hands */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full text-[#0E2841] group-hover:text-orange-600 transition-colors" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
                    
                    {/* 3 Joined Hands Icon */}
                    <g transform="translate(25, 25) scale(0.5)" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M50 20 L50 45" />
                      <path d="M35 30 L65 30" />
                      <path d="M25 60 C25 45, 40 45, 50 45 C60 45, 75 45, 75 60" />
                      <path d="M35 75 C35 68, 42 62, 50 62 C58 62, 65 68, 65 75" />
                      <circle cx="50" cy="20" r="8" />
                      <circle cx="28" cy="35" r="7" />
                      <circle cx="72" cy="35" r="7" />
                    </g>
                  </svg>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-orange-600 transition">
                  Join Us
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-[200px]">
                  Step into your nearest selected outlet or register online to get yourself into the race.
                </p>
              </motion.div>

              {/* Step 2: Earn Points */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-3 group"
              >
                {/* Scalloped Circle Badge with Coins Falling into Hand */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full text-[#0E2841] group-hover:text-orange-600 transition-colors" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
                    
                    {/* Coins into Hand Icon */}
                    <g transform="translate(25, 20) scale(0.52)" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Coins */}
                      <circle cx="48" cy="18" r="8" />
                      <circle cx="32" cy="28" r="6" />
                      <circle cx="64" cy="30" r="7" />
                      {/* Falling Lines */}
                      <path d="M48 28 L48 42" strokeDasharray="3 3" />
                      <path d="M32 36 L32 46" strokeDasharray="3 3" />
                      <path d="M64 38 L64 48" strokeDasharray="3 3" />
                      {/* Open Cupped Hand */}
                      <path d="M15 62 C25 60, 35 66, 48 66 C65 66, 75 58, 85 64 C88 66, 85 75, 78 78 L52 82 C40 84, 28 80, 18 74 Z" />
                    </g>
                  </svg>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-orange-600 transition">
                  Earn Points
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-[200px]">
                  Purchase your favourite dishes & drinks to earn loyalty points with every dollar spent.
                </p>
              </motion.div>

              {/* Step 3: Redeem */}
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-3 group"
              >
                {/* Scalloped Circle Badge with Finger Clicking Star / Reward */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full text-[#0E2841] group-hover:text-orange-600 transition-colors" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
                    
                    {/* Hand touching star badge */}
                    <g transform="translate(25, 20) scale(0.52)" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Star Badge */}
                      <circle cx="48" cy="30" r="20" />
                      <path d="M48 18 L51 25 L58 26 L53 31 L55 38 L48 34 L41 38 L43 31 L38 26 L45 25 Z" fill="currentColor" fillOpacity="0.2" />
                      {/* Clicking Finger */}
                      <path d="M48 42 L48 65 C48 70, 52 74, 58 74 C64 74, 68 70, 68 65 L68 55" />
                      <path d="M38 60 L38 68 C38 78, 48 86, 60 86 L74 86 C82 86, 86 80, 86 72 L86 58" />
                    </g>
                  </svg>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-orange-600 transition">
                  Redeem
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-[200px]">
                  Redeem your family reward points on your next purchase for delicious perks and free meals.
                </p>
              </motion.div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
