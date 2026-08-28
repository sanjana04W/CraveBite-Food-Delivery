"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Files, 
  FilePlus, 
  FileSearch, 
  HardDrive, 
  Search, 
  Plus, 
  Eye, 
  Download,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react";

interface DocumentItem {
  _id: string;
  docId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  size: string;
  bytes: number;
  uploadedDate: string;
  status: "Uploaded" | "Under Review" | "Approved" | "Archived";
  documentType: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  caseId?: string;
  caseTitle?: string;
  practiceArea?: string;
}

const DOCUMENT_TYPES = [
  "All Documents",
  "Legal Agreement",
  "Identity Document",
  "Court Document",
  "Evidence",
  "Contract",
  "Other",
];

const STATUS_LIST = ["All Statuses", "Approved", "Under Review", "Uploaded", "Archived"];

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState({ total: 0, recentlyUploaded: 0, underReview: 0, storageUsed: "0 KB" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Documents");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Upload modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadDocType, setUploadDocType] = useState("Legal Agreement");
  const [uploadClientName, setUploadClientName] = useState("");
  const [uploadClientEmail, setUploadClientEmail] = useState("");
  const [uploadClientPhone, setUploadClientPhone] = useState("");
  const [uploadCaseTitle, setUploadCaseTitle] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"Uploaded" | "Under Review" | "Approved" | "Archived">("Approved");
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Delete modal state
  const [deleteDocItem, setDeleteDocItem] = useState<DocumentItem | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchDocuments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (typeFilter !== "All Documents") params.set("type", typeFilter);
      if (statusFilter !== "All Statuses") params.set("status", statusFilter);

      const res = await fetch(`/api/documents?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data);
        if (data.stats) setStats(data.stats);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter]);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 30000);
    return () => clearInterval(interval);
  }, [fetchDocuments]);

  // Handle Document Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a file to upload.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Upload the physical file
      const formData = new FormData();
      formData.append("file", uploadFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "File upload failed.");

      // 2. Save document record in MongoDB
      const finalDocName = uploadDocName.trim() || uploadData.originalName;
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalDocName,
          fileUrl: uploadData.url,
          fileType: uploadData.fileType,
          size: uploadData.size,
          bytes: uploadData.bytes,
          documentType: uploadDocType,
          clientName: uploadClientName,
          clientEmail: uploadClientEmail,
          clientPhone: uploadClientPhone,
          caseTitle: uploadCaseTitle,
          status: uploadStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadDocName("");
        setUploadClientName("");
        setUploadClientEmail("");
        setUploadClientPhone("");
        setUploadCaseTitle("");
        setUploadStatus("Approved");
        showToast("Legal document uploaded and saved successfully!");
        fetchDocuments();
      } else {
        alert(data.error || "Failed to record document.");
      }
    } catch (err: any) {
      alert(err.message || "Network error during upload.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Document
  const handleDeleteDoc = async () => {
    if (!deleteDocItem) return;
    try {
      const res = await fetch(`/api/documents/${deleteDocItem.docId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteDocItem(null);
        showToast("Document deleted successfully.");
        fetchDocuments();
      } else {
        alert(data.error || "Failed to delete document.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const fmtDate = (d?: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B1F3A] p-6 lg:p-8 font-inter">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-[#C8A14A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-medium text-[#667085] mb-1">Home / Documents</div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0B1F3A]">Documents</h1>
          <p className="text-sm text-[#667085] mt-1">
            Securely manage, store, and organize client and case-related legal files and deeds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setLoading(true); fetchDocuments(); }}
            className="p-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#0B1F3A] hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C8A14A]" : ""}`} />
          </button>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            + Upload Document
          </button>
        </div>
      </div>

      {/* 2. DOCUMENT SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Total Documents</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#0B1F3A]">
            <Files className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Recently Uploaded</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{stats.recentlyUploaded}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#DEF7EC] border border-[#BCE8D4] flex items-center justify-center text-[#03543F]">
            <FilePlus className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Under Review</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{stats.underReview}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#92400E]">
            <FileSearch className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Storage Used</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{stats.storageUsed}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#EDF2F7] border border-[#E2E8F0] flex items-center justify-center text-[#4A5568]">
            <HardDrive className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 mb-6 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#667085]" />
          <input 
            type="text" 
            placeholder="Search by filename, client, or case title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-[#F8F9FB] text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:border-[#C8A14A]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-[#E5E7EB] rounded-lg text-xs font-medium px-3 py-2 bg-[#F8F9FB] text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
          >
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#E5E7EB] rounded-lg text-xs font-medium px-3 py-2 bg-[#F8F9FB] text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
          >
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. DOCUMENTS TABLE */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8F9FB] text-[#667085] text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Document Name</th>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Case Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Uploaded Date</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-xs text-[#667085]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C8A14A] mx-auto mb-2" />
                    Loading documents...
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-[#667085]">
                    No documents found. Click <strong>+ Upload Document</strong> to add legal files.
                  </td>
                </tr>
              ) : (
                documents.map((d) => {
                  let statusBadge = "bg-[#DEF7EC] text-[#03543F]";
                  if (d.status === "Under Review") statusBadge = "bg-[#FEF3C7] text-[#92400E]";
                  if (d.status === "Uploaded") statusBadge = "bg-[#E1EFFE] text-[#1E429F]";
                  if (d.status === "Archived") statusBadge = "bg-[#EDF2F7] text-[#4A5568]";

                  return (
                    <tr key={d._id} className="hover:bg-[#F8F9FB] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold text-xs shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <Link href={`/admin/documents/${d.docId}`} className="font-medium text-[#0B1F3A] hover:text-[#C8A14A] transition-colors block">
                              {d.name}
                            </Link>
                            <span className="text-[10px] text-[#667085]">{d.docId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#667085]">
                        <span className="font-medium text-[#0B1F3A]">{d.clientName || "—"}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#667085]">
                        {d.caseTitle ? (
                          <span className="text-xs text-[#0B1F3A]">{d.caseTitle}</span>
                        ) : (
                          <span className="text-xs text-[#667085]">General</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#667085] text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[#0B1F3A]">
                          {d.documentType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#667085] text-xs">
                        {fmtDate(d.uploadedDate)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#667085]">
                        {d.size}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a 
                            href={d.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 text-[#0B1F3A] hover:text-[#C8A14A] bg-[#F8F9FB] hover:bg-[#E5E7EB] rounded text-xs transition-colors"
                            title="Download / View"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <Link 
                            href={`/admin/documents/${d.docId}`}
                            className="p-1.5 text-[#0B1F3A] hover:text-[#C8A14A] bg-[#F8F9FB] hover:bg-[#E5E7EB] rounded text-xs transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteDocItem(d)}
                            className="p-1.5 text-[#667085] hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ MODAL: UPLOAD DOCUMENT ════════════════════════════════════════════ */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5E7EB] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#0B1F3A]">Upload Legal Document</h3>
                <p className="text-xs text-[#667085]">Upload deed, contract, court filing, or client document (up to 25MB).</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1.5 rounded-xl text-[#667085] hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Select File *</label>
                <input 
                  type="file" 
                  required
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setUploadFile(f);
                    if (f && !uploadDocName) setUploadDocName(f.name);
                  }}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Document Title / Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Property Title Deed - Galle Road.pdf"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Document Category</label>
                  <select 
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    {DOCUMENT_TYPES.filter(t => t !== "All Documents").map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Status</label>
                  <select 
                    value={uploadStatus}
                    onChange={(e) => setUploadStatus(e.target.value as any)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Uploaded">Uploaded</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sarah Johnson"
                    value={uploadClientName}
                    onChange={(e) => setUploadClientName(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Related Case Title (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Property Ownership Dispute"
                    value={uploadCaseTitle}
                    onChange={(e) => setUploadCaseTitle(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button 
                  type="button" 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || !uploadFile}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? "Uploading Document..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: DELETE DOCUMENT ════════════════════════════════════════════ */}
      {deleteDocItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Delete Document?</h3>
                <p className="text-xs text-[#667085]">{deleteDocItem.name}</p>
              </div>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed">
              Are you sure you want to delete this document? This will remove the document reference permanently.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setDeleteDocItem(null)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteDoc}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}