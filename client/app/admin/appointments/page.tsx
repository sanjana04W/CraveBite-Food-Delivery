"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar as CalendarIcon, Clock, CheckCircle2, CalendarCheck, CalendarX,
  Plus, Eye, Search, Mail, Phone, X, Trash2, Edit3,
  ChevronLeft, ChevronRight, List, RefreshCcw, Send, Check
} from "lucide-react";

interface AppointmentNote { id: string; content: string; author: string; date: string; }
interface TimelineEntry  { date: string; action: string; }

interface Appointment {
  _id: string;
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateISO: string;
  time: string;
  duration: "30 Minutes" | "45 Minutes" | "60 Minutes";
  consultationType: "Online" | "In Person" | "Phone";
  status: "Upcoming" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled" | "No Show";
  locationOrLink: string;
  originalProblem: string;
  privateNotes: AppointmentNote[];
  timeline: TimelineEntry[];
  createdAt: string;
}

// Helpers
function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function to12h(t24: string) {
  if (!t24 || !t24.includes(":")) return t24;
  const [hStr, mStr] = t24.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${mStr} ${ampm}`;
}
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [calYear, setCalYear]   = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  const [searchTerm, setSearchTerm]     = useState("");
  const [statusFilter, setStatusFilter] = useState("All Appointments");
  const [typeFilter, setTypeFilter]     = useState("All Types");

  const [successToast, setSuccessToast] = useState("");

  // Modals
  const [newApptModal, setNewApptModal]             = useState(false);
  const [confirmModal, setConfirmModal]             = useState(false);
  const [rescheduleModal, setRescheduleModal]       = useState(false);
  const [cancelModal, setCancelModal]               = useState(false);
  const [confirmationEmailModal, setConfirmationEmailModal] = useState(false);
  const [deleteModal, setDeleteModal]               = useState(false);

  // New appointment form
  const [newClientName, setNewClientName]           = useState("");
  const [newClientEmail, setNewClientEmail]         = useState("");
  const [newClientPhone, setNewClientPhone]         = useState("");
  const [newType, setNewType]                       = useState<"Online"|"In Person"|"Phone">("Online");
  const [newDate, setNewDate]                       = useState("");
  const [newTime, setNewTime]                       = useState("10:00");
  const [newDuration, setNewDuration]               = useState<"30 Minutes"|"45 Minutes"|"60 Minutes">("30 Minutes");
  const [newLocationOrLink, setNewLocationOrLink]   = useState("");
  const [newProblem, setNewProblem]                 = useState("");
  const [newPrivateNotes, setNewPrivateNotes]       = useState("");

  // Reschedule form
  const [reschedDate, setReschedDate] = useState("");
  const [reschedTime, setReschedTime] = useState("");

  // Notes
  const [noteInput, setNoteInput]       = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAppointments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
        // sync selected appointment with fresh data
        if (selectedAppointment) {
          const updated = data.data.find((a: Appointment) => a._id === selectedAppointment._id);
          if (updated) setSelectedAppointment(updated);
        }
      }
    } catch (e) { console.error(e); }
    finally { if (!silent) setLoading(false); }
  }, [selectedAppointment]);

  useEffect(() => { fetchAppointments(); }, []); // eslint-disable-line
  useEffect(() => {
    const i = setInterval(() => fetchAppointments(true), 30000);
    return () => clearInterval(i);
  }, [fetchAppointments]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  // ── PATCH helper ──────────────────────────────────────────────────────────
  const patchAppt = async (id: string, body: object) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(a => a._id === id ? data.data : a));
        setSelectedAppointment(data.data);
        return data.data;
      }
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  // ── Status changes ────────────────────────────────────────────────────────
  const handleStatusChange = async (status: string, toast: string) => {
    if (!selectedAppointment) return;
    await patchAppt(selectedAppointment._id, { status });
    showToast(toast);
  };

  // ── Reschedule ────────────────────────────────────────────────────────────
  const handleReschedule = async () => {
    if (!selectedAppointment || !reschedDate || !reschedTime) return;
    await patchAppt(selectedAppointment._id, { action: "reschedule", dateISO: reschedDate, time: to12h(reschedTime) });
    setRescheduleModal(false);
    setReschedDate(""); setReschedTime("");
    showToast("Appointment rescheduled successfully.");
  };

  // ── Create appointment ────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newClientName || !newClientEmail || !newDate || !newTime) {
      showToast("Please fill in all required fields."); return;
    }
    setActionLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: newClientName, clientEmail: newClientEmail, clientPhone: newClientPhone,
          dateISO: newDate, time: to12h(newTime), duration: newDuration,
          consultationType: newType, locationOrLink: newLocationOrLink,
          originalProblem: newProblem, privateNotes: newPrivateNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => [...prev, data.data].sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()));
        setNewApptModal(false);
        setNewClientName(""); setNewClientEmail(""); setNewClientPhone("");
        setNewType("Online"); setNewDate(""); setNewTime("10:00");
        setNewDuration("30 Minutes"); setNewLocationOrLink(""); setNewProblem(""); setNewPrivateNotes("");
        showToast("Appointment created successfully!");
      } else {
        showToast(data.error || "Failed to create appointment.");
      }
    } catch (e) { showToast("Network error."); }
    finally { setActionLoading(false); }
  };

  // ── Private note add ──────────────────────────────────────────────────────
  const handleAddNote = async () => {
    if (!selectedAppointment || !noteInput.trim()) return;
    await patchAppt(selectedAppointment._id, { action: "addNote", note: { content: noteInput, author: "Lawyer" } });
    setNoteInput(""); setShowNoteForm(false);
    showToast("Private note added.");
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedAppointment) return;
    await patchAppt(selectedAppointment._id, { action: "deleteNote", noteId });
    showToast("Note deleted.");
  };

  // ── Delete appointment ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selectedAppointment) return;
    setActionLoading(true);
    try {
      await fetch(`/api/appointments/${selectedAppointment._id}`, { method: "DELETE" });
      setAppointments(prev => prev.filter(a => a._id !== selectedAppointment._id));
      setSelectedAppointment(null);
      setDeleteModal(false);
      showToast("Appointment deleted.");
    } catch (e) { console.error(e); }
    finally { setActionLoading(false); }
  };

  // ── Status badge ──────────────────────────────────────────────────────────
  const getStatusBadge = (status: Appointment["status"]) => {
    const map: Record<string, string> = {
      Upcoming:    "bg-[#C8A14A]/15 text-[#0B1F3A] border border-[#C8A14A]/40",
      Confirmed:   "bg-blue-50 text-blue-700 border border-blue-200",
      Completed:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
      Cancelled:   "bg-slate-100 text-slate-600 border border-slate-200",
      Rescheduled: "bg-orange-50 text-orange-700 border border-orange-200",
      "No Show":   "bg-red-50 text-red-700 border border-red-200",
    };
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${map[status] || ""}`}>{status}</span>;
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = appointments.filter(a => {
    const q = searchTerm.toLowerCase();
    const matchSearch = a.clientName.toLowerCase().includes(q) || a.clientEmail.toLowerCase().includes(q) ||
      a.clientPhone.toLowerCase().includes(q) || a.appointmentId.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All Appointments" || a.status === statusFilter;
    const matchType   = typeFilter === "All Types" || a.consultationType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalAppointments = appointments.length;
  const upcomingCount   = appointments.filter(a => ["Upcoming","Confirmed","Rescheduled"].includes(a.status)).length;
  const completedCount  = appointments.filter(a => a.status === "Completed").length;
  const cancelledCount  = appointments.filter(a => a.status === "Cancelled").length;

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();

  const apptOnDay = (day: number) =>
    filtered.filter(a => {
      const d = new Date(a.dateISO);
      return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === day;
    });

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  // ── Confirmation email mailto link ────────────────────────────────────────
  const sendConfirmationEmail = () => {
    if (!selectedAppointment) return;
    const subject = encodeURIComponent(`Your Legal Consultation Appointment – ${fmtDate(selectedAppointment.dateISO)}`);
    const body = encodeURIComponent(
      `Dear ${selectedAppointment.clientName},\n\nYour consultation has been scheduled successfully.\n\nDate: ${fmtDate(selectedAppointment.dateISO)}\nTime: ${selectedAppointment.time}\nDuration: ${selectedAppointment.duration}\nType: ${selectedAppointment.consultationType} Consultation\nLocation / Link: ${selectedAppointment.locationOrLink}\n\nWe look forward to speaking with you.\n\nBest regards,\nSterling Law`
    );
    window.open(`mailto:${selectedAppointment.clientEmail}?subject=${subject}&body=${body}`);
    setConfirmationEmailModal(false);
    showToast("Email client opened. Please send the email.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">

      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C8A14A]" /><span>{successToast}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <span>Home</span> / <span className="text-[#0B1F3A] font-medium">Appointments</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">Appointments</h1>
          <p className="text-xs text-[#667085] mt-1">Manage and track your scheduled client consultations.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => fetchAppointments()} className="p-2.5 rounded-xl border border-[#E5E7EB] bg-white text-[#667085] hover:bg-slate-50" title="Refresh">
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => setNewApptModal(true)} className="px-4 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        </div>
      </div>

      {/* 2. STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "TOTAL", count: totalAppointments, icon: CalendarIcon },
          { title: "UPCOMING", count: upcomingCount, icon: CalendarCheck },
          { title: "COMPLETED", count: completedCount, icon: CheckCircle2 },
          { title: "CANCELLED", count: cancelledCount, icon: CalendarX },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">{s.title}</span>
                <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mt-1">{s.count}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8A14A]/10 text-[#C8A14A] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#667085]" />
            <input type="text" placeholder="Search by client name, email, phone or ID..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
          </div>
          <div className="flex items-center bg-[#F8F9FB] p-1 rounded-xl border border-[#E5E7EB] self-start lg:self-auto">
            <button onClick={() => setViewMode("calendar")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "calendar" ? "bg-white text-[#0B1F3A] shadow-sm" : "text-[#667085] hover:text-[#0B1F3A]"}`}>
              <CalendarIcon className="w-3.5 h-3.5 text-[#C8A14A]" /> Calendar View
            </button>
            <button onClick={() => setViewMode("list")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-white text-[#0B1F3A] shadow-sm" : "text-[#667085] hover:text-[#0B1F3A]"}`}>
              <List className="w-3.5 h-3.5 text-[#C8A14A]" /> List View
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E7EB]">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]">
            <option>All Appointments</option><option>Upcoming</option><option>Confirmed</option>
            <option>Completed</option><option>Cancelled</option><option>Rescheduled</option><option>No Show</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]">
            <option>All Types</option><option>Online</option><option>In Person</option><option>Phone</option>
          </select>
          <button onClick={() => { setSearchTerm(""); setStatusFilter("All Appointments"); setTypeFilter("All Types"); }}
            className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#667085] hover:bg-slate-50">
            Clear Filters
          </button>
        </div>
      </div>

      {/* 4. CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-serif font-bold text-[#0B1F3A]">{MONTH_NAMES[calMonth]} {calYear}</h2>
              <div className="flex items-center gap-1 border border-[#E5E7EB] rounded-xl p-1 bg-[#F8F9FB]">
                <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white"><ChevronLeft className="w-4 h-4 text-[#667085]" /></button>
                <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white"><ChevronRight className="w-4 h-4 text-[#667085]" /></button>
              </div>
              <button onClick={() => { setCalYear(new Date().getFullYear()); setCalMonth(new Date().getMonth()); }}
                className="text-[10px] font-bold text-[#C8A14A] hover:underline">Today</button>
            </div>
          </div>
          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 bg-[#F8F9FB] border-b border-[#E5E7EB] text-center text-[10px] uppercase font-bold text-[#667085] py-3">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div className="grid grid-cols-7 auto-rows-fr bg-[#E5E7EB] gap-[1px]">
              {/* Empty cells before the first day */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-[#F8F9FB] min-h-[80px]" />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayAppts = apptOnDay(day);
                const isToday = new Date().getFullYear() === calYear && new Date().getMonth() === calMonth && new Date().getDate() === day;
                return (
                  <div key={day} className="bg-white min-h-[80px] p-2 flex flex-col hover:bg-[#F8F9FB]/50 transition-colors">
                    <span className={`text-xs font-bold self-start px-1.5 py-0.5 rounded-full ${isToday ? "bg-[#C8A14A] text-white" : "text-[#0B1F3A]"}`}>{day}</span>
                    <div className="space-y-1 mt-1 flex-1">
                      {dayAppts.map(appt => (
                        <div key={appt._id} onClick={() => setSelectedAppointment(appt)}
                          className={`p-1.5 rounded-lg text-[10px] font-medium cursor-pointer shadow-sm transition-transform hover:scale-[1.02] ${
                            appt.status === "Confirmed"   ? "bg-blue-50 text-blue-800 border border-blue-200" :
                            appt.status === "Completed"   ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                            appt.status === "Cancelled"   ? "bg-slate-100 text-slate-600 border border-slate-200" :
                            appt.status === "Rescheduled" ? "bg-orange-50 text-orange-800 border border-orange-200" :
                            "bg-[#C8A14A]/15 text-[#0B1F3A] border border-[#C8A14A]/40"
                          }`}>
                          <p className="font-bold">{appt.time}</p>
                          <p className="truncate">{appt.clientName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#667085]">Loading appointments...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CalendarIcon className="w-12 h-12 text-[#667085] mx-auto" />
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">No Appointments Scheduled</h3>
              <p className="text-xs text-[#667085]">Create appointments from consultation requests or click below.</p>
              <button onClick={() => setNewApptModal(true)} className="px-4 py-2 rounded-xl bg-[#C8A14A] text-[#0B1F3A] font-bold text-xs">+ Create Appointment</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FB] border-b border-[#E5E7EB] text-[10px] uppercase font-bold text-[#667085] tracking-wider">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Time</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs text-[#0B1F3A]">
                  {filtered.map(appt => (
                    <tr key={appt._id} className="hover:bg-[#F8F9FB]/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#C8A14A]">{appt.appointmentId}</td>
                      <td className="py-4 px-4 font-semibold">{appt.clientName}</td>
                      <td className="py-4 px-4 text-[#667085]">{fmtDate(appt.dateISO)}</td>
                      <td className="py-4 px-4 font-bold">{appt.time}</td>
                      <td className="py-4 px-4">{appt.consultationType}</td>
                      <td className="py-4 px-4">{getStatusBadge(appt.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => setSelectedAppointment(appt)}
                          className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white font-medium hover:bg-slate-50 text-[#0B1F3A] inline-flex items-center gap-1 shadow-sm">
                          <Eye className="w-3.5 h-3.5 text-[#C8A14A]" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-[#E5E7EB] text-xs text-[#667085]">
                Showing {filtered.length} of {appointments.length} appointments
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. UPCOMING WIDGET */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Upcoming Appointments</h3>
          <button onClick={() => setViewMode("list")} className="text-xs font-bold text-[#C8A14A] hover:underline">View All</button>
        </div>
        {appointments.filter(a => ["Upcoming","Confirmed","Rescheduled"].includes(a.status)).length === 0 ? (
          <p className="text-xs text-[#667085] italic">No upcoming appointments.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.filter(a => ["Upcoming","Confirmed","Rescheduled"].includes(a.status)).slice(0, 4).map(appt => (
              <div key={appt._id} className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#C8A14A]">{fmtDate(appt.dateISO)} • {appt.time}</span>
                  <h4 className="font-bold text-sm text-[#0B1F3A]">{appt.clientName}</h4>
                  <p className="text-xs text-[#667085]">{appt.consultationType} · {appt.duration}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(appt.status)}
                  <button onClick={() => setSelectedAppointment(appt)} className="px-3 py-1 rounded-xl bg-white border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 shadow-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. APPOINTMENT DETAIL PANEL */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#F8F9FB] w-full max-w-3xl h-full overflow-y-auto shadow-2xl p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C8A14A]">{selectedAppointment.appointmentId}</span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                <h2 className="text-lg font-serif font-bold text-[#0B1F3A] mt-0.5">Appointment Details</h2>
                <p className="text-[11px] text-[#667085]">Created: {fmtDate(selectedAppointment.createdAt)}</p>
              </div>
              <button onClick={() => { setSelectedAppointment(null); setShowNoteForm(false); }} className="p-2 rounded-xl text-[#667085] hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {["Upcoming","Rescheduled"].includes(selectedAppointment.status) && (
                  <button disabled={actionLoading} onClick={() => setConfirmModal(true)} className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#122e54] text-white font-bold text-xs shadow-sm disabled:opacity-50">
                    Confirm Appointment
                  </button>
                )}
                {selectedAppointment.status === "Confirmed" && (
                  <button disabled={actionLoading} onClick={async () => { await handleStatusChange("Completed","Appointment marked as completed."); }} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm disabled:opacity-50">
                    Mark as Completed
                  </button>
                )}
                {!["Completed","Cancelled","No Show"].includes(selectedAppointment.status) && (
                  <>
                    <button disabled={actionLoading} onClick={() => setRescheduleModal(true)} className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 shadow-sm">Reschedule</button>
                    <button disabled={actionLoading} onClick={() => setCancelModal(true)} className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium shadow-sm">Cancel</button>
                    <button disabled={actionLoading} onClick={async () => { await handleStatusChange("No Show","Marked as No Show."); }} className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50">No Show</button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setConfirmationEmailModal(true)} className="p-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:bg-slate-50" title="Send Email Confirmation"><Send className="w-4 h-4" /></button>
                <button onClick={() => window.open(`mailto:${selectedAppointment.clientEmail}`)} className="p-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:bg-slate-50" title="Email Client"><Mail className="w-4 h-4" /></button>
                <button onClick={() => window.open(`tel:${selectedAppointment.clientPhone}`)} className="p-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:bg-slate-50" title="Call Client"><Phone className="w-4 h-4" /></button>
                <button onClick={() => setDeleteModal(true)} className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100" title="Delete Appointment"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Privacy note */}
            <div className="bg-[#0B1F3A]/5 border border-[#C8A14A]/30 p-3 rounded-xl text-[11px] text-[#0B1F3A] font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8A14A]" />Client appointment information is confidential. Handle all information securely.
            </div>

            {/* Appointment Info */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Appointment Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] text-xs">
                {[
                  { label: "Date", val: fmtDate(selectedAppointment.dateISO) },
                  { label: "Time", val: selectedAppointment.time },
                  { label: "Duration", val: selectedAppointment.duration },
                  { label: "Type", val: selectedAppointment.consultationType },
                ].map(f => (
                  <div key={f.label}>
                    <span className="text-[10px] uppercase font-bold text-[#667085]">{f.label}</span>
                    <p className="font-semibold text-[#0B1F3A] mt-0.5">{f.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#F8F9FB] p-3 rounded-xl border border-[#E5E7EB] text-xs">
                <span className="text-[10px] uppercase font-bold text-[#667085] block">Location / Meeting Link</span>
                <p className="font-semibold text-[#0B1F3A] mt-0.5">{selectedAppointment.locationOrLink || "—"}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Client Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB]">
                {[
                  { label: "Full Name", val: selectedAppointment.clientName },
                  { label: "Email Address", val: selectedAppointment.clientEmail },
                  { label: "Phone Number", val: selectedAppointment.clientPhone || "—" },
                ].map(f => (
                  <div key={f.label}>
                    <span className="text-[10px] uppercase font-bold text-[#667085]">{f.label}</span>
                    <p className="font-semibold text-[#0B1F3A] mt-0.5">{f.val}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => window.open(`mailto:${selectedAppointment.clientEmail}`)} className="px-3.5 py-2 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C8A14A]" /> Email Client
                </button>
                <button onClick={() => window.open(`tel:${selectedAppointment.clientPhone}`)} className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 shadow-sm inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C8A14A]" /> Call Client
                </button>
              </div>
            </div>

            {/* Original Problem */}
            {selectedAppointment.originalProblem && (
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Original Consultation Request</h3>
                <div className="text-xs text-[#0B1F3A] bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] leading-relaxed">
                  &quot;{selectedAppointment.originalProblem}&quot;
                </div>
              </div>
            )}

            {/* Private Notes */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Private Appointment Notes</h3>
                <button onClick={() => setShowNoteForm(!showNoteForm)} className="text-xs font-bold text-[#C8A14A] hover:underline">
                  {showNoteForm ? "Cancel" : "+ Add Note"}
                </button>
              </div>
              {showNoteForm && (
                <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-3 text-xs">
                  <textarea rows={2} placeholder="Enter private appointment note..." value={noteInput} onChange={e => setNoteInput(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-[#0B1F3A]" />
                  <button disabled={actionLoading} onClick={handleAddNote} className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs disabled:opacity-50">Save Note</button>
                </div>
              )}
              {selectedAppointment.privateNotes.length === 0 ? (
                <p className="text-xs text-[#667085] italic">No private notes added.</p>
              ) : (
                <div className="space-y-3">
                  {selectedAppointment.privateNotes.map(note => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1">
                      <p className="text-[#0B1F3A] font-medium">{note.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#667085]">
                        <span>By {note.author} on {note.date}</span>
                        <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Appointment Timeline</h3>
              <div className="border-l-2 border-[#C8A14A] pl-4 space-y-3 py-1">
                {selectedAppointment.timeline.map((t, idx) => (
                  <div key={idx} className="relative text-xs">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C8A14A] ring-4 ring-white" />
                    <p className="font-bold text-[#0B1F3A]">{t.action}</p>
                    <p className="text-[10px] text-[#667085]">{t.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Appointment */}
      {newApptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Create New Appointment</h3>
              <button onClick={() => setNewApptModal(false)}><X className="w-4 h-4 text-[#667085]" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Client Name" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
                </div>
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" placeholder="client@example.com" value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Phone Number</label>
                  <input type="text" placeholder="+94 XX XXX XXXX" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
                </div>
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Consultation Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value as any)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]">
                    <option>Online</option><option>In Person</option><option>Phone</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Date <span className="text-red-500">*</span></label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
                </div>
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Time <span className="text-red-500">*</span></label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Duration</label>
                  <select value={newDuration} onChange={e => setNewDuration(e.target.value as any)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]">
                    <option>30 Minutes</option><option>45 Minutes</option><option>60 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#0B1F3A] block mb-1">Location / Meeting Link</label>
                  <input type="text" placeholder="https://zoom.us/j/..." value={newLocationOrLink} onChange={e => setNewLocationOrLink(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
                </div>
              </div>
              <div>
                <label className="font-bold text-[#0B1F3A] block mb-1">Client&apos;s Legal Matter</label>
                <textarea rows={2} placeholder="Brief description of the client's legal matter..." value={newProblem} onChange={e => setNewProblem(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-3 focus:outline-none focus:border-[#C8A14A]" />
              </div>
              <div>
                <label className="font-bold text-[#0B1F3A] block mb-1">Private Notes (Lawyer Only)</label>
                <textarea rows={2} placeholder="Private notes for your reference..." value={newPrivateNotes} onChange={e => setNewPrivateNotes(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-3 focus:outline-none focus:border-[#C8A14A]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setNewApptModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50">Cancel</button>
              <button disabled={actionLoading} onClick={handleCreate} className="px-4 py-2.5 rounded-xl bg-[#C8A14A] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-50">
                {actionLoading ? "Creating..." : "Create Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirm */}
      {confirmModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Confirm Appointment?</h3>
            <p className="text-xs text-[#667085]">This will confirm the appointment for <strong>{selectedAppointment.clientName}</strong> on {fmtDate(selectedAppointment.dateISO)} at {selectedAppointment.time}.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setConfirmModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A]">Cancel</button>
              <button disabled={actionLoading} onClick={async () => { await handleStatusChange("Confirmed","Appointment confirmed successfully."); setConfirmModal(false); }} className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs shadow-sm disabled:opacity-50">
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reschedule */}
      {rescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Reschedule Appointment</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0B1F3A] block mb-1">New Date</label>
                <input type="date" value={reschedDate} onChange={e => setReschedDate(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
              </div>
              <div>
                <label className="font-bold text-[#0B1F3A] block mb-1">New Time</label>
                <input type="time" value={reschedTime} onChange={e => setReschedTime(e.target.value)} className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C8A14A]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setRescheduleModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A]">Cancel</button>
              <button disabled={actionLoading} onClick={handleReschedule} className="px-4 py-2.5 rounded-xl bg-[#C8A14A] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-50">
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cancel */}
      {cancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <h3 className="text-base font-serif font-bold text-red-600">Cancel Appointment?</h3>
            <p className="text-xs text-[#667085]">Are you sure you want to cancel the appointment for <strong>{selectedAppointment.clientName}</strong>?</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setCancelModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A]">Keep Appointment</button>
              <button disabled={actionLoading} onClick={async () => { await handleStatusChange("Cancelled","Appointment has been cancelled."); setCancelModal(false); }} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm disabled:opacity-50">
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirmation Email */}
      {confirmationEmailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Send Appointment Confirmation</h3>
            <div className="bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] text-xs space-y-2">
              <p className="font-bold text-[#0B1F3A]">Your Legal Consultation Has Been Scheduled</p>
              <p className="text-[#667085]">Dear {selectedAppointment.clientName},</p>
              <p className="text-[#667085]">Your consultation has been scheduled successfully.</p>
              <div className="py-1 space-y-0.5">
                <p><strong>Date:</strong> {fmtDate(selectedAppointment.dateISO)}</p>
                <p><strong>Time:</strong> {selectedAppointment.time}</p>
                <p><strong>Type:</strong> {selectedAppointment.consultationType}</p>
                <p><strong>Location / Link:</strong> {selectedAppointment.locationOrLink || "TBD"}</p>
              </div>
              <p className="text-[#667085]">We look forward to speaking with you.</p>
            </div>
            <p className="text-[10px] text-[#667085] italic">Clicking &quot;Send&quot; will open your email client with this message pre-filled.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setConfirmationEmailModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A]">Cancel</button>
              <button onClick={sendConfirmationEmail} className="px-4 py-2.5 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs shadow-sm">
                Send Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete */}
      {deleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <h3 className="text-base font-serif font-bold text-red-600">Delete Appointment?</h3>
            <p className="text-xs text-[#667085]">Are you sure you want to permanently delete the appointment for <strong>{selectedAppointment.clientName}</strong>? This cannot be undone.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setDeleteModal(false)} className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A]">Cancel</button>
              <button disabled={actionLoading} onClick={handleDelete} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm disabled:opacity-50">
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}