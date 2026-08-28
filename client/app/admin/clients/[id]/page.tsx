"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Edit, 
  UserX, 
  Plus, 
  CheckCircle2,
  Lock 
} from "lucide-react";

interface Note {
  id: string;
  note: string;
  createdBy: string;
  date: string;
}

export default function AdminClientProfilePage() {
  const params = useParams();
  const clientIdParam = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState({
    id: clientIdParam || "1",
    clientId: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "Not provided",
    address: "Not provided",
    city: "Not provided",
    country: "Not provided",
    accountStatus: "Active",
    registeredDate: "",
    lastLogin: "Never",
    emailVerified: "Registered",
  });

  const [consultations] = useState<
    { requestId: string; submittedDate: string; briefProblem: string; status: string }[]
  >([]);

  const [appointments] = useState<
    { appointmentId: string; date: string; time: string; consultationType: string; status: string }[]
  >([]);

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      note: "Client is currently discussing a property dispute. Follow up after reviewing submitted information.",
      createdBy: "Atty. John Doe",
      date: "August 2, 2026",
    }
  ]);

  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      if (!clientIdParam) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/clients/${clientIdParam}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to load client");
        }
        const item = result.data;
        const formatDate = (value?: string) =>
          value
            ? new Date(value).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Unknown Date";

        setClient({
          id: item._id || clientIdParam,
          clientId: item.clientId || "",
          fullName:
            item.clientName ||
            `${item.firstName || ""} ${item.lastName || ""}`.trim(),
          email: item.email || "",
          phone: item.phone || "N/A",
          dateOfBirth: "Not provided",
          address: "Not provided",
          city: "Not provided",
          country: "Not provided",
          accountStatus: item.status || "Active",
          registeredDate: formatDate(item.registeredDate || item.createdAt),
          lastLogin: item.lastLogin ? formatDate(item.lastLogin) : "Never",
          emailVerified: "Registered",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load client");
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [clientIdParam]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      note: newNoteText,
      createdBy: "Atty. John Doe",
      date: "August 4, 2026",
    };

    setNotes([newNote, ...notes]);
    setNewNoteText("");
    setIsAddingNote(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "CL";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] text-[#667085] p-6 lg:p-8 font-inter">
        Loading client details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-6 lg:p-8 font-inter">
        <Link href="/admin/clients" className="inline-flex items-center text-xs font-semibold text-[#667085] hover:text-[#0B1F3A] mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Clients List
        </Link>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B1F3A] p-6 lg:p-8 font-inter">
      
      {/* Back Button & Breadcrumbs */}
      <div className="mb-6">
        <Link href="/admin/clients" className="inline-flex items-center text-xs font-semibold text-[#667085] hover:text-[#0B1F3A] mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Clients List
        </Link>
        <div className="text-xs font-medium text-[#667085]">
          Home / Clients / <span className="text-[#0B1F3A]">{client.clientId}</span>
        </div>
      </div>

      {/* 7. CLIENT PROFILE HEADER */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#0B1F3A] text-[#C8A14A] flex items-center justify-center font-bold text-xl">
            {getInitials(client.fullName)}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-[#0B1F3A]">{client.fullName}</h1>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DEF7EC] text-[#03543F]">
                {client.accountStatus}
              </span>
            </div>
            <p className="text-sm text-[#667085] mt-1">
              Client ID: <span className="font-semibold text-[#0B1F3A]">{client.clientId}</span> • Registered: {client.registeredDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-semibold">
            <Mail className="w-4 h-4 mr-1.5 text-[#C8A14A]" /> Email Client
          </button>
          <button className="inline-flex items-center bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-semibold">
            <Phone className="w-4 h-4 mr-1.5 text-[#C8A14A]" /> Call Client
          </button>
          <button className="inline-flex items-center bg-[#F8F9FB] border border-[#E5E7EB] text-[#0B1F3A] hover:bg-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-semibold">
            <Edit className="w-4 h-4 mr-1.5 text-[#0B1F3A]" /> Edit Profile
          </button>
          <button className="inline-flex items-center bg-[#FDE8E8] border border-[#F8B4B4] text-[#9B1C1C] hover:bg-[#FCDAD7] px-3.5 py-2 rounded-lg text-xs font-semibold">
            <UserX className="w-4 h-4 mr-1.5" /> Deactivate Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal & Account Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Personal Information</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-[#667085]">Full Name:</span><span className="font-semibold text-[#0B1F3A]">{client.fullName}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Email:</span><span className="font-semibold text-[#0B1F3A]">{client.email}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Phone:</span><span className="font-semibold text-[#0B1F3A]">{client.phone}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Date of Birth:</span><span className="font-semibold text-[#0B1F3A]">{client.dateOfBirth}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Address:</span><span className="font-semibold text-[#0B1F3A]">{client.address}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">City:</span><span className="font-semibold text-[#0B1F3A]">{client.city}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Country:</span><span className="font-semibold text-[#0B1F3A]">{client.country}</span></li>
            </ul>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4 pb-2 border-b border-[#E5E7EB]">Account Information</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-[#667085]">Client ID:</span><span className="font-semibold text-[#0B1F3A]">{client.clientId}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Status:</span><span className="font-semibold text-[#03543F]">{client.accountStatus}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Registered:</span><span className="font-semibold text-[#0B1F3A]">{client.registeredDate}</span></li>
              <li className="flex justify-between"><span className="text-[#667085]">Last Login:</span><span className="font-semibold text-[#0B1F3A]">{client.lastLogin}</span></li>
              <li className="flex justify-between">
                <span className="text-[#667085]">Email Verified:</span>
                <span className="inline-flex items-center text-xs font-semibold text-[#03543F]">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {client.emailVerified}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: History & Private Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4">Consultation Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8F9FB] border-b border-[#E5E7EB] text-xs font-semibold text-[#667085] uppercase">
                    <th className="py-2.5 px-3">Request ID</th>
                    <th className="py-2.5 px-3">Submitted Date</th>
                    <th className="py-2.5 px-3">Brief Problem</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {consultations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#667085]">
                        No consultation requests yet.
                      </td>
                    </tr>
                  ) : (
                    consultations.map((item) => (
                    <tr key={item.requestId} className="hover:bg-[#F8F9FB]">
                      <td className="py-3 px-3 font-medium">{item.requestId}</td>
                      <td className="py-3 px-3 text-[#667085]">{item.submittedDate}</td>
                      <td className="py-3 px-3 text-[#667085] truncate max-w-xs">{item.briefProblem}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded text-xs font-semibold">{item.status}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-xs font-semibold text-[#C8A14A] hover:underline">View</button>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F3A] mb-4">Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F8F9FB] border-b border-[#E5E7EB] text-xs font-semibold text-[#667085] uppercase">
                    <th className="py-2.5 px-3">Appointment ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#667085]">
                        No appointments yet.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                    <tr key={app.appointmentId} className="hover:bg-[#F8F9FB]">
                      <td className="py-3 px-3 font-medium">{app.appointmentId}</td>
                      <td className="py-3 px-3 text-[#667085]">{app.date} at {app.time}</td>
                      <td className="py-3 px-3 text-[#667085]">{app.consultationType}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-[#DEF7EC] text-[#03543F] rounded text-xs font-semibold">{app.status}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-xs font-semibold text-[#C8A14A] hover:underline">View Appointment</button>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 14. PRIVATE INTERNAL NOTES */}
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 shadow-sm border-l-4 border-l-[#C8A14A]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0B1F3A] flex items-center">
                  <Lock className="w-4 h-4 mr-1.5 text-[#C8A14A]" /> Private Notes
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">Visible only to the lawyer and authorized administrators.</p>
              </div>
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="inline-flex items-center bg-[#0B1F3A] text-[#C8A14A] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#132d53]"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> + Add Note
              </button>
            </div>

            {isAddingNote && (
              <form onSubmit={handleAddNote} className="mb-4 bg-[#F8F9FB] p-4 rounded-lg border border-[#E5E7EB]">
                <textarea
                  rows={3}
                  placeholder="Enter private internal note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full p-2.5 text-sm bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A14A]"
                  required
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button type="button" onClick={() => setIsAddingNote(false)} className="px-3 py-1.5 text-xs text-[#667085] hover:bg-[#E5E7EB] rounded-lg">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 text-xs bg-[#C8A14A] text-[#0B1F3A] font-semibold rounded-lg hover:bg-[#b08d3f]">Save Note</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="p-3.5 bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg text-sm">
                  <p className="text-[#0B1F3A] mb-2">{n.note}</p>
                  <div className="flex items-center justify-between text-xs text-[#667085] pt-2 border-t border-[#E5E7EB]">
                    <span>Created by: <strong className="text-[#0B1F3A]">{n.createdBy}</strong> ({n.date})</span>
                    <div className="space-x-2">
                      <button className="hover:text-[#0B1F3A] font-medium">Edit</button>
                      <span>•</span>
                      <button className="hover:text-[#9B1C1C] font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}