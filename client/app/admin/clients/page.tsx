"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  UserX, 
  Search, 
  Plus, 
  Eye, 
  ShieldAlert 
} from "lucide-react";

interface Client {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  phone: string;
  registeredDate: string;
  consultationsCount: number;
  appointmentsCount: number;
  status: "Active" | "Inactive" | "Suspended";
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Clients");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [sortOption, setSortOption] = useState("Newest Clients");

  useEffect(() => {
    async function fetchClients() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/clients");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch clients from the server: ${response.status} ${response.statusText} ${errorText}`);
        }
        const result = await response.json();
        const data = result?.data ?? [];

        const formattedClients: Client[] = data.map((item: any, index: number) => ({
          id: item._id || item.id || String(index + 1),
          clientId: item.clientId || `CL-2026-${String(index + 1).padStart(3, '0')}`,
          fullName: item.clientName || item.fullName || `${item.firstName || ''} ${item.lastName || ''}`.trim() || "Unnamed Client",
          email: item.email || "",
          phone: item.phone || "",
          registeredDate: item.registeredDate
            ? new Date(item.registeredDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "Unknown Date",
          consultationsCount: item.consultations ?? item.consultationsCount ?? 0,
          appointmentsCount: item.appointments ?? item.appointmentsCount ?? 0,
          status: item.status || "Active",
        }));

        setClients(formattedClients);
      } catch (err: any) {
        console.error("Error fetching clients:", err);
        setError(err.message || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "CL";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  // Filter, search, and sorting logic
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.clientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === "All Clients" || client.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === "Name A-Z") {
      return a.fullName.localeCompare(b.fullName);
    }
    if (sortOption === "Name Z-A") {
      return b.fullName.localeCompare(a.fullName);
    }
    if (sortOption === "Oldest Clients") {
      return new Date(a.registeredDate).getTime() - new Date(b.registeredDate).getTime();
    }
    // Default: Newest Clients
    return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
  });

  const totalClientsCount = clients.length;
  const activeClientsCount = clients.filter(c => c.status === "Active").length;
  const inactiveClientsCount = clients.filter(c => c.status === "Inactive").length;
  const newClientsCount = clients.filter(c => c.status === "Active").length;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#0B1F3A] p-6 lg:p-8 font-inter">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-medium text-[#667085] mb-1">Home / Clients</div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0B1F3A]">Clients</h1>
          <p className="text-sm text-[#667085] mt-1">
            Manage registered clients and view their legal consultation and appointment history.
          </p>
        </div>
        <div>
          <Link href="/signup" className="inline-flex items-center justify-center bg-[#C8A14A] hover:bg-[#b08d3f] text-[#0B1F3A] font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm">
            <Plus className="w-4 h-4 mr-2" />
            + Add Client
          </Link>
        </div>
      </div>

      {/* 2. CLIENT SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Total Clients</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{totalClientsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] flex items-center justify-center text-[#0B1F3A]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Active Clients</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{activeClientsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#DEF7EC] border border-[#BCE8D4] flex items-center justify-center text-[#03543F]">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">New Clients</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{newClientsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#92400E]">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Inactive Clients</p>
            <h3 className="text-2xl font-bold text-[#0B1F3A] mt-1">{inactiveClientsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#374151]">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. SEARCH AND FILTER TOOLBAR */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 mb-6 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, or client ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg text-sm text-[#0B1F3A] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#C8A14A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C8A14A]"
          >
            <option>All Clients</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C8A14A]"
          >
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Custom Date</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C8A14A]"
          >
            <option>Newest Clients</option>
            <option>Oldest Clients</option>
            <option>Name A-Z</option>
            <option>Name Z-A</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All Clients");
              setDateFilter("All Time");
              setSortOption("Newest Clients");
            }}
            className="text-xs font-semibold text-[#667085] hover:text-[#0B1F3A] px-3 py-2 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* 4. CLIENT LIST TABLE */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#E5E7EB] text-xs font-semibold text-[#667085] uppercase tracking-wider">
                <th className="py-3 px-4">Client ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-center">Consultations</th>
                <th className="py-3 px-4 text-center">Appointments</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#667085]">
                    Loading clients from database...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#667085]">
                    No clients found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#F8F9FB] transition-colors">
                    <td className="py-4 px-4 font-medium text-[#0B1F3A]">{client.clientId}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#0B1F3A] text-[#C8A14A] flex items-center justify-center font-bold text-xs">
                          {getInitials(client.fullName)}
                        </div>
                        <span className="font-semibold text-[#0B1F3A]">{client.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#667085]">{client.email}</td>
                    <td className="py-4 px-4 text-[#667085]">{client.phone}</td>
                    <td className="py-4 px-4 text-[#667085]">{client.registeredDate}</td>
                    <td className="py-4 px-4 text-center font-medium">{client.consultationsCount}</td>
                    <td className="py-4 px-4 text-center font-medium">{client.appointmentsCount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        client.status === "Active" 
                          ? "bg-[#DEF7EC] text-[#03543F]" 
                          : client.status === "Suspended" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="inline-flex items-center text-[#C8A14A] hover:text-[#0B1F3A] font-semibold text-xs bg-[#F8F9FB] border border-[#E5E7EB] px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 shadow-sm gap-4">
        <div className="text-xs text-[#667085]">
          Showing <span className="font-semibold text-[#0B1F3A]">1–{filteredClients.length}</span> of <span className="font-semibold text-[#0B1F3A]">{clients.length}</span> clients
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#667085] cursor-pointer">Previous</button>
          <button className="px-3 py-1.5 bg-[#0B1F3A] text-[#FFFFFF] rounded-lg text-xs font-medium">1</button>
          <button className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#667085] cursor-pointer">Next</button>
        </div>
      </div>

      {/* 6. SECURITY & PRIVACY FOOTER */}
      <div className="mt-8 pt-4 border-t border-[#E5E7EB] flex items-center justify-center text-center text-xs text-[#667085]">
        <ShieldAlert className="w-4 h-4 mr-1.5 text-[#C8A14A]" />
        Client information is confidential. Handle all personal and legal information securely.
      </div>
    </div>
  );
}