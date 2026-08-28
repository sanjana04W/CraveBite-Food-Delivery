"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TestRole = "owner" | "kitchen" | "staff";

export interface RoleConfig {
  id: TestRole;
  title: string;
  shortTitle: string;
  badgeEmoji: string;
  tagline: string;
  badgeClass: string;
  defaultUserName: string;
  defaultUserTitle: string;
  initials: string;
  avatarBg: string;
  allowedPaths: string[];
}

export const ROLES: Record<TestRole, RoleConfig> = {
  owner: {
    id: "owner",
    title: "Owner / Super Admin",
    shortTitle: "Owner",
    badgeEmoji: "👑",
    tagline: "Unrestricted master access to all operations, menus, finances & settings",
    badgeClass: "text-amber-700 bg-amber-50 border-amber-200",
    defaultUserName: "Admin Owner",
    defaultUserTitle: "Restaurant Executive",
    initials: "AD",
    avatarBg: "bg-[#0B1F3A] text-[#C8A14A]",
    allowedPaths: ["*"],
  },
  kitchen: {
    id: "kitchen",
    title: "Kitchen Staff",
    shortTitle: "Kitchen Staff",
    badgeEmoji: "🍳",
    tagline: "Order queue management, live kitchen tickets & dish stock toggle",
    badgeClass: "text-orange-700 bg-orange-50 border-orange-200",
    defaultUserName: "Kitchen Staff",
    defaultUserTitle: "Head of Kitchen & Prep",
    initials: "KS",
    avatarBg: "bg-orange-600 text-white",
    allowedPaths: [
      "/admin",
      "/admin/cases",
      "/admin/practice-areas",
      "/admin/notifications",
      "/admin/profile",
    ],
  },
  staff: {
    id: "staff",
    title: "Staff Operator",
    shortTitle: "Staff Operator",
    badgeEmoji: "👤",
    tagline: "Live orders, reservations, customer assistance & foodie reviews",
    badgeClass: "text-purple-700 bg-purple-50 border-purple-200",
    defaultUserName: "Staff Operator",
    defaultUserTitle: "Front Desk & Operations",
    initials: "SO",
    avatarBg: "bg-purple-600 text-white",
    allowedPaths: [
      "/admin",
      "/admin/cases",
      "/admin/consultations",
      "/admin/clients",
      "/admin/reviews",
      "/admin/messages",
      "/admin/notifications",
      "/admin/profile",
    ],
  },
};

interface TestRoleContextValue {
  currentRole: TestRole;
  roleConfig: RoleConfig;
  setRole: (role: TestRole) => void;
  canAccess: (pathname: string) => boolean;
}

const TestRoleContext = createContext<TestRoleContextValue>({
  currentRole: "owner",
  roleConfig: ROLES.owner,
  setRole: () => {},
  canAccess: () => true,
});

export function TestRoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<TestRole>("owner");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cravebite_test_role") as TestRole;
      if (saved && ROLES[saved]) {
        setCurrentRoleState(saved);
      }
    } catch (_) {}
  }, []);

  const setRole = (role: TestRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem("cravebite_test_role", role);
    } catch (_) {}
  };

  const canAccess = (pathname: string): boolean => {
    const config = ROLES[currentRole];
    if (config.allowedPaths.includes("*")) return true;
    return config.allowedPaths.some(
      (path) => pathname === path || (path !== "/admin" && pathname.startsWith(path))
    );
  };

  return (
    <TestRoleContext.Provider
      value={{
        currentRole,
        roleConfig: ROLES[currentRole],
        setRole,
        canAccess,
      }}
    >
      {children}
    </TestRoleContext.Provider>
  );
}

export function useTestRole() {
  return useContext(TestRoleContext);
}
