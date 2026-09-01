"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/lib/store/useCatalogStore";

/**
 * CatalogProvider
 * Mounts once at app root, calls fetchCatalog() to hydrate
 * categories & products from the NestJS backend API.
 * Subsequent renders are served from the Zustand persist cache.
 */
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const fetchCatalog = useCatalogStore((state) => state.fetchCatalog);
  const categories = useCatalogStore((state) => state.categories);

  useEffect(() => {
    // Always refresh on mount to pick up DB changes
    fetchCatalog();
  }, [fetchCatalog]);

  return <>{children}</>;
}
