"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Trash2,
  CheckCircle,
  Loader2,
  X,
  AlertCircle,
  Upload
} from "lucide-react";

interface DocumentData {
  _id: string;
  docId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  size: string;
  uploadedDate: string;
  lastUpdated?: string;
  status: "Uploaded" | "Under Review" | "Approved" | "Archived";
  documentType: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientId?: string;
  caseId?: string;
  caseTitle?: string;
  practiceArea?: string;
  caseStatus?: string;
  notes?: string;
}

export default function AdminDocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const docIdParam = params?.id as string;

  const [documentItem, setDocumentItem] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  // Status Change
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Replace file modal
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacing, setReplacing] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchDocument = useCallback(async () => {
    if (!docIdParam) return;
    try {
      const res = await fetch(`/api/documents/${docIdParam}`);
      const data = await res.json();
      if (data.success && data.data) {
        setDocumentItem(data.data);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [docIdParam]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handleStatusChange = async (newStatus: string) => {
    if (!documentItem) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/documents/${documentItem.docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDocumentItem(data.data);
        showToast(`Document status changed to ${newStatus}.`);
      }
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReplaceFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceFile || !documentItem) return;
    setReplacing(true);
    try {
      const formData = new FormData();
      formData.append("file", replaceFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");

      // Update doc record
      const res = await fetch(`/api/documents/${documentItem.docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: uploadData.url,
          fileType: uploadData.fileType,
          size: uploadData.size,
          bytes: uploadData.bytes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDocumentItem(data.data);
        setIsReplaceModalOpen(false);
        setReplaceFile(null);
        showToast("File replaced successfully!");
      }
    } catch (err: any) {
      alert(err.message || "Failed to replace file.");
    } finally {
      setReplacing(false);
    }
  };

  const handleDelete = async () => {
    if (!documentItem) return;
    try {
      const res = await fetch(`/api/documents/${documentItem.docId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/documents");
      }
    } catch {
      alert("Network error.");
    }
  };

  const fmtDate = (d?: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return d;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-xs text-[#667085]">
        <Loader2 className="w-6 h-6 animate-spin text-[#C8A14A] mr-2" />
        Loading document details...
      </div>
    );
  }

  if (!documentItem) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-8 text-center">
        <h2 className="text-xl font-bold text-[#0B1F3A]">Document Not Found</h2>
        <p className="text-xs text-[#667085] mt-2 mb-4">The requested document could not be found.</p>
        <Link href="/admin/documents" className="px-4 py-2 bg-[#C8A14A] text-[#0B1F3A] font-bold rounded-lg text-xs">
          Back to Documents
        </Link>
      </div>
    );
  }

  let statusBadge = "bg-[#DEF7EC] text-[#03543F]";
  if (documentItem.status === "Under Review") statusBadge = "bg-[#FEF3C7] text-[#92400E]";
  if (documentItem.status === "Uploaded") statusBadge = "bg-[#E1EFFE] text-[#1E429F]";
  if (documentItem.status === "Archived") statusBadge = "bg-[#EDF2F7] text-[#4A5568]";

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B1F3A] p-6 lg:p-8 font-inter">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B1F3A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#C8A14A]/40 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-[#C8A14A]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Breadcrumb & Back */}
      <div className="mb-6">
        <Link href="/admin/documents" className="inline-flex items-center text-xs font-semibold text-[#667085] hover:text-[#0B1F3A] mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Documents List
        </Link>
        <div className="text-xs font-medium text-[#667085]">
          Home / Documents / <span className="text-[#0B1F3A] font-bold">{documentItem.name}</span>
        </div>
      </div>

      {/* DOCUMENT DETAILS HEADER */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-bold text-[#0B1F3A]">{documentItem.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
                {documentItem.status}
              </span>
            </div>
            <p className="text-sm text-[#667085]">
              Doc ID: <span className="font-semibold text-[#0B1F3A]">{documentItem.docId}</span> • Type: {documentItem.fileType} • Size: {documentItem.size} • Uploaded: {fmtDate(documentItem.uploadedDate)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a 
            href={documentItem.fileUrl} 
            target="_blank" 
            rel="noreferrer"
            download
            className="inline-flex items-center bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-1.5" /> Download File
          </a>
          <button 
            onClick={() => setIsReplaceModalOpen(true)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Replace File
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] hover:bg-[#FCDAD7] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Related Client & Case */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* CLIENT INFORMATION */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Client Information</h3>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[#0B1F3A] text-base">{documentItem.clientName || "General / Unassigned"}</p>
              <p className="text-[#667085] text-xs">Email: <span className="text-[#0B1F3A]">{documentItem.clientEmail || "—"}</span></p>
              <p className="text-[#667085] text-xs">Phone: <span className="text-[#0B1F3A]">{documentItem.clientPhone || "—"}</span></p>
              <div className="pt-2">
                <Link
                  href={`/admin/clients`}
                  className="inline-block text-center w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  View Client Directory
                </Link>
              </div>
            </div>
          </div>

          {/* CASE INFORMATION */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Case Reference</h3>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[#0B1F3A]">{documentItem.caseTitle || "Not Linked to Specific Case"}</p>
              {documentItem.caseId && <p className="text-[#667085] text-xs">Case ID: <span className="font-mono text-[#0B1F3A]">{documentItem.caseId}</span></p>}
              {documentItem.practiceArea && <p className="text-[#667085] text-xs">Practice Area: <span className="text-[#0B1F3A]">{documentItem.practiceArea}</span></p>}
              <div className="pt-2">
                {documentItem.caseId ? (
                  <Link
                    href={`/admin/cases/${documentItem.caseId}`}
                    className="inline-block text-center w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Associated Case
                  </Link>
                ) : (
                  <Link
                    href={`/admin/cases`}
                    className="inline-block text-center w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Browse All Cases
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Document Details & Status Control */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* METADATA OVERVIEW */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Document Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#667085] block mb-1">Document Category:</span>
                <span className="font-semibold text-[#0B1F3A] px-2.5 py-1 rounded bg-[#F8F9FB] border border-[#E5E7EB] inline-block">
                  {documentItem.documentType}
                </span>
              </div>
              <div>
                <span className="text-[#667085] block mb-1">File Format:</span>
                <span className="font-semibold text-[#0B1F3A] px-2.5 py-1 rounded bg-[#F8F9FB] border border-[#E5E7EB] inline-block font-mono">
                  {documentItem.fileType}
                </span>
              </div>
              <div>
                <span className="text-[#667085] block mb-1">File Size:</span>
                <span className="font-semibold text-[#0B1F3A]">{documentItem.size}</span>
              </div>
              <div>
                <span className="text-[#667085] block mb-1">Uploaded Date:</span>
                <span className="font-semibold text-[#0B1F3A]">{fmtDate(documentItem.uploadedDate)}</span>
              </div>
            </div>
          </div>

          {/* STATUS CONTROL */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1F3A] pb-2 border-b border-[#E5E7EB]">Review & Approval Status</h3>
            <p className="text-xs text-[#667085]">
              Update the verification status of this legal document.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { status: "Approved", color: "bg-[#DEF7EC] text-[#03543F] hover:bg-[#BCE8D4] border-[#BCE8D4]" },
                { status: "Under Review", color: "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] border-[#FDE68A]" },
                { status: "Uploaded", color: "bg-[#E1EFFE] text-[#1E429F] hover:bg-[#C3DDFD] border-[#C3DDFD]" },
                { status: "Archived", color: "bg-[#EDF2F7] text-[#4A5568] hover:bg-[#E2E8F0] border-[#E2E8F0]" },
              ].map((btn) => (
                <button
                  key={btn.status}
                  disabled={updatingStatus || documentItem.status === btn.status}
                  onClick={() => handleStatusChange(btn.status)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    documentItem.status === btn.status ? "ring-2 ring-offset-1 ring-[#0B1F3A] " + btn.color : btn.color
                  }`}
                >
                  {documentItem.status === btn.status ? `✓ ${btn.status}` : `Mark as ${btn.status}`}
                </button>
              ))}
            </div>
          </div>

          {/* FILE PREVIEW & DOWNLOAD CARD */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1F3A] pb-2 border-b border-[#E5E7EB]">File Access</h3>
            <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-[#0B1F3A]">{documentItem.name}</p>
                  <p className="text-[11px] text-[#667085]">{documentItem.size} • Verified secure storage</p>
                </div>
              </div>
              <a
                href={documentItem.fileUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="px-4 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#122e54] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ══ MODAL: REPLACE FILE ══════════════════════════════════════════════ */}
      {isReplaceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Replace File: {documentItem.name}</h3>
              <button onClick={() => setIsReplaceModalOpen(false)} className="p-1 rounded-lg text-[#667085] hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReplaceFile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Select New Version of File *</label>
                <input 
                  type="file" 
                  required
                  onChange={(e) => setReplaceFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button 
                  type="button" 
                  onClick={() => setIsReplaceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={replacing || !replaceFile}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {replacing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {replacing ? "Replacing..." : "Upload & Replace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: DELETE DOCUMENT CONFIRMATION ══════════════════════════════ */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Delete Document?</h3>
                <p className="text-xs text-[#667085]">{documentItem.name}</p>
              </div>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
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