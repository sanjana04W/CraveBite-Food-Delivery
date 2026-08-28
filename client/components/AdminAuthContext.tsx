"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

type AdminAuthContextValue = {
  adminUser: AdminUser | null;
  loading: boolean;
  refreshAdmin: () => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/me", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        setAdminUser({
          id: data.admin.id,
          name: data.admin.name,
          email: data.admin.email,
          role: "admin",
        });
      } else {
        setAdminUser(null);
      }
    } catch {
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setAdminUser(null); // immediately clear UI
    try {
      await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // even if server call fails, UI is cleared
    }
  };

  useEffect(() => {
    refreshAdmin();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, refreshAdmin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
