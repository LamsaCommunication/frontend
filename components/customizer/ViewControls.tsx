"use client";

import * as React from "react";
import { ZoomIn, ZoomOut, RefreshCcw, RotateCw } from "lucide-react";

interface ViewControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ViewControls({
  onZoomIn,
  onZoomOut,
  onReset
}: ViewControlsProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50 w-full max-w-3xl justify-center px-4 pointer-events-none">
      {/* ── 2. Drag Indicator (Center) ─────────────────────────────── */}
      <div className="pointer-events-none hidden md:flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2 border border-black/5">
        <RotateCw className="h-3.5 w-3.5 text-[#E30613] animate-spin [animation-duration:8s]" />
        <span className="text-xs font-medium text-gray-700 select-none">
          Faire glisser pour pivoter ou déplacer le logo
        </span>
      </div>

      {/* ── 3. Zoom & Reset Controls (Right Side) ──────────────────── */}
      <div className="pointer-events-auto bg-white rounded-full shadow-lg p-2 flex items-center gap-2 border border-black/5">
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom avant"
          aria-label="Zoom avant"
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-black cursor-pointer"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom arrière"
          aria-label="Zoom arrière"
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-black cursor-pointer"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Réinitialiser la caméra"
          aria-label="Réinitialiser la caméra"
          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#E30613] cursor-pointer"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
