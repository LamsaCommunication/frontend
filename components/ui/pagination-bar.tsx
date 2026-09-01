"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/lib/hooks/usePaginatedApi";

interface PaginationBarProps {
  pagination: PaginationMeta | null;
  page: number;
  setPage: (p: number) => void;
  label?: string; // e.g. "produits" or "commandes"
}

export function PaginationBar({ pagination, page, setPage, label = "résultats" }: PaginationBarProps) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { total, totalPages, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page number list with ellipsis
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col gap-2 border-t border-brand-light-gray px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-brand-warm-gray">
        {start}–{end} sur <span className="font-bold text-brand-charcoal">{total}</span> {label}
      </span>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-charcoal transition-colors hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Page précédente"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-xs text-brand-warm-gray">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p as number)}
              className={`h-8 min-w-[32px] rounded-lg border px-2 text-xs font-bold transition-colors cursor-pointer ${
                p === page
                  ? "border-brand-red bg-brand-red text-white shadow-sm"
                  : "border-brand-light-gray bg-white text-brand-charcoal hover:border-brand-red hover:text-brand-red"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-charcoal transition-colors hover:border-brand-red hover:text-brand-red disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Page suivante"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
