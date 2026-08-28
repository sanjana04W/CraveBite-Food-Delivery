"use client";

import { UtensilsCrossed } from "lucide-react";
import { useConsultation } from "./ConsultationContext";

export default function ConsultationOpenButton({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { openModal } = useConsultation();

  return (
    <button
      type="button"
      onClick={openModal}
      className={
        className ??
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide shadow-md transition transform active:scale-95 cursor-pointer"
      }
    >
      <UtensilsCrossed className="w-3.5 h-3.5" />
      <span>{children ?? "Reserve Table"}</span>
    </button>
  );
}
