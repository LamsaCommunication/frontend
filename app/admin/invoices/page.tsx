"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Download
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useAdminStore, OrderStatus } from "@/lib/store/useAdminStore";

export default function AdminInvoicesPage() {
  const { orders, updateOrderStatus, generateYalidineWaybill } = useAdminStore();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filteredOrders = React.useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== "ALL" && ord.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.firstName.toLowerCase().includes(q) ||
          ord.lastName.toLowerCase().includes(q) ||
          ord.phone.includes(q) ||
          ord.wilaya.toLowerCase().includes(q) ||
          (ord.yalidineTracking && ord.yalidineTracking.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Livrée
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200">
            <Truck className="h-3 w-3" /> Expédiée
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-600 border border-purple-200">
            <Clock className="h-3 w-3" /> Confirmée
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-200">
            <Clock className="h-3 w-3" /> En attente
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600 border border-red-200">
            Annulée
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-charcoal sm:text-3xl">
              Factures & Commandes Clients
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Suivi en temps réel des factures, règlements à la livraison et expéditions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray bg-white px-4 py-2 text-xs font-bold text-brand-charcoal transition-colors hover:bg-brand-soft-white cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimer l&apos;état</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-light-gray bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          {/* Status Tabs */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-brand-charcoal text-white shadow-sm"
                    : "text-brand-dark/70 hover:bg-brand-soft-white"
                }`}
              >
                {status === "ALL"
                  ? `Toutes (${orders.length})`
                  : status === "PENDING"
                  ? "En attente"
                  : status === "CONFIRMED"
                  ? "Confirmées"
                  : status === "SHIPPED"
                  ? "Expédiées"
                  : "Livrées"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-warm-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="N° commande, client, wilaya..."
              className="w-full rounded-full border border-brand-light-gray bg-brand-soft-white/60 py-1.5 pl-9 pr-4 text-xs font-medium text-brand-charcoal placeholder-brand-warm-gray focus:border-brand-red focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Master Invoices Table */}
        <div className="overflow-hidden rounded-3xl border border-brand-light-gray bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-light-gray bg-brand-soft-white/60 text-brand-warm-gray uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Facture / Date</th>
                  <th className="py-3.5 px-4">Client & Téléphone</th>
                  <th className="py-3.5 px-4">Wilaya (Yalidine)</th>
                  <th className="py-3.5 px-4">Articles</th>
                  <th className="py-3.5 px-4">Montant Total</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-brand-warm-gray">
                      Aucune commande ne correspond aux critères sélectionnés.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-soft-white/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-charcoal block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-brand-warm-gray">
                          {new Date(ord.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-charcoal block">
                          {ord.firstName} {ord.lastName}
                        </span>
                        <span className="text-[11px] text-brand-warm-gray">{ord.phone}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-dark block">
                          {ord.wilaya}
                        </span>
                        <span className="text-[10px] text-brand-warm-gray">
                          {ord.isStopDesk ? "Bureau StopDesk" : "À domicile"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-charcoal">
                          {ord.items.reduce((s, it) => s + it.quantity, 0)} unités
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-brand-charcoal">
                        {ord.totalAmount.toLocaleString()}{" "}
                        <span className="text-xs text-brand-red font-bold">DZD</span>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href="/admin/single-invoice"
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-light-gray bg-white px-2.5 py-1 text-xs font-bold text-brand-charcoal hover:border-brand-red hover:text-brand-red transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Voir</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
