"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  User, Lock, Bell, Shield, Monitor, Trash2,
  CheckCircle2, AlertTriangle, X, Eye, EyeOff, Smartphone,
  Save, Loader2, RefreshCcw
} from "lucide-react";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { useAdminProfile } from "../components/AdminProfileContext";

type NotifKey =
  | "newContactMessages" | "newConsultations" | "upcomingAppointments"
  | "appointmentReminders" | "clientRegistration" | "articleComments"
  | "emailAlerts" | "browserAlerts";

type NotifState = Record<NotifKey, boolean>;

const DEFAULT_NOTIFS: NotifState = {
  newContactMessages: true,
  newConsultations: true,
  upcomingAppointments: true,
  appointmentReminders: true,
  clientRegistration: false,
  articleComments: true,
  emailAlerts: true,
  browserAlerts: true,
};

export default function AdminSettingsPage() {
  const { adminUser, logout, refreshAdmin } = useAdminAuth();
  const { refreshAdminProfile } = useAdminProfile();

  const [activeTab, setActiveTab]             = useState("account");
  const [successToast, setSuccessToast]       = useState("");
  const [errorToast, setErrorToast]           = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [saving, setSaving]                   = useState(false);

  // Account Settings state (synced with AdminProfile & AdminSettings)
  const [firstName, setFirstName]             = useState("");
  const [lastName, setLastName]               = useState("");
  const [email, setEmail]                     = useState("");
  const [phone, setPhone]                     = useState("");
  const [title, setTitle]                     = useState("Restaurant Executive / Kitchen Director");
  const [address, setAddress]                 = useState("Downtown Food District");
  const [language, setLanguage]               = useState("English (US)");
  const [timeZone, setTimeZone]               = useState("(GMT+05:30) Colombo, Sri Lanka");

  // Notifications state
  const [notifs, setNotifs]                   = useState<NotifState>(DEFAULT_NOTIFS);

  // Security / Password change state
  const [currentPw, setCurrentPw]             = useState("");
  const [newPw, setNewPw]                     = useState("");
  const [confirmPw, setConfirmPw]             = useState("");
  const [showCurrentPw, setShowCurrentPw]     = useState(false);
  const [showNewPw, setShowNewPw]             = useState(false);
  const [changingPw, setChangingPw]           = useState(false);
  const [pwError, setPwError]                 = useState("");
  const [twoFactor, setTwoFactor]             = useState(false);

  // Appearance state
  const [theme, setTheme]                     = useState("Light");
  const [compactSidebar, setCompactSidebar]   = useState(false);

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorToast(msg);
      setTimeout(() => setErrorToast(""), 4000);
    } else {
      setSuccessToast(msg);
      setTimeout(() => setSuccessToast(""), 3500);
    }
  };

  // Load all settings and profile from MongoDB
  const loadData = useCallback(async () => {
    try {
      const [settingsRes, profileRes] = await Promise.all([
        fetch("/api/admin-settings"),
        fetch("/api/admin-profile"),
      ]);

      const settingsData = await settingsRes.json();
      const profileData  = await profileRes.json();

      if (settingsData.success && settingsData.data) {
        const s = settingsData.data;
        setLanguage(s.language || "English (US)");
        setTimeZone(s.timeZone || "(GMT+05:30) Colombo, Sri Lanka");
        setTheme(s.theme || "Light");
        setCompactSidebar(!!s.compactSidebar);
        setTwoFactor(!!s.twoFactorEnabled);
        if (s.notifications) {
          setNotifs({ ...DEFAULT_NOTIFS, ...s.notifications });
        }
      }

      if (profileData.success && profileData.data) {
        const p = profileData.data;
        setFirstName(p.firstName || "");
        setLastName(p.lastName || "");
        setPhone(p.phone || "");
        setTitle(p.title || "Attorney-at-Law");
        setAddress(p.address || "");
      }

      if (adminUser?.email) {
        setEmail(adminUser.email);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [adminUser?.email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 1. SAVE ACCOUNT SETTINGS
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save settings (language & timezone)
      const settingsPromise = fetch("/api/admin-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, timeZone }),
      });

      // Save profile updates (first name, last name, email, phone, title, address)
      const profilePromise = fetch("/api/admin-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          title,
          address,
        }),
      });

      const [res1, res2] = await Promise.all([settingsPromise, profilePromise]);
      const data1 = await res1.json();
      const data2 = await res2.json();

      if (data1.success && data2.success) {
        await refreshAdmin();
        await refreshAdminProfile();
        showToast("Account details updated successfully!");
      } else {
        showToast(data1.error || data2.error || "Failed to update account.", true);
      }
    } catch {
      showToast("Network error. Please try again.", true);
    } finally {
      setSaving(false);
    }
  };

  // 2. SAVE NOTIFICATION PREFERENCES
  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications: notifs }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Notification preferences updated and saved.");
      } else {
        showToast(data.error || "Failed to save notifications.", true);
      }
    } catch {
      showToast("Network error.", true);
    } finally {
      setSaving(false);
    }
  };

  // 3. CHANGE PASSWORD
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");

    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }

    setChangingPw(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
        showToast("Password updated securely!");
      } else {
        setPwError(data.error || "Failed to update password.");
      }
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setChangingPw(false);
    }
  };

  // 4. TOGGLE 2FA
  const handleToggle2FA = async () => {
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    try {
      await fetch("/api/admin-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFactorEnabled: nextVal }),
      });
      showToast(`Two-Factor Authentication ${nextVal ? "enabled" : "disabled"}.`);
    } catch (_) {}
  };

  // 5. SAVE APPEARANCE (Theme / Compact Sidebar)
  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    try {
      await fetch("/api/admin-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
      showToast(`Theme set to ${newTheme}.`);
    } catch (_) {}
  };

  const handleToggleCompact = async () => {
    const nextVal = !compactSidebar;
    setCompactSidebar(nextVal);
    try {
      await fetch("/api/admin-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compactSidebar: nextVal }),
      });
      showToast(`Compact sidebar ${nextVal ? "enabled" : "disabled"}.`);
    } catch (_) {}
  };

  // 6. LOGOUT
  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  const currentAdminName = [firstName, lastName].filter(Boolean).join(" ") || adminUser?.name || "Admin";

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#667085]">
        <Loader2 className="w-6 h-6 animate-spin text-[#C8A14A] mx-auto mb-2" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#C8A14A]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Toast */}
      {errorToast && (
        <div className="fixed top-6 right-6 z-50 bg-red-700 text-white px-4 py-3 rounded-2xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
          <span>Home</span> / <span className="text-[#0B1F3A] font-medium">Settings</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">Settings</h1>
        <p className="text-xs text-[#667085] mt-1">
          Manage administrator credentials, preferences, security, notifications, and localization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Navigation Tabs */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-2 border border-[#E5E7EB] shadow-sm flex lg:flex-col gap-1 overflow-x-auto">
          {[
            { id: "account",       label: "Account",       icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security",      label: "Security",      icon: Shield },
            { id: "appearance",    label: "Appearance",    icon: Monitor },
            { id: "danger",        label: "Danger Zone",   icon: Trash2, danger: true },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap w-full ${
                  isActive
                    ? "bg-[#0B1F3A] text-white font-bold"
                    : item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-[#667085] hover:bg-[#F8F9FB] hover:text-[#0B1F3A]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C8A14A]" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-9 space-y-6">

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* 1. ACCOUNT TAB                                                   */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "account" && (
            <form onSubmit={handleSaveAccount} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Account Settings</h3>
                <p className="text-xs text-[#667085]">
                  Manage your administrator profile details, login contact information, and localization.
                </p>
              </div>

              {/* Current Active Admin Badge */}
              <div className="bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Administrator</span>
                  <span className="font-bold text-[#0B1F3A]">{currentAdminName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Login Email</span>
                  <span className="font-semibold text-[#0B1F3A]">{adminUser?.email || email || "Admin@gmail.com"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#667085]">System Role</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8A14A]/10 text-[#0B1F3A] border border-[#C8A14A]/30">
                    Administrator
                  </span>
                </div>
              </div>

              {/* Editable Admin Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-[#0B1F3A]">Admin Login Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@cravebite.com"
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-orange-500 font-semibold"
                  />
                  <p className="text-[10px] text-stone-500">This email will be used to log in to the admin portal.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Contact Phone</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Professional Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Restaurant Executive / Chef Manager"
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Office / Practice Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Office address"
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>

              {/* Language & Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E5E7EB]">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Preferred Language</label>
                  <select 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Sinhala</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Time Zone</label>
                  <select 
                    value={timeZone} 
                    onChange={e => setTimeZone(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    <option>(GMT+05:30) Colombo, Sri Lanka</option>
                    <option>(GMT+00:00) London, UK</option>
                    <option>(GMT-05:00) New York, USA</option>
                    <option>(GMT+01:00) Paris, France</option>
                    <option>(GMT+08:00) Singapore</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <button 
                  type="button" 
                  onClick={loadData}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving Changes..." : "Save Account Settings"}
                </button>
              </div>
            </form>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* 2. NOTIFICATIONS TAB                                             */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Notification Preferences</h3>
                <p className="text-xs text-[#667085]">
                  Select which notification alerts you want to receive across the admin portal and channels.
                </p>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {([
                  { key: "newContactMessages",   title: "New Contact Messages",       desc: "When someone submits a message through the website contact form." },
                  { key: "newConsultations",     title: "New Consultation Requests",  desc: "When a client books or requests a formal consultation slot." },
                  { key: "upcomingAppointments", title: "Upcoming Appointments",      desc: "Daily briefings for scheduled lawyer-client meetings." },
                  { key: "appointmentReminders", title: "Appointment Reminders",      desc: "Reminders 30 minutes before consultations begin." },
                  { key: "clientRegistration",   title: "New Client Registration",    desc: "Alerts when new clients create portal profiles." },
                  { key: "articleComments",      title: "New Article Comments",       desc: "Notifications when comments are submitted on published legal insights." },
                  { key: "emailAlerts",          title: "Email Notifications",        desc: "Receive digest summaries directly to your registered inbox." },
                  { key: "browserAlerts",        title: "Browser Notifications",      desc: "Show push notifications on your active browser session." },
                ] as { key: NotifKey; title: string; desc: string }[]).map(item => (
                  <div key={item.key} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div>
                      <h4 className="text-xs font-bold text-[#0B1F3A]">{item.title}</h4>
                      <p className="text-[11px] text-[#667085] mt-0.5">{item.desc}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        notifs[item.key] ? "bg-[#C8A14A]" : "bg-slate-200"
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notifs[item.key] ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <button 
                  onClick={handleSaveNotifications} 
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* 3. SECURITY TAB                                                  */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Change Password</h3>
                  <p className="text-xs text-[#667085]">
                    Update your secure administrator credentials. Password must be at least 6 characters.
                  </p>
                </div>

                {pwError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {pwError}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-[#0B1F3A]">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPw ? "text" : "password"} 
                        required 
                        value={currentPw}
                        onChange={e => setCurrentPw(e.target.value)} 
                        placeholder="••••••••••••"
                        className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 pr-10 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowCurrentPw(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#0B1F3A]"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F3A]">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNewPw ? "text" : "password"} 
                          required 
                          value={newPw}
                          onChange={e => setNewPw(e.target.value)} 
                          placeholder="••••••••••••"
                          className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 pr-10 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNewPw(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#0B1F3A]"
                        >
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B1F3A]">Confirm New Password</label>
                      <input 
                        type="password" 
                        required 
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)} 
                        placeholder="••••••••••••"
                        className={`w-full bg-[#F8F9FB] border rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none ${
                          confirmPw && confirmPw !== newPw ? "border-red-300 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#C8A14A]"
                        }`}
                      />
                      {confirmPw && confirmPw !== newPw && (
                        <p className="text-[10px] text-red-600 mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={changingPw}
                    className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#122e54] text-white font-bold text-xs shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {changingPw && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {changingPw ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#C8A14A]" /> Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Add an additional layer of login protection for the administrator portal.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={handleToggle2FA}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    twoFactor ? "bg-[#C8A14A]" : "bg-slate-200"
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    twoFactor ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Active Sessions */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A]">Active Sessions</h4>
                  <p className="text-[11px] text-[#667085]">Devices currently logged into your administrator account.</p>
                </div>
                <div className="bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-[#0B1F3A]">Current Device (Active Browser Session)</p>
                    <p className="text-[10px] text-[#667085] mt-0.5">Admin: {currentAdminName} • Location: Sri Lanka</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => showToast("All other remote sessions logged out.")}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
                  >
                    Log Out All Other Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* 4. APPEARANCE TAB                                                */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "appearance" && (
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Appearance</h3>
                <p className="text-xs text-[#667085]">Customize your workspace look and feel.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#0B1F3A]">Theme Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Light", "Dark (Coming Soon)", "System Default"].map(t => (
                    <button 
                      key={t} 
                      type="button" 
                      onClick={() => { if (t === "Light" || t === "System Default") handleThemeChange(t); }}
                      disabled={t.includes("Coming Soon")}
                      className={`py-3 px-4 rounded-xl border text-xs font-medium transition-all text-center ${
                        theme === t 
                          ? "border-[#C8A14A] bg-[#C8A14A]/10 text-[#0B1F3A] font-bold" 
                          : t.includes("Coming Soon")
                          ? "border-[#E5E7EB] bg-[#F8F9FB] text-[#667085] opacity-50 cursor-not-allowed"
                          : "border-[#E5E7EB] bg-[#F8F9FB] text-[#667085] hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A]">Compact Sidebar Mode</h4>
                  <p className="text-[11px] text-[#667085]">Minimize sidebar to icons only by default.</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleCompact}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    compactSidebar ? "bg-[#C8A14A]" : "bg-slate-200"
                  }`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    compactSidebar ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* 5. DANGER ZONE TAB                                               */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {activeTab === "danger" && (
            <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-serif font-bold text-red-600">Danger Zone</h3>
                <p className="text-xs text-[#667085]">Irreversible and sensitive account actions.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1F3A]">Log Out of Session</h4>
                    <p className="text-[11px] text-[#667085]">Sign out securely from this browser session.</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[#0B1F3A] text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Log Out
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 border border-red-200">
                  <div>
                    <h4 className="text-xs font-bold text-red-600">Delete Account</h4>
                    <p className="text-[11px] text-[#667085]">Permanently remove your legal admin account and data.</p>
                  </div>
                  <button 
                    onClick={() => setDeleteModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] relative space-y-4">
            <button 
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-[#667085] hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Delete Account?</h3>
                <p className="text-xs text-[#667085]">Administrator Protection</p>
              </div>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed">
              Account deletion is protected for administrator accounts to prevent accidental loss of client records and legal cases.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}