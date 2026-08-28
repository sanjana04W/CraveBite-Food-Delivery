"use client";

import React from "react";

interface BrandLogoIconProps {
  className?: string;
  variant?: "orange-squircle" | "emblem-circle";
}

export default function BrandLogoIcon({
  className = "w-10 h-10",
  variant = "orange-squircle",
}: BrandLogoIconProps) {
  if (variant === "emblem-circle") {
    return (
      <div className={`relative ${className} shrink-0`}>
        <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Deep Navy Background with Thick Orange Border */}
          <circle cx="50" cy="50" r="45" fill="#0E2841" stroke="#F97316" strokeWidth="7" />
          {/* Dotted Inner Ring */}
          <circle cx="50" cy="50" r="33" stroke="#FB923C" strokeWidth="3" strokeDasharray="3.5 3.5" />
          {/* Bold C&B Letters */}
          <text
            x="50"
            y="59"
            fill="#FB923C"
            fontSize="26"
            fontWeight="950"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.5"
          >
            C&amp;B
          </text>
        </svg>
      </div>
    );
  }

  // Default: Orange Gradient Squircle with C&B Seal in White/Amber
  return (
    <div className={`relative ${className} shrink-0`}>
      <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="craveBiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        
        {/* Orange Gradient Rounded Squircle */}
        <rect width="100" height="100" rx="30" fill="url(#craveBiteGrad)" />
        
        {/* Outer Circular Ring */}
        <circle cx="50" cy="50" r="37" stroke="white" strokeWidth="3.5" />
        
        {/* Inner Dotted Ring */}
        <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="2.5" strokeDasharray="3 3.5" strokeOpacity="0.9" />
        
        {/* C&B Bold Center Text */}
        <text
          x="50"
          y="59"
          fill="white"
          fontSize="24"
          fontWeight="950"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.8"
        >
          C&amp;B
        </text>
      </svg>
    </div>
  );
}
