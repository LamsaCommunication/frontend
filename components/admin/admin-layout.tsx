"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { useAdminStore } from "@/lib/store/useAdminStore";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    // If not authenticated and not on login page, route to login
    if (isMounted && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isMounted, isAuthenticated, pathname, router]);

  if (!isMounted) return null;

  // Render children directly on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#faf9f6]">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
