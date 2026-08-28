"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clipboard, Calendar, Phone, MessageSquare, Search,
  RefreshCcw, Eye, X, Trash2, Archive, CheckCircle2,
  UserPlus, AlertCircle, Clock, Mail, ChevronRight
} from "lucide-react";

interface ConsultationRequest {
  _id: string;
  requestId: string;
  fullName: string;
  email: string;
  phone: string;
  practiceArea: string;
  description: string;
  status: "New" | "Viewed" | "Contacted";
  submittedDate: string;
}

export default function AdminConsultationsPage() {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Requests");
  const [sortOption, setSortOption] = useState("Newest First");

  const [successToast, setSuccessToast] = useState("");
  const [contactedConfirmModal, setContactedConfirmModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [createClientModal, setCreateClientModal] = useState(false);

  const [contactNoteMethod, setContactNoteMethod] = useState<"Phone" | "Email" | "WhatsApp" | "In Person" | "Other">("Phone");
  const [contactNoteText, setContactNoteText] = useState("");
  const [showContactNoteForm, setShowContactNoteForm] = useState(false);
  const [localContactHistory, setLocalContactHistory] = useState<{id: string; method: string; note: string; date: string}[]>([]);

  const [internalNoteText, setInternalNoteText] = useState("");
  const [showInternalNoteForm, setShowInternalNoteForm] = useState(false);
  const [localInternalNotes, setLocalInternalNotes] = useState<{id: string; content: string; author: string; date: string}[]>([]);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/consultations");
      const data = await res.json();
      if (data.success) setRequests(data.consultations);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // Patch status helper
  const patchStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: status as any } : r));
        if (selectedRequest?._id === id) setSelectedRequest((prev) => prev ? { ...prev, status: status as any } : null);
      }
    } catch (e) { console.error(e); }
    finally { setUpdatingStatus(false); }
  };

  // Open request — auto-mark as Viewed if New
  const handleOpenRequest = async (req: ConsultationRequest) => {
    setSelectedRequest(req);
    setLocalContactHistory([]);
    setLocalInternalNotes([]);
    setShowContactNoteForm(false);
    setShowInternalNoteForm(false);
    if (req.status === "New") {
      await patchStatus(req._id, "Viewed");
      showToast("Consultation request marked as viewed.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/consultations/${selectedRequest._id}`, { method: "DELETE" });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== selectedRequest._id));
        setDeleteConfirmModal(false);
        setSelectedRequest(null);
        showToast("Consultation request deleted successfully.");
      }
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const getStatusBadge = (status: ConsultationRequest["status"]) => {
    switch (status) {
      case "New":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C8A14A]/15 text-[#0B1F3A] border border-[#C8A14A]/40">New</span>;
      case "Viewed":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Viewed</span>;
      case "Contacted":
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Contacted</span>;
    }
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };
  const formatTime = (d: string) => {
    if (!d) return "";
    return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Requests" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === "Newest First") return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
  });

  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === "New").length;
  const contactedCount = requests.filter((r) => r.status === "Contacted").length;
  const thisMonthCount = requests.filter((r) => {
    const d = new Date(r.submittedDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">

      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#C8A14A]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-1">
            <span>Home</span> / <span className="text-[#0B1F3A] font-medium">Consultation Requests</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#0B1F3A]">Consultation Requests</h1>
          <p className="text-xs text-[#667085] mt-1">Manage consultation requests submitted by visitors through the website.</p>
        </div>
        <button
          onClick={fetchRequests}
          className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#667085] hover:bg-slate-50 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-[#C8A14A]" /> Refresh
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "TOTAL REQUESTS", count: totalCount, icon: Clipboard },
          { title: "NEW REQUESTS", count: newCount, icon: Mail },
          { title: "CONTACTED", count: contactedCount, icon: Phone },
          { title: "THIS MONTH", count: thisMonthCount, icon: Calendar },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider">{stat.title}</span>
                <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mt-1">{stat.count}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#C8A14A]/10 text-[#C8A14A] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#667085]" />
            <input
              type="text"
              placeholder="Search by name, email, phone number, or request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            >
              <option>All Requests</option>
              <option>New</option>
              <option>Viewed</option>
              <option>Contacted</option>
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
            <button
              onClick={() => { setSearchTerm(""); setStatusFilter("All Requests"); setSortOption("Newest First"); }}
              className="px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#667085] hover:bg-slate-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* REQUEST LIST */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#667085]">Loading consultation requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#667085]">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">No Consultation Requests Yet</h3>
            <p className="text-xs text-[#667085] max-w-sm mx-auto">
              When visitors submit a consultation request through the website, their requests will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F9FB] border-b border-[#E5E7EB] text-[10px] uppercase font-bold text-[#667085] tracking-wider">
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Client Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Practice Area</th>
                    <th className="py-3.5 px-4 w-1/4">Description</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs text-[#0B1F3A]">
                  {filteredRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-[#F8F9FB]/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#C8A14A]">{req.requestId}</td>
                      <td className="py-4 px-4 font-semibold">{req.fullName}</td>
                      <td className="py-4 px-4 text-[#667085]">{req.email}</td>
                      <td className="py-4 px-4 text-[#667085]">{req.phone}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded-full bg-[#0B1F3A]/5 text-[10px] font-semibold text-[#0B1F3A]">
                          {req.practiceArea}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#667085]">
                        {req.description.length > 60 ? req.description.substring(0, 60) + "..." : req.description}
                        <button onClick={() => handleOpenRequest(req)} className="ml-1 text-[#C8A14A] font-medium hover:underline inline-block">
                          Read more...
                        </button>
                      </td>
                      <td className="py-4 px-4 text-[#667085]">{formatDate(req.submittedDate)}</td>
                      <td className="py-4 px-4">{getStatusBadge(req.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenRequest(req)}
                          className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white font-medium hover:bg-slate-50 text-[#0B1F3A] inline-flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C8A14A]" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-[#E5E7EB]">
              {filteredRequests.map((req) => (
                <div key={req._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#C8A14A]">{req.requestId}</span>
                    {getStatusBadge(req.status)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0B1F3A]">{req.fullName}</h4>
                    <p className="text-xs text-[#667085]">{req.email} • {req.phone}</p>
                    <p className="text-xs text-[#C8A14A] font-semibold">{req.practiceArea}</p>
                  </div>
                  <p className="text-xs text-[#667085] bg-[#F8F9FB] p-2.5 rounded-xl border border-[#E5E7EB]">
                    &quot;{req.description}&quot;
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#667085]">
                    <span>Submitted: {formatDate(req.submittedDate)}</span>
                    <button
                      onClick={() => handleOpenRequest(req)}
                      className="px-3 py-1.5 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#667085]">
          <span>Showing {filteredRequests.length} of {requests.length} requests</span>
        </div>
      </div>

      {/* DETAIL SIDE PANEL */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm">
          <div className="bg-[#F8F9FB] w-full max-w-3xl h-full overflow-y-auto shadow-2xl p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C8A14A]">{selectedRequest.requestId}</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <h2 className="text-lg font-serif font-bold text-[#0B1F3A] mt-0.5">Consultation Request Details</h2>
                <p className="text-[11px] text-[#667085]">
                  Submitted: {formatDate(selectedRequest.submittedDate)} at {formatTime(selectedRequest.submittedDate)}
                </p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-xl text-[#667085] hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ADMIN ACTIONS */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedRequest.status === "New" && (
                  <button
                    onClick={async () => { await patchStatus(selectedRequest._id, "Viewed"); showToast("Marked as viewed."); }}
                    disabled={updatingStatus}
                    className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 shadow-sm disabled:opacity-50"
                  >
                    Mark as Viewed
                  </button>
                )}
                {(selectedRequest.status === "New" || selectedRequest.status === "Viewed") && (
                  <button
                    onClick={() => setContactedConfirmModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#C8A14A] hover:bg-[#b8913a] text-[#0B1F3A] font-bold text-xs shadow-sm"
                  >
                    Mark as Contacted
                  </button>
                )}
                <button
                  onClick={() => setCreateClientModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 shadow-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#C8A14A]" /> Create Client Profile
                </button>
              </div>
              <div className="flex items-center gap-2">
                <a href={`mailto:${selectedRequest.email}`} className="p-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:bg-slate-50" title="Email Client">
                  <Mail className="w-4 h-4" />
                </a>
                <a href={`tel:${selectedRequest.phone}`} className="p-2 rounded-xl border border-[#E5E7EB] text-[#667085] hover:bg-slate-50" title="Call Client">
                  <Phone className="w-4 h-4" />
                </a>
                <button onClick={() => setDeleteConfirmModal(true)} className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50" title="Delete Request">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Privacy note */}
            <div className="bg-[#0B1F3A]/5 border border-[#C8A14A]/30 p-3 rounded-xl text-[11px] text-[#0B1F3A] font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8A14A]"></span>
              Client consultation information is confidential. Handle all information securely.
            </div>

            {/* CLIENT INFORMATION */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Client Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Full Name</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">{selectedRequest.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Email Address</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">{selectedRequest.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Phone Number</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">{selectedRequest.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selectedRequest.email}`} className="px-3.5 py-2 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C8A14A]" /> Email Client
                </a>
                <a href={`tel:${selectedRequest.phone}`} className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs font-medium text-[#0B1F3A] hover:bg-slate-50 shadow-sm inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C8A14A]" /> Call Client
                </a>
              </div>
            </div>

            {/* PRACTICE AREA + DESCRIPTION */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Legal Matter Details</h3>
              <div className="grid grid-cols-2 gap-3 bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Practice Area</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">{selectedRequest.practiceArea}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Request ID</span>
                  <p className="font-mono font-bold text-[#C8A14A] mt-0.5">{selectedRequest.requestId}</p>
                </div>
              </div>
              <div className="text-xs text-[#0B1F3A] bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] leading-relaxed">
                &ldquo;{selectedRequest.description}&rdquo;
              </div>
            </div>

            {/* REQUEST INFO */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Request Information</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8F9FB] p-4 rounded-xl border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Submitted Date</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">{formatDate(selectedRequest.submittedDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Submitted Time</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">{formatTime(selectedRequest.submittedDate)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#667085]">Source</span>
                  <p className="font-semibold text-[#0B1F3A] mt-0.5">Website Consultation Form</p>
                </div>
              </div>
            </div>

            {/* CONTACT HISTORY (local session) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Contact History</h3>
                <button onClick={() => setShowContactNoteForm(!showContactNoteForm)} className="text-xs font-bold text-[#C8A14A] hover:underline">
                  {showContactNoteForm ? "Cancel" : "+ Add Contact Note"}
                </button>
              </div>
              {showContactNoteForm && (
                <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#0B1F3A] block mb-1">Contact Method</label>
                    <select value={contactNoteMethod} onChange={(e) => setContactNoteMethod(e.target.value as any)} className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-[#0B1F3A]">
                      <option>Phone</option><option>Email</option><option>WhatsApp</option><option>In Person</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-[#0B1F3A] block mb-1">Note</label>
                    <textarea rows={2} placeholder="Enter contact details..." value={contactNoteText} onChange={(e) => setContactNoteText(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-[#0B1F3A]" />
                  </div>
                  <button
                    onClick={() => {
                      if (!contactNoteText.trim()) return;
                      setLocalContactHistory([{ id: String(Date.now()), method: contactNoteMethod, note: contactNoteText, date: "Today – " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...localContactHistory]);
                      setContactNoteText(""); setShowContactNoteForm(false); showToast("Contact note added.");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold"
                  >Save Contact Note</button>
                </div>
              )}
              {localContactHistory.length === 0 ? (
                <p className="text-xs text-[#667085] italic">No contact history recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {localContactHistory.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B1F3A]">{item.method} Communication</span>
                        <span className="text-[10px] text-[#667085]">{item.date}</span>
                      </div>
                      <p className="text-[#667085]">{item.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INTERNAL NOTES (local session) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">Internal Notes</h3>
                <button onClick={() => setShowInternalNoteForm(!showInternalNoteForm)} className="text-xs font-bold text-[#C8A14A] hover:underline">
                  {showInternalNoteForm ? "Cancel" : "+ Add Internal Note"}
                </button>
              </div>
              {showInternalNoteForm && (
                <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#0B1F3A] block mb-1">Note Content</label>
                    <textarea rows={2} placeholder="Enter internal note..." value={internalNoteText} onChange={(e) => setInternalNoteText(e.target.value)} className="w-full bg-white border border-[#E5E7EB] rounded-xl p-3 text-[#0B1F3A]" />
                  </div>
                  <button
                    onClick={() => {
                      if (!internalNoteText.trim()) return;
                      setLocalInternalNotes([{ id: String(Date.now()), content: internalNoteText, author: "Admin", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) }, ...localInternalNotes]);
                      setInternalNoteText(""); setShowInternalNoteForm(false); showToast("Internal note added.");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold"
                  >Save Internal Note</button>
                </div>
              )}
              {localInternalNotes.length === 0 ? (
                <p className="text-xs text-[#667085] italic">No internal notes added yet.</p>
              ) : (
                <div className="space-y-3">
                  {localInternalNotes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B1F3A]">{note.author}</span>
                        <span className="text-[10px] text-[#667085]">{note.date}</span>
                      </div>
                      <p className="text-[#667085]">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MARK AS CONTACTED MODAL */}
      {contactedConfirmModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Mark Request as Contacted</h3>
            <p className="text-xs text-[#667085]">
              Are you sure you want to mark request <span className="font-mono font-bold text-[#C8A14A]">{selectedRequest.requestId}</span> as contacted? This will change its status.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setContactedConfirmModal(false)} className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#667085]">Cancel</button>
              <button
                onClick={async () => { await patchStatus(selectedRequest._id, "Contacted"); setContactedConfirmModal(false); showToast("Consultation request marked as contacted."); }}
                disabled={updatingStatus}
                className="px-4 py-2 rounded-xl bg-[#C8A14A] text-[#0B1F3A] font-bold text-xs disabled:opacity-50"
              >Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteConfirmModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-serif font-bold text-red-600">Delete Consultation Request</h3>
            <p className="text-xs text-[#667085]">
              Are you sure you want to delete <span className="font-mono font-bold text-[#0B1F3A]">{selectedRequest.requestId}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteConfirmModal(false)} className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#667085]">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CLIENT PROFILE MODAL */}
      {createClientModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Create Client Profile</h3>
            <p className="text-xs text-[#667085]">
              Create a new client profile for <span className="font-bold text-[#0B1F3A]">{selectedRequest.fullName}</span> using their submitted contact information.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setCreateClientModal(false)} className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#667085]">Cancel</button>
              <button onClick={() => { setCreateClientModal(false); showToast("Client profile successfully created!"); }} className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs">Create Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}