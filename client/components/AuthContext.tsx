"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  clientId: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
      const data = await res.json();
      if (res.ok && data.client) {
        setUser({
          id: data.client.id,
          clientId: data.client.clientId,
          name: data.client.name,
          email: data.client.email,
          role: data.client.role,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null); // immediately clear UI
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // even if the server call fails, the UI is already cleared
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
