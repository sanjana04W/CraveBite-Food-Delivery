"use client";

import React from "react";

interface BookConsultationButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function BookConsultationButton({
  children = "Book a Consultation",
  className = "",
}: BookConsultationButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("open-consultation-modal")
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}