"use client";

import * as React from "react";
import { AlertTriangle, Trash2, X, ShieldAlert, AlertCircle } from "lucide-react";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  itemName?: string;
  description?: string;
  blockedReason?: string | null;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  description,
  blockedReason,
  confirmLabel = "Supprimer définitivement",
  cancelLabel = "Annuler",
  isDeleting = false
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const isBlocked = Boolean(blockedReason);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Top Icon & Close */}
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isBlocked
                ? "bg-amber-500/10 text-amber-600 ring-4 ring-amber-500/10"
                : "bg-brand-red/10 text-brand-red ring-4 ring-brand-red/10"
            }`}
          >
            {isBlocked ? (
              <ShieldAlert className="h-6 w-6" />
            ) : (
              <Trash2 className="h-6 w-6" />
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2.5">
          <h3 className="text-lg font-black text-brand-charcoal">
            {title}
          </h3>

          {itemName && (
            <div className="rounded-xl border border-brand-light-gray/70 bg-brand-soft-white px-3.5 py-2 text-xs font-bold text-brand-charcoal truncate">
              {itemName}
            </div>
          )}

          {isBlocked ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-3.5 text-xs font-medium text-amber-900 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Suppression impossible</span>
              </div>
              <p>{blockedReason}</p>
            </div>
          ) : (
            <p className="text-xs text-brand-warm-gray leading-relaxed">
              {description ||
                "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible et supprimera définitivement les données associées."}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-brand-light-gray/70">
          {isBlocked ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-full bg-brand-charcoal px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-red transition-colors cursor-pointer"
            >
              Compris, fermer
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="rounded-full border border-brand-light-gray px-5 py-2.5 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white transition-colors cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.6)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{confirmLabel}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
