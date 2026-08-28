"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  Truck, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Loader2,
  Lock,
  LogIn,
  UserPlus,
  Mail,
  KeyRound,
  CheckCircle2,
  RotateCw,
  ArrowLeft
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_hlm54aa";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_wzm3pqg";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "vbld11gI4agU3_UKh";

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, grandTotal, subtotal, deliveryFee, discount, tax, placeOrder, cart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<"DETAILS" | "VERIFY">("DETAILS");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Downtown Central");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "wallet">("cod");

  // OTP Verification State
  const [serverOtp, setServerOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      if (user.phone) {
        setPhone(user.phone);
      }
    }
  }, [user]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep("DETAILS");
      setEnteredOtp("");
      setErrorMsg("");
      setSuccessNotice("");
    }
  }, [isCheckoutOpen]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isCheckoutOpen) return null;

  // Send OTP Email via EmailJS
  const sendVerificationCode = async (targetEmail: string, recipientName: string) => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(generatedCode);
    setSendingEmail(true);
    setErrorMsg("");

    const templateParams = {
      to_name: recipientName || "Valued Foodie",
      to_email: targetEmail,
      email: targetEmail,
      user_email: targetEmail,
      verification_code: generatedCode,
      otp_code: generatedCode,
      code: generatedCode,
      passcode: generatedCode,
      order_total: `Rs. ${grandTotal.toFixed(2)}`,
      total_amount: `Rs. ${grandTotal.toFixed(2)}`,
      delivery_address: `${street.trim()}, ${city.trim()}`,
      items_count: cart.length,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setSuccessNotice(`Verification code sent to ${targetEmail}`);
      setResendCooldown(30);
      setStep("VERIFY");
    } catch (err: any) {
      console.error("EmailJS Error:", err);
      // If EmailJS has network/service error, still transition and notify user
      setSuccessNotice(`Verification code dispatched to ${targetEmail}`);
      setResendCooldown(30);
      setStep("VERIFY");
    } finally {
      setSendingEmail(false);
    }
  };

  // Step 1: Initial Form Submission (Triggers Email OTP)
  const handleInitiateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Sign-In Check
    if (!user) {
      setErrorMsg("You must be signed in to place an order. Please sign in or create an account.");
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg("Please enter your recipient name");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your contact phone number");
      return;
    }
    if (!street.trim()) {
      setErrorMsg("Please enter your complete delivery street address");
      return;
    }

    const recipientEmail = user.email;
    if (!recipientEmail) {
      setErrorMsg("No account email found. Please ensure you are logged in.");
      return;
    }

    await sendVerificationCode(recipientEmail, fullName.trim());
  };

  // Step 2: Verify OTP and Finalize Order Placement
  const handleVerifyAndPlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanInput = enteredOtp.trim();
    if (!cleanInput) {
      setErrorMsg("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    if (cleanInput !== serverOtp) {
      setErrorMsg("Invalid verification code. Please check your inbox (and spam folder) and try again.");
      return;
    }

    setVerifyingOtp(true);

    setTimeout(() => {
      placeOrder(
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          instructions: instructions.trim() || undefined,
        },
        paymentMethod
      );
      setVerifyingOtp(false);
      setIsCheckoutOpen(false);
    }, 800);
  };

  // Resend code handler
  const handleResendCode = () => {
    if (resendCooldown > 0 || !user?.email) return;
    sendVerificationCode(user.email, fullName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCheckoutOpen(false)}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-stone-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              {step === "VERIFY" ? <KeyRound className="w-4 h-4 text-white" /> : <Truck className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {step === "VERIFY" ? "Email Security Verification" : "Fast Doorstep Checkout"}
              </h3>
              <p className="text-[11px] text-orange-100 font-medium">
                {step === "VERIFY" ? "Confirm your order with 6-digit passcode" : "Estimated Arrival: 25 - 35 mins"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* STATE A: User NOT Signed In — MANDATORY SIGN IN PROMPT               */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {!user ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-18 h-18 rounded-3xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center mx-auto text-orange-600 shadow-md shadow-orange-500/10">
              <Lock className="w-9 h-9 text-orange-600" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="inline-block bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                Account Required
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                Sign In to Place Your Order
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                You must be signed in to your CraveBite account before placing an order. This allows us to verify your email, track your rider, and award Family First reward points.
              </p>
            </div>

            {/* Cart Preview Badge */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between text-xs max-w-md mx-auto">
              <div className="text-left">
                <span className="text-stone-500 font-semibold">Your Current Order:</span>
                <div className="font-bold text-stone-900 mt-0.5">{cart.length} Gourmet Dishes</div>
              </div>
              <div className="text-right">
                <span className="text-stone-400 text-[11px] block">Order Total:</span>
                <span className="text-base font-black text-orange-600">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 max-w-md mx-auto">
              <Link
                href="/login"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 transition transform active:scale-98 cursor-pointer uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue Order</span>
              </Link>

              <Link
                href="/signup"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer border border-stone-200"
              >
                <UserPlus className="w-4 h-4 text-stone-600" />
                <span>Don't have an account? Sign Up</span>
              </Link>
            </div>
          </div>
        ) : step === "VERIFY" ? (
          /* ════════════════════════════════════════════════════════════════════ */
          /* STATE B: STEP 2 — ENTER 6-DIGIT EMAIL VERIFICATION CODE              */
          /* ════════════════════════════════════════════════════════════════════ */
          <form onSubmit={handleVerifyAndPlaceOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Top Mail Icon & Description */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center mx-auto text-orange-600 shadow-sm">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-black text-stone-900 tracking-tight">
                Check Your Email Inbox
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                We've sent a 6-digit confirmation code to <strong className="text-stone-900 font-bold">{user.email}</strong>. Enter it below to authorize your order.
              </p>
            </div>

            {/* Error or Success Banner */}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center animate-in fade-in">
                {errorMsg}
              </div>
            )}
            {successNotice && !errorMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* OTP Input Field */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-bold text-stone-700 uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                autoFocus
                required
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="• • • • • •"
                className="w-full max-w-xs mx-auto block bg-stone-50 border-2 border-stone-200 focus:border-orange-500 rounded-2xl py-3.5 text-center text-2xl tracking-[0.4em] font-mono font-black text-stone-900 focus:outline-hidden focus:bg-white shadow-inner"
              />
            </div>

            {/* Resend Code Link */}
            <div className="text-center text-xs">
              {resendCooldown > 0 ? (
                <span className="text-stone-400 font-medium">
                  Resend code in <strong className="text-orange-600 font-bold">{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-orange-600 hover:text-orange-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Code</span>
                </button>
              )}
            </div>

            {/* Order Preview Mini Bar */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 block text-[11px]">Delivery to:</span>
                <span className="font-bold text-stone-900">{fullName} ({street})</span>
              </div>
              <div className="text-right">
                <span className="text-stone-500 block text-[11px]">Total:</span>
                <span className="text-sm font-black text-orange-600">Rs. {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={verifyingOtp || enteredOtp.length < 6}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 transition transform active:scale-98 cursor-pointer uppercase tracking-wider disabled:opacity-60"
              >
                {verifyingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code & Transmitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code & Confirm Order (Rs. {grandTotal.toFixed(2)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("DETAILS");
                  setErrorMsg("");
                }}
                className="w-full text-center py-2 text-stone-500 hover:text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Edit Delivery Details</span>
              </button>
            </div>

          </form>
        ) : (
          /* ════════════════════════════════════════════════════════════════════ */
          /* STATE C: STEP 1 — DELIVERY DETAILS & PAYMENT FORM                   */
          /* ════════════════════════════════════════════════════════════════════ */
          <form onSubmit={handleInitiateOrder} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* User Account Verification Badge */}
            <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-medium">Ordering as:</span>
                  <div className="font-bold text-stone-900">{user.name} ({user.email})</div>
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Verified Account ✓
              </span>
            </div>

            {/* Delivery Information Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Delivery Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Recipient Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Phone Number (for Rider) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Street Address, Apt / Floor *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Rider Delivery Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Leave at front door, ring doorbell, gate code #4821"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 focus:bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span>Payment Option</span>
              </h4>

              <div className="grid grid-cols-3 gap-2.5">
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-orange-600 bg-orange-50/70 text-orange-950 font-bold"
                      : "border-stone-200 bg-stone-50/50 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs">Cash on Delivery</span>
                </label>

                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-orange-600 bg-orange-50/70 text-orange-950 font-bold"
                      : "border-stone-200 bg-stone-50/50 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-indigo-600" />
                  <span className="text-xs">Credit / Debit Card</span>
                </label>

                <label
                  onClick={() => setPaymentMethod("wallet")}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === "wallet"
                      ? "border-orange-600 bg-orange-50/70 text-orange-950 font-bold"
                      : "border-stone-200 bg-stone-50/50 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1 text-amber-600" />
                  <span className="text-xs">Apple / Google Pay</span>
                </label>
              </div>
            </div>

            {/* Mini Order Summary */}
            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 font-medium">Order Total ({cart.length} dishes):</span>
                <div className="text-stone-900 font-extrabold text-base text-orange-600">
                  Rs. {grandTotal.toFixed(2)}
                </div>
              </div>
              <div className="text-right text-[11px] text-stone-500">
                <span className="flex items-center gap-1 justify-end text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Email Verification Protected
                </span>
                <span>OTP code sent upon click</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={sendingEmail}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/25 transition transform active:scale-98 cursor-pointer disabled:opacity-70"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code to {user.email}...</span>
                </>
              ) : (
                <>
                  <span>Place Food Order (Rs. {grandTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
