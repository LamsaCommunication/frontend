"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  FileText,
  Truck,
  ExternalLink,
  LogOut,
  X,
  Sparkles,
  AlertOctagon,
  Megaphone
} from "lucide-react";
import { useAdminStore } from "@/lib/store/useAdminStore";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, adminUser } = useAdminStore();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Catégories", href: "/admin/categories", icon: FolderTree },
    { label: "Produits", href: "/admin/products", icon: Package },
    { label: "Annonces & Bannières", href: "/admin/announcements", icon: Megaphone },
    { label: "Factures & Commandes", href: "/admin/invoices", icon: FileText },
    { label: "Expéditions Yalidine", href: "/admin/delivery", icon: Truck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container: Permanently fixed to the left edge of the viewport */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r border-white/10 bg-[#141414] text-white transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo & Brand Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div>
            <span className="text-sm font-black tracking-tight text-white block">
              LAMSA <span className="text-brand-red">COMMUNICATION</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
          <div>
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray">
              Menu Principal
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${isActive
                      ? "bg-brand-red text-white shadow-[0_6px_20px_-6px_rgba(227,6,19,0.6)]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-brand-warm-gray"
                        }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray">
              Raccourcis & Liens
            </div>

            <div className="space-y-1">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 text-brand-warm-gray" />
                  Site Public
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold">
                  Live
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* User Footer Profile (Always pinned at bottom, never scrolls out of view) */}
        <div className="shrink-0 border-t border-white/10 p-3.5 bg-[#141414]">
          <div className="flex items-center justify-between rounded-2xl bg-white/5 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-xs font-black text-white">
                ABD
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {adminUser?.username || "Admin"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Se déconnecter"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-warm-gray transition-colors hover:bg-white/10 hover:text-brand-red cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
