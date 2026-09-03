"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Loader2,
  Trash2,
  RefreshCw
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { usePaginatedApi } from "@/lib/hooks/usePaginatedApi";
import { ordersApi } from "@/lib/api/lamsa-api";
import type { OrderRecord, OrderStatus } from "@/lib/store/useAdminStore";
import { getSocket } from "@/lib/socket/socket-client";

const STATUS_LABELS: Record<string, string> = {
  ALL: "Toutes",
  PENDING: "En attente",
  CONFIRMED: "Confirmées",
  SHIPPED: "Expédiées",
  DELIVERED: "Livrées",
  CANCELLED: "Annulées"
};

function getStatusBadge(status: OrderStatus) {
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
}

export default function AdminInvoicesPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data: orders, pagination, meta, isLoading, error, page, setPage, refetch } =
    usePaginatedApi<OrderRecord, { statusCounts?: Record<string, number> }>({
      url: "/api/v1/orders",
      limit: 15,
      params: {
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: debouncedSearch || undefined
      },
      deps: [statusFilter, debouncedSearch]
    });

  const handleDeleteOrder = async (id: string, orderNumber: string) => {
    if (!confirm(`Supprimer la commande ${orderNumber} définitivement ?`)) return;
    await ordersApi.deleteOrder(id);
    refetch();
  };

  const refetchRef = React.useRef(refetch);
  React.useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  React.useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    const handleNewOrder = (order: any) => {
      setToastMessage(`Nouvelle commande reçue : ${order.orderNumber} (${order.firstName} ${order.lastName})`);
      refetchRef.current();
      
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    };

    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-charcoal sm:text-3xl">
              Factures &amp; Commandes Clients
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Suivi en temps réel des factures, règlements à la livraison et expéditions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray bg-white px-4 py-2 text-xs font-bold text-brand-charcoal transition-colors hover:bg-brand-soft-white cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-brand-warm-gray ${isLoading ? "animate-spin" : ""}`} />
              <span>Actualiser</span>
            </button>

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
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => {
              const count = meta?.statusCounts?.[status];
              return (
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
                  {STATUS_LABELS[status]}
                  {count !== undefined ? ` (${count})` : (status === "ALL" && pagination ? ` (${pagination.total})` : "")}
                </button>
              );
            })}
          </div>

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
                  <th className="py-3.5 px-4">Client &amp; Téléphone</th>
                  <th className="py-3.5 px-4">Wilaya (Yalidine)</th>
                  <th className="py-3.5 px-4">Articles</th>
                  <th className="py-3.5 px-4">Montant Total</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-red" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-brand-red font-bold">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-brand-warm-gray">
                      Aucune commande ne correspond aux critères sélectionnés.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-soft-white/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-charcoal block">{ord.orderNumber}</span>
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
                        <span className="font-semibold text-brand-dark block">{ord.wilaya}</span>
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
                        {Number(ord.totalAmount).toLocaleString()}{" "}
                        <span className="text-xs text-brand-red font-bold">DZD</span>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/single-invoice?id=${ord.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-light-gray bg-white px-2.5 py-1 text-xs font-bold text-brand-charcoal hover:border-brand-red hover:text-brand-red transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Voir</span>
                          </Link>
                          {/* Hard Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                            title="Supprimer définitivement"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-warm-gray hover:border-brand-red hover:text-brand-red transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Server-side Pagination */}
          <PaginationBar
            pagination={pagination}
            page={page}
            setPage={setPage}
            label="commandes"
          />
        </div>
      </div>

      {/* Toast Notification for Real-Time Orders */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-brand-red/20 bg-white p-4 shadow-lg animate-in slide-in-from-bottom-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-charcoal">Alerte temps réel</h4>
            <p className="text-xs text-brand-warm-gray">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-4 text-brand-warm-gray hover:text-brand-charcoal font-bold text-lg"
          >
            &times;
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
