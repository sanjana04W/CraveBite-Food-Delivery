"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Video, User, Phone } from "lucide-react";
import { Message } from "../types";

interface ConvertConsultationModalProps {
  isOpen: boolean;
  message: Message | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConvertConsultationModal({
  isOpen,
  message,
  onClose,
  onSuccess,
}: ConvertConsultationModalProps) {
  const [consultationType, setConsultationType] = useState("Online");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen || !message) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to your consultation database/API
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E5E7EB] relative space-y-4">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#667085] hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Create Consultation Request</h3>
          <p className="text-xs text-[#667085]">Convert inquiry from {message.name} into a consultation record.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Pre-filled Summary Block */}
          <div className="bg-[#F8F9FB] p-3 rounded-xl border border-[#E5E7EB] space-y-1 text-xs">
            <p className="font-bold text-[#0B1F3A]">{message.subject}</p>
            <p className="text-[#667085]">Practice Area: <span className="font-medium text-[#0B1F3A]">{message.practiceArea}</span></p>
            <p className="text-[#667085]">Client: <span className="font-medium text-[#0B1F3A]">{message.name} ({message.email})</span></p>
          </div>

          {/* Consultation Type Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B1F3A]">Preferred Consultation Type</label>
            <div className="grid grid-cols-3 gap-2">
              {["Online", "In Person", "Phone"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConsultationType(type)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    consultationType === type 
                      ? "border-[#C8A14A] bg-[#C8A14A]/10 text-[#0B1F3A]" 
                      : "border-[#E5E7EB] bg-white text-[#667085] hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1F3A]">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B1F3A]">Preferred Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
                <input 
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0B1F3A]">Additional Notes</label>
            <textarea 
              rows={3}
              placeholder="Add internal scheduling notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-[#C8A14A]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-md transition-all"
            >
              Create Consultation
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}