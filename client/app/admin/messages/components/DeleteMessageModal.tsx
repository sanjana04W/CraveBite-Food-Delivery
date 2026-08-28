"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteMessageModalProps {
  isOpen: boolean;
  messageSubject: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMessageModal({
  isOpen,
  messageSubject,
  onClose,
  onConfirm,
}: DeleteMessageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] relative space-y-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#667085] hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Delete Message?</h3>
            <p className="text-xs text-[#667085]">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-[#667085] leading-relaxed">
          Are you sure you want to permanently delete <span className="font-bold text-[#0B1F3A]">"{messageSubject}"</span>? All history and data associated with this message will be removed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shadow-sm"
          >
            Delete Message
          </button>
        </div>
      </div>
    </div>
  );
}