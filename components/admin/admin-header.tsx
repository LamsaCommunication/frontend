"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Package,
  ArrowRight
} from "lucide-react";
import { ordersApi } from "@/lib/api/lamsa-api";
import { formatPrice } from "@/lib/utils";
import { io } from "socket.io-client";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [liveNotifications, setLiveNotifications] = React.useState<any[]>([]);
  
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  // Fetch initial notifications from DB
  React.useEffect(() => {
    ordersApi.getOrders({ limit: 10 }).then(res => {
      if (res && res.orders) {
        setLiveNotifications(res.orders);
      }
    }).catch(console.error);
  }, []);

  // Handle Socket.IO connection for global notifications
  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
    
    socket.on("new_order", (order) => {
      setLiveNotifications((prev) => {
        const updated = [order, ...prev];
        return Array.from(new Map(updated.map((item) => [item.id || item.orderNumber, item])).values()).slice(0, 10);
      });
      if (!notificationsOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [notificationsOpen]);

  // Reset unread count when opening notifications
  const handleToggleNotifications = () => {
    setNotificationsOpen((v) => {
      if (!v) setUnreadCount(0);
      return !v;
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between lg:justify-end border-b border-brand-light-gray/80 bg-white/95 px-6 backdrop-blur-md lg:px-8">
      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Ouvrir le menu"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-light-gray bg-brand-soft-white text-brand-charcoal hover:bg-white lg:hidden cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Right: Notification Trigger & Dropdown alone */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggleNotifications}
          aria-label="Notifications"
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-all cursor-pointer ${notificationsOpen
            ? "border-brand-red bg-brand-red text-white shadow-md shadow-brand-red/20 ring-4 ring-brand-red/10"
            : "border-brand-light-gray bg-brand-soft-white text-brand-charcoal hover:border-brand-red/40 hover:bg-white hover:text-brand-red hover:shadow-xs"
            }`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-black text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {notificationsOpen && (
          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-brand-light-gray bg-white p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-3.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-brand-charcoal">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-extrabold text-brand-red">
                    {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {liveNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-warm-gray">
                Aucune nouvelle commande pour le moment.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {liveNotifications.map((ord) => {
                  const statusColors: Record<string, string> = {
                    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
                    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
                    SHIPPED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    DELIVERED: "bg-green-50 text-green-700 border-green-200",
                    CANCELLED: "bg-red-50 text-red-700 border-red-200"
                  };
                  const statusLabels: Record<string, string> = {
                    PENDING: "En attente",
                    CONFIRMED: "Confirmée",
                    SHIPPED: "Expédiée",
                    DELIVERED: "Livrée",
                    CANCELLED: "Annulée"
                  };

                  return (
                    <Link
                      key={ord.id}
                      href="/admin/invoices"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-start gap-3 rounded-2xl p-3 border border-transparent hover:border-brand-light-gray hover:bg-brand-soft-white/60 transition-all block cursor-pointer group"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-soft-white text-brand-charcoal group-hover:bg-brand-red group-hover:text-white transition-colors">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-brand-charcoal truncate">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${statusColors[ord.status] || "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {statusLabels[ord.status] || ord.status}
                          </span>
                        </div>
                        <span className="text-xs text-brand-dark/80 block truncate">
                          {ord.firstName} {ord.lastName} • {ord.wilaya}
                        </span>
                        <span className="text-[11px] font-bold text-brand-red block mt-0.5">
                          {formatPrice(ord.totalAmount)} DZD
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-brand-light-gray/70 text-center">
              <Link
                href="/admin/invoices"
                onClick={() => setNotificationsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal hover:text-brand-red transition-colors"
              >
                <span>Accéder au Factures & Commandes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
