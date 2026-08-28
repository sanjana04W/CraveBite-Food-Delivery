"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  UserPlus,
  FileText,
  MessageSquare,
  Briefcase,
  Check,
  Trash2,
  MoreVertical,
  ShieldAlert,
  Filter,
  CheckCheck,
  RefreshCw,
  X,
} from "lucide-react";

interface NotificationItem {
  _id: string;
  type: "Consultation" | "Appointment" | "Client" | "Message" | "Document" | "Case" | "System";
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  link: string;
}

// Friendly relative timestamp
function timeAgo(iso: string): string {
  if (!iso) return "";
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const ITEMS_PER_PAGE = 10;

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  // ── Fetch notifications from API ───────────────────────────────────────────
  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Live polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchNotifications(true), 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Mark single as read on click ──────────────────────────────────────────
  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (isRead) return; // Already read
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (e) { console.error(e); }
  };

  // ── Toggle read/unread from 3-dot menu ────────────────────────────────────
  const toggleReadStatus = async (id: string, currentRead: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: !currentRead } : n));
        showToast(currentRead ? "Marked as unread" : "Marked as read");
      }
    } catch (e) { console.error(e); }
  };

  // ── Delete single notification ────────────────────────────────────────────
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setActionLoading(true);
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        showToast("Notification deleted");
      }
    } catch (e) { console.error(e); } finally {
      setActionLoading(false);
    }
  };

  // ── Mark ALL as read ──────────────────────────────────────────────────────
  const markAllAsRead = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast("All notifications marked as read");
      }
    } catch (e) { console.error(e); } finally {
      setActionLoading(false);
    }
  };

  // ── Clear all notifications ───────────────────────────────────────────────
  const clearAll = async () => {
    if (!window.confirm("Delete all notifications? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      if (res.ok) {
        setNotifications([]);
        showToast("All notifications cleared");
      }
    } catch (e) { console.error(e); } finally {
      setActionLoading(false);
    }
  };

  // ── Filter & paginate ─────────────────────────────────────────────────────
  const filtered = notifications.filter(item => {
    if (activeTab === "Unread" && item.read) return false;
    if (typeFilter !== "All") {
      const map: Record<string, string> = {
        "Consultation Requests": "Consultation",
        "Appointments": "Appointment",
        "Clients": "Client",
        "Messages": "Message",
        "Documents": "Document",
        "Cases": "Case",
        "System": "System",
      };
      if (item.type !== map[typeFilter]) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "Consultation": return <Bell className="w-5 h-5 text-[#C8A14A]" />;
      case "Appointment":  return <Calendar className="w-5 h-5 text-[#0B1F3A]" />;
      case "Client":       return <UserPlus className="w-5 h-5 text-[#03543F]" />;
      case "Document":     return <FileText className="w-5 h-5 text-[#1E429F]" />;
      case "Message":      return <MessageSquare className="w-5 h-5 text-[#92400E]" />;
      case "Case":         return <Briefcase className="w-5 h-5 text-[#C8A14A]" />;
      default:             return <Bell className="w-5 h-5 text-[#667085]" />;
    }
  };

  // Close menu when clicking outside
  const handlePageClick = () => { if (openMenuId) setOpenMenuId(null); };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B1F3A] p-6 lg:p-8" onClick={handlePageClick}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-[#C8A14A]" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-medium text-[#667085] mb-1">Home / Notifications</div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0B1F3A]">Notifications</h1>
          <p className="text-sm text-[#667085] mt-1">
            Stay updated with activities across your legal practice. Auto-refreshes every 30 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => fetchNotifications()}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F4F6] text-[#0B1F3A] border border-[#E5E7EB] font-semibold px-3 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 text-[#667085] ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={markAllAsRead}
            disabled={actionLoading || unreadCount === 0}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F4F6] text-[#0B1F3A] border border-[#E5E7EB] font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 text-[#C8A14A]" />
            Mark All as Read
          </button>
          <button
            onClick={clearAll}
            disabled={actionLoading || notifications.length === 0}
            className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-[#E5E7EB] font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* 2. TABS + FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab("All"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "All" ? "bg-[#0B1F3A] text-white" : "bg-[#F8F9FB] text-[#667085] hover:text-[#0B1F3A]"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => { setActiveTab("Unread"); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "Unread" ? "bg-[#0B1F3A] text-white" : "bg-[#F8F9FB] text-[#667085] hover:text-[#0B1F3A]"
            }`}
          >
            Unread
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "Unread" ? "bg-[#C8A14A] text-[#0B1F3A]" : "bg-[#FEF3C7] text-[#92400E]"}`}>
              {unreadCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#667085]" />
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C8A14A] w-full sm:w-auto"
          >
            <option>All</option>
            <option>Consultation Requests</option>
            <option>Appointments</option>
            <option>Clients</option>
            <option>Messages</option>
            <option>Documents</option>
            <option>Cases</option>
            <option>System</option>
          </select>
        </div>
      </div>

      {/* 3. NOTIFICATION LIST */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden mb-6">
        {loading ? (
          <div className="py-16 px-6 text-center text-sm text-[#667085]">Loading notifications...</div>
        ) : paginated.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-16 h-16 bg-[#F8F9FB] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-4 text-[#667085]">
              <Bell className="w-8 h-8 text-[#C8A14A]" />
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A] mb-1">No Notifications</h3>
            <p className="text-sm text-[#667085]">You are all caught up. New updates will appear here automatically.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {paginated.map((item) => (
              <div key={item._id} className="relative">
                <Link
                  href={item.link}
                  onClick={() => handleNotificationClick(item._id, item.read)}
                  className={`flex items-start justify-between p-4 sm:p-5 transition-colors block pr-14 ${
                    !item.read ? "bg-[#FEFCE8]/60 hover:bg-[#FEFCE8]" : "bg-white hover:bg-[#F8F9FB]"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className="w-10 h-10 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center">
                        {getIcon(item.type)}
                      </div>
                      {!item.read && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C8A14A] rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm ${!item.read ? "font-bold text-[#0B1F3A]" : "font-semibold text-[#0B1F3A]"}`}>
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#667085] mt-0.5 leading-snug">{item.description}</p>
                      <span className="text-xs text-[#667085] mt-2 inline-block font-medium">
                        {timeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Three-dot menu — outside the Link so it doesn't navigate */}
                <div className="absolute right-4 top-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item._id ? null : item._id);
                    }}
                    className="p-1.5 rounded-lg text-[#667085] hover:text-[#0B1F3A] hover:bg-[#F3F4F6] transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openMenuId === item._id && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-20 text-xs">
                      <button
                        onClick={(e) => toggleReadStatus(item._id, item.read, e)}
                        className="w-full text-left px-4 py-2 text-[#0B1F3A] hover:bg-[#F8F9FB] flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-[#C8A14A]" />
                        {item.read ? "Mark as Unread" : "Mark as Read"}
                      </button>
                      <button
                        onClick={(e) => deleteNotification(item._id, e)}
                        className="w-full text-left px-4 py-2 text-[#9B1C1C] hover:bg-[#FDE8E8] flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. PAGINATION */}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
          <p className="text-xs text-[#667085]">
            Showing <span className="font-semibold text-[#0B1F3A]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-[#0B1F3A]">{filtered.length}</span> notifications
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#667085] bg-[#F8F9FB] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                  page === currentPage
                    ? "border-[#C8A14A] bg-[#C8A14A] text-[#0B1F3A]"
                    : "border-[#E5E7EB] hover:bg-[#F8F9FB] text-[#0B1F3A]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#0B1F3A] hover:bg-[#F8F9FB] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* SECURITY FOOTER */}
      <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex items-center justify-center text-center text-xs text-[#667085]">
        <ShieldAlert className="w-4 h-4 mr-1.5 text-[#C8A14A]" />
        Notification items contain confidential activity logs. Handle platform data securely.
      </div>
    </div>
  );
}