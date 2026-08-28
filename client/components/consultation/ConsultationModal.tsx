"use client";

import React, { useState } from "react";
import {
  Calendar,
  X,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({
  isOpen,
  onClose,
}: ConsultationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [description, setDescription] = useState("");
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPracticeArea("");
    setDescription("");
    setConsent(false);
    setSuccess(false);
    setRequestId("");
    setError("");
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!consent) {
      setError(
        "Please agree to be contacted regarding your consultation request."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          practiceArea,
          description,
          consent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit consultation request."
        );
      }

      setSuccess(true);
      setRequestId(data.consultation.requestId);
    } catch (error: any) {
      console.error("Consultation submission error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold side border */}
        <div className="absolute right-0 top-0 h-full w-3 bg-[#c59b27]" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {!success ? (
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c59b27]/30 bg-[#fffaf0] text-[#c59b27] shadow-sm">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            {/* Heading */}
            <div className="mt-5 text-center">
              <h2 className="font-serif text-3xl font-bold text-[#050c1a]">
                Book a Consultation
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Fill out the form below and our team will contact
                you within 24 hours to schedule your confidential
                consultation.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Full name + email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#050c1a]">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#050c1a]">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                  />
                </div>
              </div>

              {/* Phone + Practice Area */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#050c1a]">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+94 75 123 4567"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#050c1a]">
                    Practice Area *
                  </label>

                  <select
                    required
                    value={practiceArea}
                    onChange={(e) =>
                      setPracticeArea(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                  >
                    <option value="">
                      Select an area
                    </option>

                    <option value="Family Law">
                      Family Law
                    </option>

                    <option value="Criminal Law">
                      Criminal Law
                    </option>

                    <option value="Property Law">
                      Property Law
                    </option>

                    <option value="Corporate Law">
                      Corporate Law
                    </option>

                    <option value="Civil Law">
                      Civil Law
                    </option>

                    <option value="Employment Law">
                      Employment Law
                    </option>

                    <option value="Immigration Law">
                      Immigration Law
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#050c1a]">
                  Brief Description of Your Legal Matter *
                </label>

                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Please briefly describe your legal concern or question..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27]"
                />
              </div>

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) =>
                    setConsent(e.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#c59b27]"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I agree to be contacted regarding my
                  consultation request.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c59b27] px-6 py-4 text-sm font-bold text-[#050c1a] shadow-lg shadow-[#c59b27]/20 transition hover:bg-[#b0881e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success screen */
          <div className="flex min-h-[500px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>

            <h2 className="mt-6 font-serif text-3xl font-bold text-[#050c1a]">
              Request Submitted
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Thank you for contacting Sterling Law. Your
              consultation request has been received successfully.
            </p>

            {requestId && (
              <div className="mt-6 rounded-xl bg-slate-50 px-6 py-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Request ID
                </p>

                <p className="mt-1 text-lg font-bold text-[#c59b27]">
                  {requestId}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="mt-8 rounded-xl bg-[#050c1a] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#101c32]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}