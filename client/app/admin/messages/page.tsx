"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail, MessageSquare, Clock, Calendar, Search, RefreshCw,
  Send, Archive, Trash2, CheckCircle2, Shield, ArrowLeft, ExternalLink
} from "lucide-react";
import { Message } from "./types";
import ConvertConsultationModal from "./components/ConvertConsultationModal";
import DeleteMessageModal from "./components/DeleteMessageModal";

// Helper: format date from ISO string
function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function fmtTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Messages");
  const [practiceFilter, setPracticeFilter] = useState("All Practice Areas");

  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedMessage = messages.find((m) => m._id === selectedId) || null;

  // ─── Fetch all messages from API ───────────────────────────────────────────
  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoadingList(true);
    try {
      const res = await fetch("/api/contact-messages");
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoadingList(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Live polling every 30 seconds (silent refresh)
  useEffect(() => {
    const interval = setInterval(() => fetchMessages(true), 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // ─── PATCH helper ──────────────────────────────────────────────────────────
  const patchMessage = async (id: string, body: object) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        // Merge updated message into state
        setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, ...data.data } : m)));
        return data.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Select message + auto-mark as Read ────────────────────────────────────
  const handleSelectMessage = async (id: string) => {
    setSelectedId(id);
    setReplying(false);
    const msg = messages.find((m) => m._id === id);
    if (msg && msg.status === "Unread") {
      await patchMessage(id, { status: "Read" });
    }
  };

  // ─── Mark all as read ──────────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    const unread = messages.filter((m) => m.status === "Unread");
    await Promise.all(unread.map((m) => patchMessage(m._id, { status: "Read" })));
    showToast("All messages marked as read");
  };

  // ─── Toggle Unread/Read ────────────────────────────────────────────────────
  const handleToggleUnread = async () => {
    if (!selectedMessage) return;
    const newStatus = selectedMessage.status === "Unread" ? "Read" : "Unread";
    await patchMessage(selectedMessage._id, { status: newStatus });
    showToast(`Message marked as ${newStatus.toLowerCase()}`);
  };

  // ─── Archive ───────────────────────────────────────────────────────────────
  const handleArchive = async () => {
    if (!selectedMessage) return;
    await patchMessage(selectedMessage._id, { status: "Archived" });
    showToast("Message archived successfully");
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    try {
      await fetch(`/api/contact-messages/${selectedMessage._id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id));
      setDeleteModalOpen(false);
      setSelectedId(null);
      showToast("Message permanently deleted");
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Send Reply ────────────────────────────────────────────────────────────
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;
    const updated = await patchMessage(selectedMessage._id, {
      action: "addReply",
      reply: { senderName: "Admin Attorney", content: replyText },
    });
    if (updated) {
      setReplyText("");
      setReplying(false);
      showToast("Reply saved. Use the email link to send it to the client.");
    }
  };

  // ─── Add Internal Note ─────────────────────────────────────────────────────
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !newNoteText.trim()) return;
    await patchMessage(selectedMessage._id, {
      action: "addNote",
      note: { content: newNoteText, createdBy: "Admin Attorney" },
    });
    setNewNoteText("");
    showToast("Internal note added");
  };

  // ─── Delete Internal Note ──────────────────────────────────────────────────
  const handleDeleteNote = async (noteId: string) => {
    if (!selectedMessage) return;
    await patchMessage(selectedMessage._id, { action: "deleteNote", noteId });
  };

  // ─── Filter ────────────────────────────────────────────────────────────────
  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All Messages" || m.status === statusFilter;
    const matchesPractice = practiceFilter === "All Practice Areas" || m.practiceArea === practiceFilter;
    return matchesSearch && matchesStatus && matchesPractice;
  });

  const unreadCount = messages.filter((m) => m.status === "Unread").length;
  const requiresResponseCount = messages.filter((m) => m.status === "Unread" || m.status === "Read").length;
  const thisMonthCount = messages.filter((m) => {
    if (!m.submittedAt && !m.createdAt) return false;
    const d = new Date((m.submittedAt || m.createdAt) as string);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">

      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#C8A14A]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <span>Home</span> / <span className="text-[#0B1F3A] font-medium">Messages</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">Messages</h1>
          <p className="text-xs text-[#667085] mt-1">
            Manage and respond to inquiries received from visitors and potential clients. Auto-refreshes every 30 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMessages()}
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-[#667085] hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${loadingList ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#0B1F3A] text-xs font-medium shadow-sm transition-all"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* 2. Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Total Messages</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{messages.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center text-[#0B1F3A]">
            <Mail className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Unread</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{unreadCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 relative">
            <Mail className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">Requires Response</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{requiresResponseCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C8A14A]/10 flex items-center justify-center text-[#C8A14A]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#667085]">This Month</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{thisMonthCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search + Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search messages by name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-[#C8A14A]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]">
            <option>All Messages</option>
            <option>Unread</option>
            <option>Read</option>
            <option>Replied</option>
            <option>Archived</option>
          </select>
          <select value={practiceFilter} onChange={(e) => setPracticeFilter(e.target.value)} className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]">
            <option>All Practice Areas</option>
            <option>Property Law</option>
            <option>Family Law</option>
            <option>Civil Law</option>
            <option>Criminal Law</option>
            <option>Labour Law</option>
            <option>Corporate Law</option>
          </select>
          <button
            onClick={() => { setSearchQuery(""); setStatusFilter("All Messages"); setPracticeFilter("All Practice Areas"); }}
            className="p-2 rounded-xl bg-[#F8F9FB] hover:bg-slate-100 text-[#667085] border border-[#E5E7EB] transition-colors"
            title="Clear Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Two-Panel Inbox */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

        {/* LEFT PANEL — Message List */}
        <div className={`lg:col-span-5 border-r border-[#E5E7EB] flex flex-col ${selectedId ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8F9FB]/50">
            <h3 className="font-serif font-bold text-sm text-[#0B1F3A]">Inbox</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {unreadCount} Unread
            </span>
          </div>

          <div className="divide-y divide-[#E5E7EB] overflow-y-auto max-h-[650px] flex-1">
            {loadingList ? (
              <div className="p-8 text-center text-xs text-[#667085]">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#667085] flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#0B1F3A]">No Messages Yet</h4>
                <p className="text-xs text-[#667085]">Messages submitted through the contact form will appear here automatically.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedId === msg._id;
                const isUnread = msg.status === "Unread";
                const dateStr = fmtDate(msg.submittedAt || msg.createdAt || "");
                return (
                  <div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg._id)}
                    className={`p-4 cursor-pointer transition-colors relative ${
                      isSelected
                        ? "bg-[#C8A14A]/10 border-l-4 border-l-[#C8A14A]"
                        : isUnread
                        ? "bg-slate-50/80 hover:bg-slate-100/60"
                        : "hover:bg-[#F8F9FB]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {isUnread && <span className="w-2 h-2 rounded-full bg-[#C8A14A] shrink-0" />}
                        <h4 className={`text-xs ${isUnread ? "font-bold text-[#0B1F3A]" : "font-semibold text-[#0B1F3A]"}`}>{msg.name}</h4>
                      </div>
                      <span className="text-[10px] text-[#667085] shrink-0">{dateStr}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#667085] mb-1.5">
                      <span className="truncate">{msg.email}</span>
                      {msg.practiceArea && (
                        <span className="px-1.5 py-0.5 rounded bg-[#F8F9FB] border border-[#E5E7EB] font-medium ml-2">{msg.practiceArea}</span>
                      )}
                    </div>
                    <p className={`text-xs mb-1 truncate ${isUnread ? "font-bold text-[#0B1F3A]" : "text-[#0B1F3A]"}`}>{msg.subject}</p>
                    <p className="text-[11px] text-[#667085] line-clamp-1">{msg.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        msg.status === "Unread" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        msg.status === "Replied" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        msg.status === "Archived" ? "bg-slate-100 text-slate-600" : "bg-slate-100 text-[#667085]"
                      }`}>
                        {msg.status}
                      </span>
                      {msg.isConsultationCreated && <span className="text-[9px] text-[#C8A14A] font-bold">Consultation Created</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Message Detail */}
        <div className={`lg:col-span-7 flex flex-col bg-white ${!selectedId ? "hidden lg:flex items-center justify-center p-12 text-center" : "flex"}`}>
          {!selectedMessage ? (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#667085] flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#0B1F3A]">Select a message</h4>
              <p className="text-xs text-[#667085]">Choose an inquiry from the inbox list to read full details and respond.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">

              {/* Action Toolbar */}
              <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8F9FB]/50">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedId(null)} className="lg:hidden p-1.5 rounded-lg border border-[#E5E7EB] text-[#667085] hover:bg-slate-100">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-[#0B1F3A]">Message Details</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setReplying(true)}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" /> Reply
                  </button>
                  {/* mailto link for direct email */}
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Your Inquiry")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#667085] transition-colors"
                    title="Open in Email Client"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleToggleUnread}
                    disabled={actionLoading}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#667085] transition-colors"
                    title="Toggle Read/Unread"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleArchive}
                    disabled={actionLoading}
                    className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#667085] transition-colors"
                    title="Archive Message"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    disabled={actionLoading}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Detail Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[600px] flex-1">

                {/* Sender Info Grid */}
                <div className="bg-[#F8F9FB] p-4 rounded-2xl border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#667085] uppercase font-bold">Full Name</span>
                    <p className="font-bold text-[#0B1F3A]">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085] uppercase font-bold">Email Address</span>
                    <p className="font-bold text-[#0B1F3A] break-all">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085] uppercase font-bold">Phone Number</span>
                    <p className="font-bold text-[#0B1F3A]">{selectedMessage.phone || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085] uppercase font-bold">Practice Area</span>
                    <p className="font-bold text-[#0B1F3A]">{selectedMessage.practiceArea || "—"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-[#667085] uppercase font-bold">Subject</span>
                    <p className="font-bold text-[#0B1F3A] text-sm">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#667085] uppercase font-bold">Received</span>
                    <p className="font-medium text-[#0B1F3A]">
                      {fmtDate(selectedMessage.submittedAt || selectedMessage.createdAt || "")} at {fmtTime(selectedMessage.submittedAt || selectedMessage.createdAt || "")}
                    </p>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">Conversation History</h4>
                  {selectedMessage.thread.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 ${
                        item.senderRole === "lawyer"
                          ? "bg-[#0B1F3A]/5 border-[#0B1F3A]/10 ml-6"
                          : "bg-white border-[#E5E7EB] mr-6"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B1F3A]">{item.senderName} ({item.senderRole === "lawyer" ? "Lawyer" : "Client"})</span>
                        <span className="text-[10px] text-[#667085]">{item.timestamp}</span>
                      </div>
                      <p className="text-[#0B1F3A] whitespace-pre-wrap leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Composer */}
                {replying && (
                  <form onSubmit={handleSendReply} className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1F3A]">Reply to {selectedMessage.email}</span>
                      <button type="button" onClick={() => setReplying(false)} className="text-xs text-[#667085] hover:text-[#0B1F3A]">Cancel</button>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your formal legal response here..."
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-[#C8A14A]"
                    />
                    <p className="text-[10px] text-[#667085] italic">
                      💡 Click the <ExternalLink className="w-3 h-3 inline" /> icon above to open the client&apos;s email in your mail client and send this reply directly.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setReplying(false)} className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] bg-white hover:bg-slate-100">Cancel</button>
                      <button type="submit" disabled={actionLoading} className="px-4 py-1.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-50">
                        Save Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Internal Notes */}
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-3">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#0B1F3A]">Internal Notes</h4>
                    <p className="text-[10px] text-[#667085]">Only visible to authorized firm administrators.</p>
                  </div>
                  {selectedMessage.notes.length > 0 && (
                    <div className="space-y-2">
                      {selectedMessage.notes.map((note) => (
                        <div key={note.id} className="bg-white p-3 rounded-xl border border-amber-200 text-xs flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[#0B1F3A]">{note.content}</p>
                            <span className="text-[9px] text-[#667085] mt-1 block">Added by {note.createdBy} on {note.date}</span>
                          </div>
                          <button type="button" onClick={() => handleDeleteNote(note.id)} className="text-[#667085] hover:text-red-600 text-[10px]">Delete</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add an internal note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-[#C8A14A]"
                    />
                    <button type="submit" disabled={actionLoading} className="px-3 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122e54] text-white text-xs font-bold transition-all shrink-0 disabled:opacity-50">
                      + Add Note
                    </button>
                  </form>
                </div>

                {/* Convert to Consultation */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8F9FB] p-4 rounded-2xl border border-[#E5E7EB]">
                  <div>
                    <h5 className="text-xs font-bold text-[#0B1F3A]">Convert to Consultation</h5>
                    <p className="text-[10px] text-[#667085]">Schedule an official appointment session for this inquiry.</p>
                  </div>
                  <button
                    onClick={() => setConsultationModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122e54] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    {selectedMessage.isConsultationCreated ? "Consultation Created ✓" : "Create Consultation"}
                  </button>
                </div>

                {/* Privacy Banner */}
                <div className="flex items-center gap-2 text-[10px] text-[#667085] italic pt-2 border-t border-[#E5E7EB]">
                  <Shield className="w-3.5 h-3.5 text-[#C8A14A] shrink-0" />
                  <span>Client communications are confidential. Handle all information securely.</span>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConvertConsultationModal
        isOpen={consultationModalOpen}
        message={selectedMessage}
        onClose={() => setConsultationModalOpen(false)}
        onSuccess={() => {
          if (selectedMessage) {
            setMessages((prev) => prev.map((m) => m._id === selectedMessage._id ? { ...m, isConsultationCreated: true } : m));
          }
          showToast("Consultation request created successfully.");
        }}
      />
      <DeleteMessageModal
        isOpen={deleteModalOpen}
        messageSubject={selectedMessage?.subject || null}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}