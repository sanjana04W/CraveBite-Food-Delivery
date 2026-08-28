"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import { AdminAuthProvider, useAdminAuth } from "@/components/AdminAuthContext";
import { AdminProfileProvider } from "./components/AdminProfileContext";
import { TestRoleProvider } from "./components/TestRoleContext";
import RoleGuard from "./components/RoleGuard";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { adminUser, loading } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminLogin = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!isAdminLogin && !adminUser) {
      router.replace("/admin/login");
    }
  }, [adminUser, loading, router, isAdminLogin]);

  if (isAdminLogin) {
    return <>{children}</>;
  }

  if (loading || !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F2EB] text-[#667085] text-sm">
        Checking admin access...
      </div>
    );
  }

  return (
    <TestRoleProvider>
      <AdminProfileProvider>
        <div className="min-h-screen bg-[#F7F2EB] text-[#0B1F3A] font-sans antialiased flex">
          <AdminSidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />

          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              sidebarCollapsed ? "lg:pl-20" : "lg:pl-[260px]"
            }`}
          >
            <AdminHeader onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
              <RoleGuard>{children}</RoleGuard>
            </main>

            <footer className="py-4 px-8 bg-[#FAF6F0] border-t border-[#E8DFC8]/80 text-xs text-[#667085] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 CraveBite Restaurant & Kitchen Management. All Rights Reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-orange-500 transition-colors">Kitchen Guidelines</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Food Safety Standards</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Operations Help</a>
              </div>
            </footer>
          </div>
        </div>
      </AdminProfileProvider>
    </TestRoleProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
