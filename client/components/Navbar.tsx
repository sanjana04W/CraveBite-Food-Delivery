"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Flame, 
  ShoppingBag, 
  LogIn, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight, 
  UserPlus, 
  UtensilsCrossed,
  Bike,
  Sparkles,
  Info,
  PhoneCall
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "@/components/CartContext";
import { useConsultation } from "@/components/ConsultationContext";
import UserProfileMenu from "@/components/UserProfileMenu";
import BrandLogoIcon from "@/components/BrandLogoIcon";

export default function Navbar() {
  const { user } = useAuth();
  const { totalItemsCount, grandTotal, setIsCartOpen } = useCart();
  const { openModal } = useConsultation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
        setIsMoreOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CORE_NAV_LINKS = [
    { name: "Menu", href: "/practice-areas" },
    { name: "Deals & Offers", href: "/#offers" },
    { name: "Food Stories", href: "/articles" },
    { name: "Track Order", href: "/track-order" },
  ];

  const MORE_LINKS = [
    { name: "About Us", href: "/about", icon: Info, desc: "Our story & master chefs" },
    { name: "Contact & Support", href: "/contact", icon: PhoneCall, desc: "24/7 hotline & partner sign up" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFC8]/80 transition-transform duration-300 shadow-2xs ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 font-sans">
        
        {/* 1. LEFT: Clean Brand Logo */}
        <Link 
          href="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 shrink-0 group"
        >
          <div className="group-hover:scale-105 transition transform">
            <BrandLogoIcon className="w-10 h-10" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center text-xl font-black tracking-tight text-stone-900 leading-none">
              <span>Crave</span>
              <span className="text-orange-600">Bite</span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase mt-1">
              Food Delivery
            </span>
          </div>
        </Link>

        {/* 2. CENTER: Clean & Spacious Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {CORE_NAV_LINKS.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-xs font-bold text-stone-600 hover:text-orange-600 transition tracking-wide py-1 relative group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-600 transition-all duration-300 ease-out group-hover:w-full rounded-full" />
            </Link>
          ))}

          {/* More Dropdown */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-orange-600 transition tracking-wide py-1 cursor-pointer"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? "rotate-180 text-orange-600" : "text-stone-400"}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                {MORE_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMoreOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-600 group-hover:text-white transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-orange-600 transition">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-stone-400 font-medium">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* 3. RIGHT: Organized Action Cluster */}
        <div className="flex items-center gap-3">
          
          {/* Table Booking CTA */}
          <button
            type="button"
            onClick={openModal}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-bold transition shadow-2xs cursor-pointer border border-stone-200"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
            <span>Table Booking</span>
          </button>

          {/* Cart Pill */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 px-3.5 py-2 rounded-xl text-xs font-black transition shadow-2xs cursor-pointer group"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-orange-600 group-hover:scale-110 transition" />
            <span>{totalItemsCount > 0 ? `Rs. ${grandTotal.toFixed(2)}` : "Cart"}</span>
            {totalItemsCount > 0 && (
              <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Customer Profile Menu or Auth Links */}
          {user && user.role !== "admin" ? (
            <div className="pl-1">
              <UserProfileMenu />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 pl-1">
              <Link
                href="/login"
                className="text-stone-700 hover:text-orange-600 px-3 py-2 text-xs font-bold transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm shadow-orange-500/20 transition transform active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 hover:text-orange-600 transition shadow-2xs cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 shadow-2xl px-5 py-6 font-sans animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            {[...CORE_NAV_LINKS, ...MORE_LINKS].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-bold text-stone-800 hover:text-orange-600 py-2.5 px-3 rounded-xl hover:bg-orange-50 transition"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openModal();
              }}
              className="flex items-center justify-between text-sm font-bold text-orange-700 py-2.5 px-3 rounded-xl bg-orange-50 transition mt-1"
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>Reserve Table / Catering</span>
              </div>
              <ChevronRight className="w-4 h-4 text-orange-400" />
            </button>

            {/* Mobile Auth Buttons */}
            {(!user || user.role === "admin") && (
              <div className="border-t border-stone-200 pt-4 mt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-stone-100 border border-stone-200 text-stone-900 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  <LogIn className="w-4 h-4 text-orange-600" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Create Account (Sign Up)</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}