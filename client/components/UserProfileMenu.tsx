"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Settings, 
  LogOut, 
  Calendar, 
  KeyRound, 
  X, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useConsultation } from "@/components/ConsultationContext";

export default function UserProfileMenu() {
  const { user, logout, refresh } = useAuth();
  const { openConsultation } = useConsultation();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings / Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize Edit form when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
      // Fetch phone from profile
      fetch("/api/clients/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.data) {
            setEditPhone(data.data.phone || "");
          }
        })
        .catch(() => {});
    }
  }, [user]);

  if (!user || user.role === "admin") return null;

  // Extract initials (e.g. "Rashmi Nishadini" -> "RN")
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user.name);

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    const nameParts = editName.trim().split(" ");
    const firstName = nameParts[0] || editName.trim();
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      const res = await fetch("/api/clients/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: editPhone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMsg({ type: "success", text: "Profile updated successfully." });
        await refresh();
        setTimeout(() => {
          setIsEditProfileOpen(false);
          setProfileMsg(null);
        }, 1200);
      } else {
        setProfileMsg({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Save Password Handler
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match!" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/clients/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg({ type: "success", text: "Password updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsSettingsOpen(false);
          setPasswordMsg(null);
        }, 1200);
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Trigger Button: User Avatar + Name */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 text-white pl-1.5 pr-3 py-1.5 rounded-full border border-slate-700/60 shadow-md transition-all cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-full bg-[#10a37f] text-white flex items-center justify-center text-xs font-bold font-sans shadow-sm shrink-0">
          {initials}
        </div>
        <span className="text-xs font-semibold text-slate-200 capitalize max-w-[130px] truncate">
          {user.name}
        </span>
      </button>

      {/* Modern Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 bg-[#202123] text-slate-200 rounded-2xl shadow-2xl border border-slate-700/60 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
          
          {/* User Header Block */}
          <Link 
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors group border-b border-slate-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#10a37f] text-white flex items-center justify-center text-xs font-bold font-sans shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white capitalize truncate group-hover:text-[#c59b27] transition-colors">
                  {user.name}
                </div>
                <div className="text-[11px] text-slate-400 font-light truncate">
                  Client Account
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </Link>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              onClick={() => { setIsOpen(false); openConsultation(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-orange-400 hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Reserve Table</span>
            </button>
          </div>

          <div className="border-t border-slate-700/50 my-1" />

          {/* Logout Option */}
          <div className="py-1">
            <button
              type="button"
              onClick={async () => {
                setIsOpen(false);
                await logout();
                window.location.href = "/";
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL DIALOG (MATCHING USER SCREENSHOT)                     */}
      {/* ========================================================================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="absolute inset-0" onClick={() => setIsEditProfileOpen(false)} />
          
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[400px] bg-[#202123] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-700/70 z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-6">
              Edit profile
            </h3>

            {/* Avatar Circle with Camera Badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#10a37f] text-white flex items-center justify-center text-2xl font-bold font-sans shadow-lg border-2 border-slate-700/60">
                  {initials}
                </div>
                <div 
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2a2b32] border-2 border-[#202123] flex items-center justify-center text-slate-300 shadow-md cursor-pointer hover:bg-slate-700 transition"
                  title="Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feedback Alert */}
            {profileMsg && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                profileMsg.type === "success" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}>
                {profileMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Display Name Input */}
              <div className="space-y-1.5">
                <div className="bg-[#2a2b32] border border-slate-700/80 rounded-xl p-3 focus-within:border-white transition-all">
                  <label className="block text-[11px] text-slate-400 font-medium">
                    Display name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-none p-0 pt-0.5 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <div className="bg-[#2a2b32] border border-slate-700/80 rounded-xl p-3 focus-within:border-white transition-all">
                  <label className="block text-[11px] text-slate-400 font-medium">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+94 77 000 0000"
                    className="w-full bg-transparent border-none p-0 pt-0.5 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Subtext */}
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Your profile helps attorneys and client support recognize your case and contact you for consultations.
              </p>

              {/* Action Buttons: Cancel and Save */}
              <div className="flex items-center justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-5 py-2 rounded-full border border-slate-600 hover:border-slate-500 text-xs font-semibold text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-200 text-xs font-bold transition-all shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {savingProfile ? "Saving..." : "Save"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACCOUNT SETTINGS & PASSWORD MODAL                                         */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="absolute inset-0" onClick={() => setIsSettingsOpen(false)} />
          
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] bg-[#202123] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-700/70 z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-2">
              Account Settings
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Manage your client security and change password.
            </p>

            {/* Feedback Alert */}
            {passwordMsg && (
              <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.type === "success" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}>
                {passwordMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-3.5">
              
              <div className="bg-[#2a2b32] border border-slate-700/80 rounded-xl p-3 focus-within:border-white transition-all">
                <label className="block text-[11px] text-slate-400 font-medium">
                  Current password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none p-0 pt-0.5 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder:text-slate-500"
                />
              </div>

              <div className="bg-[#2a2b32] border border-slate-700/80 rounded-xl p-3 focus-within:border-white transition-all">
                <label className="block text-[11px] text-slate-400 font-medium">
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-transparent border-none p-0 pt-0.5 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder:text-slate-500"
                />
              </div>

              <div className="bg-[#2a2b32] border border-slate-700/80 rounded-xl p-3 focus-within:border-white transition-all">
                <label className="block text-[11px] text-slate-400 font-medium">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-transparent border-none p-0 pt-0.5 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2 rounded-full border border-slate-600 hover:border-slate-500 text-xs font-semibold text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-2 rounded-full bg-white text-slate-950 hover:bg-slate-200 text-xs font-bold transition-all shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
