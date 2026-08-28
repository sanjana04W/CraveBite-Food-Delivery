"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/components/AdminAuthContext";

interface AdminProfileContextValue {
  displayName: string;
  displayTitle: string;
  profilePhoto: string;
  initials: string;
  refreshAdminProfile: () => Promise<void>;
}

const AdminProfileContext = createContext<AdminProfileContextValue>({
  displayName: "",
  displayTitle: "Restaurant Executive",
  profilePhoto: "",
  initials: "AD",
  refreshAdminProfile: async () => {},
});

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const { adminUser } = useAdminAuth();
  const [displayName, setDisplayName]   = useState("");
  const [displayTitle, setDisplayTitle] = useState("Restaurant Executive");
  const [profilePhoto, setProfilePhoto] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res  = await fetch("/api/admin-profile");
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        const fn = p.firstName || "";
        const ln = p.lastName  || "";
        const full = [fn, ln].filter(Boolean).join(" ");
        // Prefer the DB profile name; fall back to auth session name
        setDisplayName(full || adminUser?.name || "Chef Admin");
        setDisplayTitle(p.title || "Restaurant Executive");
        setProfilePhoto(p.profilePhoto || "");
      }
    } catch (_) {}
  }, [adminUser?.name]);

  // Fetch on mount, and again whenever auth user changes (e.g., after session refresh)
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const initials = displayName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <AdminProfileContext.Provider value={{ displayName, displayTitle, profilePhoto, initials, refreshAdminProfile: fetchProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
}

export function useAdminProfile() {
  return useContext(AdminProfileContext);
}
