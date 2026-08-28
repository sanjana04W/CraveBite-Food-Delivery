"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus, 
  Quote, 
  Calendar,
  AlertTriangle,
  RefreshCw,
  Award
} from "lucide-react";

interface ReviewItem {
  _id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  status: "Approved" | "Pending" | "Rejected";
  featured?: boolean;
  createdAt: string;
}

const getInitials = (name?: string) => {
  if (!name) return "CL";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, fiveStar: 0, avgRating: "5.0" });

  // Filters & Search
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals & Action States
  const [deleteTarget, setDeleteTarget] = useState<ReviewItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewTarget, setViewTarget] = useState<ReviewItem | null>(null);

  // Add Manual Review Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addQuote, setAddQuote] = useState("");
  const [addRating, setAddRating] = useState(5);
  const [savingAdd, setSavingAdd] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ all: "true" });
      if (search) params.append("search", search);
      if (ratingFilter !== "All") params.append("rating", ratingFilter);
      if (statusFilter !== "All") params.append("status", statusFilter);

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, ratingFilter, statusFilter]);

  // Delete Action
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${deleteTarget._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteTarget(null);
        showToast("Review deleted successfully.");
        loadReviews();
      } else {
        alert(data.error || "Failed to delete review.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Review Status (Approve / Reject)
  const handleToggleStatus = async (id: string, newStatus: "Approved" | "Pending" | "Rejected") => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Review status updated to ${newStatus}.`);
        loadReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Manual Review
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addQuote.trim()) {
      alert("Please provide reviewer name and review text.");
      return;
    }
    setSavingAdd(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName.trim(),
          role: addRole.trim() || "Legal Client",
          quote: addQuote.trim(),
          rating: addRating,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setAddName("");
        setAddRole("");
        setAddQuote("");
        setAddRating(5);
        showToast("Client review added successfully.");
        loadReviews();
      } else {
        alert(data.error || "Failed to add review.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSavingAdd(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#07132b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#c59b27]/50 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#07132b]">
            Client Reviews & Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Monitor client feedback, moderate published testimonials, and delete inappropriate reviews.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#c59b27] hover:bg-[#b0881e] text-[#07132b] px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Star className="w-6 h-6 text-[#c59b27]" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Average Rating</div>
            <div className="text-2xl font-serif font-bold text-[#07132b] flex items-center gap-1">
              {stats.avgRating} <span className="text-xs text-slate-400 font-sans font-normal">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Quote className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Total Reviews</div>
            <div className="text-2xl font-serif font-bold text-[#07132b]">{stats.total}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">5-Star Ratings</div>
            <div className="text-2xl font-serif font-bold text-[#07132b]">{stats.fiveStar}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-sans font-medium">Published Live</div>
            <div className="text-2xl font-serif font-bold text-[#07132b]">{stats.approved}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, matter, or review keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#f8fafc] border border-slate-200 rounded-xl text-[#07132b] placeholder-slate-400 focus:outline-none focus:border-[#c59b27]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[#f8fafc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#07132b] focus:outline-none focus:border-[#c59b27] cursor-pointer"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★</option>
            <option value="3">3 Stars ★★★</option>
            <option value="2">2 Stars ★★</option>
            <option value="1">1 Star ★</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#f8fafc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#07132b] focus:outline-none focus:border-[#c59b27] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved / Live</option>
            <option value="Pending">Pending Review</option>
            <option value="Rejected">Rejected / Hidden</option>
          </select>

          <button
            onClick={loadReviews}
            title="Refresh list"
            className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc] hover:bg-slate-100 text-slate-600 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-sans">
          Loading client reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
          <Quote className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-serif font-bold text-[#07132b]">No Reviews Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || ratingFilter !== "All" || statusFilter !== "All"
              ? "No reviews match your current filter criteria."
              : "No client reviews have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
            >
              <div>
                {/* Header: Avatar, Name, Rating & Status */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {rev.avatar ? (
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#c59b27]/30 shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#07132b] text-[#c59b27] border-2 border-[#c59b27]/40 flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-sm">
                        {getInitials(rev.name)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#07132b]">
                        {rev.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans font-medium">
                        {rev.role}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rev.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : rev.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c59b27] text-[#c59b27]" />
                  ))}
                  <span className="text-xs font-bold text-[#c59b27] ml-1.5 font-sans">
                    {rev.rating}.0
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-slate-600 text-xs sm:text-sm italic font-sans leading-relaxed line-clamp-3">
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Footer Actions & Timestamp */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-sans">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Status Toggle Button */}
                  {rev.status === "Approved" ? (
                    <button
                      onClick={() => handleToggleStatus(rev._id, "Rejected")}
                      title="Hide from website"
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition cursor-pointer"
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(rev._id, "Approved")}
                      title="Publish to website"
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
                    >
                      Approve
                    </button>
                  )}

                  {/* View Details */}
                  <button
                    onClick={() => setViewTarget(rev)}
                    title="View full review"
                    className="p-1.5 text-slate-500 hover:text-[#07132b] hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteTarget(rev)}
                    title="Delete review"
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MODAL: VIEW REVIEW DETAILS ════════════════════════════════════ */}
      {viewTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-serif font-bold text-[#07132b]">Review Details</h3>
              <button
                onClick={() => setViewTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              {viewTarget.avatar ? (
                <img
                  src={viewTarget.avatar}
                  alt={viewTarget.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#c59b27]/40 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#07132b] text-[#c59b27] border-2 border-[#c59b27]/40 flex items-center justify-center font-serif font-bold text-xl shadow-sm">
                  {getInitials(viewTarget.name)}
                </div>
              )}
              <div>
                <h4 className="text-lg font-serif font-bold text-[#07132b]">{viewTarget.name}</h4>
                <p className="text-xs text-slate-500 font-sans">{viewTarget.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(viewTarget.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c59b27] text-[#c59b27]" />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
              <p className="text-slate-700 text-sm font-sans italic leading-relaxed">
                &ldquo;{viewTarget.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-sans">
              <span>Status: <strong className="text-[#07132b]">{viewTarget.status}</strong></span>
              <span>Submitted: {new Date(viewTarget.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: DELETE CONFIRMATION ════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-[#07132b]">Delete Client Review?</h3>
              <p className="text-xs text-slate-500 font-sans">
                Are you sure you want to delete the review from <strong className="text-slate-800">{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs italic text-slate-600 line-clamp-2 text-center">
              &ldquo;{deleteTarget.quote}&rdquo;
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: ADD MANUAL REVIEW ══════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#07132b]">Add Client Review</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Manually record a review received via email or letter.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#07132b] block">Rating *</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setAddRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= addRating ? "fill-[#c59b27] text-[#c59b27]" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#c59b27] ml-2">{addRating} of 5 Stars</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#07132b]">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Chen"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#07132b] focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#07132b]">Case / Practice Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Property Dispute Client"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#07132b] focus:outline-none focus:border-[#c59b27]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#07132b]">Review Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the client's feedback here..."
                  value={addQuote}
                  onChange={(e) => setAddQuote(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 text-xs text-[#07132b] focus:outline-none focus:border-[#c59b27] resize-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdd}
                  className="px-6 py-2.5 rounded-xl bg-[#c59b27] hover:bg-[#b0881e] text-[#07132b] font-bold text-xs shadow-md disabled:opacity-60 transition cursor-pointer"
                >
                  {savingAdd ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
