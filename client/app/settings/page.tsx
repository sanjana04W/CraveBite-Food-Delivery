"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Bell,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  Lock,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function ClientSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // Client Data from MongoDB
  const [clientData, setClientData] = useState({
    email: "",
    phone: "",
    name: "",
  });

  const [loading, setLoading] = useState(true);

  // Security / Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Notification Toggles (Default: ON)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  // Delete Account Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch client details
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetch("/api/clients/profile")
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setClientData({
              email: res.data.email || user.email || "",
              phone: res.data.phone || "+94 77 123 4567",
              name: res.data.clientName || user.name || "",
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/clients/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangingPassword(false);

        setTimeout(() => {
          setPasswordSuccess("");
        }, 4000);
      } else {
        setPasswordError(data.error || "Failed to change password.");
      }
    } catch {
      setPasswordError("A network error occurred. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Account Sign Out
  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeletingAccount(true);

    try {
      const res = await fetch("/api/clients/profile", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsDeleteModalOpen(false);
        await logout();
        window.location.href = "/login";
      } else {
        setDeleteError(data.error || "Failed to delete account. Please try again.");
      }
    } catch {
      setDeleteError("Failed to connect to the server.");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#C59B27] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1C2434] font-sans pb-24 pt-24">
      <div className="max-w-[1050px] mx-auto px-5 sm:px-8">
        
        {/* ================================================================= */}
        {/* 1. BREADCRUMB NAVIGATION                                          */}
        {/* ================================================================= */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748B] mb-6">
          <Link href="/" className="hover:text-[#C59B27] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#07132B] font-semibold">Settings</span>
        </nav>

        {/* ================================================================= */}
        {/* 2. PAGE HEADER                                                    */}
        {/* ================================================================= */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 bg-[#C59B27] rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#07132B] tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[#64748B] font-light pl-4.5">
            Manage your account preferences, security and notifications.
          </p>
        </div>

        {/* GLOBAL SUCCESS ALERT */}
        {passwordSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm flex items-center gap-3 font-medium shadow-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <div className="space-y-8">
          
          {/* =============================================================== */}
          {/* 3. ACCOUNT SETTINGS CARD                                        */}
          {/* =============================================================== */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#07132B]">
                  Account
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-light">
                  Basic contact details linked to your client profile.
                </p>
              </div>

              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 bg-[#C59B27] hover:bg-[#B0881E] text-[#07132B] px-4.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm shrink-0"
              >
                <span>Update Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-[#F8F9FB] border border-slate-200/70 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Email Address</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#07132B] break-all">
                  {clientData.email || "N/A"}
                </div>
              </div>

              <div className="bg-[#F8F9FB] border border-slate-200/70 rounded-xl p-4.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Phone Number</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#07132B]">
                  {clientData.phone || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 4. SECURITY SECTION CARD                                        */}
          {/* =============================================================== */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#07132B]">
                  Security
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-light">
                  Manage your client account password and security credentials.
                </p>
              </div>

              {!isChangingPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setPasswordError("");
                  }}
                  className="inline-flex items-center gap-1.5 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-[#07132B] px-4.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Change Password</span>
                </button>
              )}
            </div>

            {/* Password Display / Change Interface */}
            {!isChangingPassword ? (
              <div className="bg-[#F8F9FB] border border-slate-200/70 rounded-xl p-4.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    Password
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-[#07132B] tracking-widest">
                    ••••••••••••
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protected</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-5 bg-[#F8F9FB] border border-slate-200 rounded-2xl p-6">
                
                {passwordError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#07132B] mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-slate-950 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C59B27]/30 focus:border-[#C59B27] shadow-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#07132B] mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-slate-950 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C59B27]/30 focus:border-[#C59B27] shadow-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#07132B] mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-10 text-sm text-slate-950 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C59B27]/30 focus:border-[#C59B27] shadow-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError("");
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-xs sm:text-sm font-bold text-[#1C2434] transition-all cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#B0881E] text-[#07132B] text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
                  >
                    {savingPassword ? "Updating Password..." : "Update Password"}
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* =============================================================== */}
          {/* 5. NOTIFICATION SETTINGS CARD                                   */}
          {/* =============================================================== */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
            <div className="border-b border-[#E5E7EB] pb-4 mb-6">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#07132B]">
                Notifications
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-light">
                Configure your communication preferences for case updates and appointments.
              </p>
            </div>

            <div className="space-y-5">
              
              {/* Setting 1: Email Notifications */}
              <div className="flex items-center justify-between p-4.5 bg-[#F8F9FB] border border-slate-200/70 rounded-xl gap-4">
                <div>
                  <div className="text-sm font-bold text-[#07132B]">
                    Email Notifications
                  </div>
                  <div className="text-xs text-[#64748B] font-light mt-0.5">
                    Receive important updates about your consultations and legal matters.
                  </div>
                </div>

                {/* Custom Navy/Gold Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifications}
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
                    emailNotifications ? "bg-[#C59B27]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      emailNotifications ? "translate-x-5.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Setting 2: Appointment Reminders */}
              <div className="flex items-center justify-between p-4.5 bg-[#F8F9FB] border border-slate-200/70 rounded-xl gap-4">
                <div>
                  <div className="text-sm font-bold text-[#07132B]">
                    Appointment Reminders
                  </div>
                  <div className="text-xs text-[#64748B] font-light mt-0.5">
                    Receive reminders about your upcoming appointments.
                  </div>
                </div>

                {/* Custom Navy/Gold Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={appointmentReminders}
                  onClick={() => setAppointmentReminders(!appointmentReminders)}
                  className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
                    appointmentReminders ? "bg-[#C59B27]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      appointmentReminders ? "translate-x-5.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* =============================================================== */}
          {/* 6. ACCOUNT ACTIONS (SIGN OUT) CARD                              */}
          {/* =============================================================== */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#07132B]">
                  Sign Out
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] font-light mt-0.5">
                  Sign out from your Sterling Law client account.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-[#07132B] px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4 text-[#C59B27]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 7. DANGER ZONE (DELETE ACCOUNT)                                  */}
          {/* =============================================================== */}
          <div className="pt-4 border-t border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-rose-50/40 border border-rose-100">
              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Delete Account
                </h4>
                <p className="text-xs text-rose-700/80 font-light mt-0.5">
                  Permanently delete your client account and associated account data.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 border border-rose-200 hover:border-rose-300 hover:bg-rose-100/60 text-rose-700 px-4 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer shrink-0"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* CONFIRMATION MODAL: DELETE ACCOUNT                                */}
        {/* ================================================================= */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div 
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-serif font-bold text-[#07132B] mb-2">
                Delete your account?
              </h3>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-light">
                Are you sure you want to delete your account? This action may affect your access to consultations, documents and case information.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deletingAccount}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-xs sm:text-sm font-bold text-[#1C2434] transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {deletingAccount ? "Deleting Account..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
