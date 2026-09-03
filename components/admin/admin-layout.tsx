"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { useAdminStore } from "@/lib/store/useAdminStore";

const EASE = [0.22, 1, 0.36, 1] as const;

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
    const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";
    if (isMounted && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isMounted, isAuthenticated, pathname, router]);

  if (!isMounted) return null;

  // Render children directly on login page
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return <>{children}</>;
  }

  // Prevent rendering admin content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Fixed Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area - offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col min-h-screen min-w-0 lg:pl-72">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
