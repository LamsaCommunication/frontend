/**
 * Shared hook for server-driven pagination.
 * Fetches data from the NestJS backend with page/limit params.
 * Returns data, loading state, error, pagination metadata, and page controls.
 */
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/api-client";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsePaginatedApiOptions {
  url: string;
  limit?: number;
  params?: Record<string, string | number | boolean | undefined>;
  /** If true, refetch whenever params change */
  deps?: unknown[];
}

interface UsePaginatedApiResult<T> {
  data: T[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  setPage: (p: number) => void;
  refetch: () => void;
}

export function usePaginatedApi<T = unknown>({
  url,
  limit = 15,
  params = {},
  deps = []
}: UsePaginatedApiOptions): UsePaginatedApiResult<T> {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Reset to page 1 when filters/deps change
  const prevDepsRef = useState(() => deps)[0];
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const cleanParams: Record<string, string> = { page: String(page), limit: String(limit) };
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "" && v !== "ALL") {
        cleanParams[k] = String(v);
      }
    }

    apiClient
      .get(url, { params: cleanParams })
      .then((res) => {
        if (cancelled) return;
        const payload = res.data?.data;
        // API returns { products, pagination } or { orders, pagination } etc.
        const keys = Object.keys(payload || {});
        const dataKey = keys.find((k) => Array.isArray(payload[k]));
        setData(dataKey ? payload[dataKey] : []);
        setPagination(payload?.pagination ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || "Erreur de connexion au serveur.");
        setData([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, page, limit, tick, ...deps]);

  return { data, pagination, isLoading, error, page, setPage, refetch };
}
