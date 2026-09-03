"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // In admin, avoid full screen unmount/remount on subpage transitions to keep sidebar solid
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex min-h-screen flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}
