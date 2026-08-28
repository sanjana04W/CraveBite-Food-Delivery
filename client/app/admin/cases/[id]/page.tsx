"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  CheckCircle,
  Loader2,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  Upload,
  AlertCircle
} from "lucide-react";

interface Note {
  id: string;
  note: string;
  createdBy: string;
  date: string;
}

interface CaseData {
  _id: string;
  caseId: string;
  title: string;
  clientName: string;
  clientId?: string;
  clientEmail?: string;
  clientPhone?: string;
  practiceArea: string;
  status: "Pending" | "Active" | "On Hold" | "Completed" | "Closed";
  priority: "Low" | "Medium" | "High";
  openedDate: string;
  lastUpdated: string;
  courtInstitution?: string;
  caseReferenceNumber?: string;
  description?: string;
  notes: Note[];
}

interface DocumentItem {
  _id: string;
  docId: string;
  name: string;
  documentType: string;
  size: string;
  uploadedDate: string;
  status: string;
  fileUrl: string;
}

const PRACTICE_AREAS = [
  "Property Law",
  "Family Law",
  "Civil Law",
  "Criminal Law",
  "Labour Law",
  "Corporate Law",
];

export default function AdminCaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const caseIdParam = params?.id as string;

  const [caseItem, setCaseItem] = useState<CaseData | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  // Notes state
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editClientEmail, setEditClientEmail] = useState("");
  const [editClientPhone, setEditClientPhone] = useState("");
  const [editPracticeArea, setEditPracticeArea] = useState("");
  const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [editStatus, setEditStatus] = useState<"Pending" | "Active" | "On Hold" | "Completed" | "Closed">("Active");
  const [editCourt, setEditCourt] = useState("");
  const [editReference, setEditReference] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Upload Doc Modal for this Case
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Legal Agreement");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const fetchCase = useCallback(async () => {
    if (!caseIdParam) return;
    try {
      const res = await fetch(`/api/cases/${caseIdParam}`);
      const data = await res.json();
      if (data.success && data.data) {
        setCaseItem(data.data);
        // Pre-fill edit states
        setEditTitle(data.data.title || "");
        setEditClientName(data.data.clientName || "");
        setEditClientEmail(data.data.clientEmail || "");
        setEditClientPhone(data.data.clientPhone || "");
        setEditPracticeArea(data.data.practiceArea || "Property Law");
        setEditPriority(data.data.priority || "Medium");
        setEditStatus(data.data.status || "Active");
        setEditCourt(data.data.courtInstitution || "");
        setEditReference(data.data.caseReferenceNumber || "");
        setEditDescription(data.data.description || "");

        // Fetch related documents
        const docRes = await fetch(`/api/documents?caseId=${data.data.caseId}`);
        const docData = await docRes.json();
        if (docData.success) {
          setDocuments(docData.data);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [caseIdParam]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  // Handle Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !caseItem) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/cases/${caseItem.caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addNote", note: newNoteText }),
      });
      const data = await res.json();
      if (data.success) {
        setCaseItem(data.data);
        setNewNoteText("");
        setIsAddingNote(false);
        showToast("Note added securely.");
      }
    } catch {
      alert("Failed to save note.");
    } finally {
      setSavingNote(false);
    }
  };

  // Handle Delete Note
  const handleDeleteNote = async (noteId: string) => {
    if (!caseItem) return;
    try {
      const res = await fetch(`/api/cases/${caseItem.caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteNote", noteId }),
      });
      const data = await res.json();
      if (data.success) {
        setCaseItem(data.data);
        showToast("Note removed.");
      }
    } catch {
      alert("Failed to delete note.");
    }
  };

  // Handle Status Quick Change
  const handleStatusChange = async (newStatus: string) => {
    if (!caseItem) return;
    try {
      const res = await fetch(`/api/cases/${caseItem.caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCaseItem(data.data);
        showToast(`Case marked as ${newStatus}.`);
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  // Handle Edit Case
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseItem) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/cases/${caseItem.caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          clientName: editClientName,
          clientEmail: editClientEmail,
          clientPhone: editClientPhone,
          practiceArea: editPracticeArea,
          priority: editPriority,
          status: editStatus,
          courtInstitution: editCourt,
          caseReferenceNumber: editReference,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCaseItem(data.data);
        setIsEditModalOpen(false);
        showToast("Case updated successfully.");
      } else {
        alert(data.error || "Failed to update case.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Delete Case
  const handleDeleteCase = async () => {
    if (!caseItem) return;
    try {
      const res = await fetch(`/api/cases/${caseItem.caseId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/cases");
      }
    } catch {
      alert("Network error.");
    }
  };

  // Handle Upload Doc to this Case
  const handleUploadCaseDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile || !caseItem) return;
    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("file", docFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");

      // Save document record
      const docRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName || uploadData.originalName,
          fileUrl: uploadData.url,
          fileType: uploadData.fileType,
          size: uploadData.size,
          bytes: uploadData.bytes,
          documentType: docType,
          clientName: caseItem.clientName,
          clientEmail: caseItem.clientEmail,
          clientPhone: caseItem.clientPhone,
          clientId: caseItem.clientId,
          caseId: caseItem.caseId,
          caseTitle: caseItem.title,
          practiceArea: caseItem.practiceArea,
          status: "Approved",
        }),
      });
      const docSaved = await docRes.json();
      if (docSaved.success) {
        setIsDocModalOpen(false);
        setDocName("");
        setDocFile(null);
        showToast("Document attached to case.");
        fetchCase();
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload document.");
    } finally {
      setUploadingDoc(false);
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
        Loading case details...
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-8 text-center">
        <h2 className="text-xl font-bold text-[#0B1F3A]">Case Not Found</h2>
        <p className="text-xs text-[#667085] mt-2 mb-4">The requested case could not be located.</p>
        <Link href="/admin/cases" className="px-4 py-2 bg-[#C8A14A] text-[#0B1F3A] font-bold rounded-lg text-xs">
          Back to Cases
        </Link>
      </div>
    );
  }

  let statusBadge = "bg-[#E1EFFE] text-[#1E429F]";
  if (caseItem.status === "Active") statusBadge = "bg-[#DEF7EC] text-[#03543F]";
  if (caseItem.status === "Pending") statusBadge = "bg-[#FEF3C7] text-[#92400E]";
  if (caseItem.status === "On Hold") statusBadge = "bg-[#FDE8E8] text-[#9B1C1C]";
  if (caseItem.status === "Completed") statusBadge = "bg-[#EDF2F7] text-[#4A5568]";
  if (caseItem.status === "Closed") statusBadge = "bg-[#E2E8F0] text-[#1A202C]";

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
        <Link href="/admin/cases" className="inline-flex items-center text-xs font-semibold text-[#667085] hover:text-[#0B1F3A] mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Cases List
        </Link>
        <div className="text-xs font-medium text-[#667085]">
          Home / Cases / <span className="text-[#0B1F3A] font-bold">{caseItem.caseId}</span>
        </div>
      </div>

      {/* CASE DETAILS HEADER */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold text-[#0B1F3A]">{caseItem.title}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
              {caseItem.status}
            </span>
          </div>
          <p className="text-sm text-[#667085]">
            Case ID: <span className="font-semibold text-[#0B1F3A]">{caseItem.caseId}</span> • Practice Area: <span className="font-medium text-[#0B1F3A]">{caseItem.practiceArea}</span> • Priority: <span className="font-medium text-[#0B1F3A]">{caseItem.priority}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Edit Case
          </button>
          <button 
            onClick={() => setIsDocModalOpen(true)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            + Add Document
          </button>
          {caseItem.status !== "Closed" ? (
            <button 
              onClick={() => handleStatusChange("Closed")}
              className="bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] hover:bg-[#FCDAD7] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              Close Case
            </button>
          ) : (
            <button 
              onClick={() => handleStatusChange("Active")}
              className="bg-[#DEF7EC] border border-[#BCE8D4] text-[#03543F] hover:bg-[#BCE8D4] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              Reopen Case
            </button>
          )}
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
            title="Delete Case"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Client & Case Overview */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* CLIENT INFORMATION */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Client Information</h3>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-[#0B1F3A] text-base">{caseItem.clientName}</p>
              <p className="text-[#667085] text-xs">Email: <span className="text-[#0B1F3A] font-medium">{caseItem.clientEmail || "—"}</span></p>
              <p className="text-[#667085] text-xs">Phone: <span className="text-[#0B1F3A] font-medium">{caseItem.clientPhone || "—"}</span></p>
              <div className="pt-2">
                <Link
                  href={`/admin/clients`}
                  className="inline-block text-center w-full bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  View Client Portal
                </Link>
              </div>
            </div>
          </div>

          {/* COURT & REFERENCE INFO */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Legal Jurisdiction</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#667085] block">Court / Institution:</span>
                <span className="font-semibold text-[#0B1F3A]">{caseItem.courtInstitution || "Not Specified"}</span>
              </div>
              <div>
                <span className="text-[#667085] block">Reference Number:</span>
                <span className="font-semibold text-[#0B1F3A] font-mono">{caseItem.caseReferenceNumber || "—"}</span>
              </div>
              <div>
                <span className="text-[#667085] block">Opened Date:</span>
                <span className="font-semibold text-[#0B1F3A]">{fmtDate(caseItem.openedDate)}</span>
              </div>
              <div>
                <span className="text-[#667085] block">Last Updated:</span>
                <span className="font-semibold text-[#0B1F3A]">{fmtDate(caseItem.lastUpdated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Case Summary, Documents & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CASE DESCRIPTION */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-3 pb-2 border-b border-[#E5E7EB]">Case Overview & Facts</h3>
            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              {caseItem.description || "No legal description provided yet."}
            </p>
          </div>

          {/* ATTACHED DOCUMENTS */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#0B1F3A]">Attached Documents</h3>
              <button 
                onClick={() => setIsDocModalOpen(true)}
                className="text-xs font-semibold text-[#C8A14A] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Attach Document
              </button>
            </div>

            {documents.length === 0 ? (
              <p className="text-xs text-[#667085] py-4 text-center">
                No documents attached to this case yet. Click <strong>+ Attach Document</strong> to upload files.
              </p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc._id} className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-[#F8F9FB] hover:bg-slate-100 transition-colors text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1F3A]">{doc.name}</p>
                        <p className="text-[10px] text-[#667085]">{doc.documentType} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={doc.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-[#0B1F3A] hover:text-[#C8A14A] transition-colors"
                        title="View / Download"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRIVATE CASE NOTES */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A]">Private Case Notes</h3>
                <p className="text-[11px] text-[#667085]">Internal notes recorded by the legal team. Only visible to admin.</p>
              </div>
              {!isAddingNote && (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Note
                </button>
              )}
            </div>

            {isAddingNote && (
              <form onSubmit={handleAddNote} className="mb-5 p-4 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Type your confidential case note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg p-3 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNote(false); setNewNoteText(""); }}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] bg-white hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="px-4 py-1.5 rounded-lg bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] text-xs font-bold shadow-sm disabled:opacity-60"
                  >
                    {savingNote ? "Saving..." : "Save Note"}
                  </button>
                </div>
              </form>
            )}

            {caseItem.notes && caseItem.notes.length > 0 ? (
              <div className="space-y-3">
                {caseItem.notes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="text-[#0B1F3A] font-normal leading-relaxed">{note.note}</p>
                      <p className="text-[10px] text-[#667085]">
                        By <span className="font-semibold text-[#0B1F3A]">{note.createdBy}</span> • {note.date}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[#667085] hover:text-red-600 p-1 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#667085] text-center py-4">
                No case notes added yet. Click <strong>Add Note</strong> to record thoughts or reminders.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ══ MODAL: EDIT CASE ═════════════════════════════════════════════════ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5E7EB] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Edit Case: {caseItem.caseId}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg text-[#667085] hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Case Title</label>
                <input 
                  type="text" 
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Client Name</label>
                  <input 
                    type="text" 
                    required
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Practice Area</label>
                  <select 
                    value={editPracticeArea}
                    onChange={(e) => setEditPracticeArea(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    {PRACTICE_AREAS.map((pa) => (
                      <option key={pa} value={pa}>{pa}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Priority</label>
                  <select 
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Court / Institution</label>
                  <input 
                    type="text" 
                    value={editCourt}
                    onChange={(e) => setEditCourt(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0B1F3A]">Reference Number</label>
                  <input 
                    type="text" 
                    value={editReference}
                    onChange={(e) => setEditReference(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Description</label>
                <textarea 
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingEdit}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: ATTACH DOCUMENT TO CASE ═══════════════════════════════════ */}
      {isDocModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Attach Document to Case</h3>
              <button onClick={() => setIsDocModalOpen(false)} className="p-1 rounded-lg text-[#667085] hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadCaseDoc} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Select File * (PDF, DOCX, Images)</label>
                <input 
                  type="file" 
                  required
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#0B1F3A] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Document Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Property Title Deed.pdf"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0B1F3A]">Document Category</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#F8F9FB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#0B1F3A] focus:outline-none focus:border-[#C8A14A]"
                >
                  <option value="Legal Agreement">Legal Agreement</option>
                  <option value="Identity Document">Identity Document</option>
                  <option value="Court Document">Court Document</option>
                  <option value="Evidence">Evidence</option>
                  <option value="Contract">Contract</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button 
                  type="button" 
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingDoc || !docFile}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] font-bold text-xs shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {uploadingDoc && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {uploadingDoc ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: DELETE CASE CONFIRMATION ══════════════════════════════════ */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">Delete Case?</h3>
                <p className="text-xs text-[#667085]">{caseItem.caseId} — {caseItem.title}</p>
              </div>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed">
              Are you sure you want to permanently delete this case? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#0B1F3A] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteCase}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Delete Case
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}