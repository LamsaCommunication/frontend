"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Printer,
  Download,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Package,
  Layers
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { CustomSelect } from "@/components/ui/custom-select";
import { useAdminStore, OrderStatus } from "@/lib/store/useAdminStore";

export default function AdminSingleInvoicePage() {
  const { orders, updateOrderStatus, generateYalidineWaybill } = useAdminStore();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string>(orders[0]?.id || "");

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <AdminLayout>
        <div className="rounded-3xl border border-brand-light-gray bg-white p-12 text-center">
          <p className="text-sm font-bold text-brand-charcoal">Aucune commande disponible.</p>
        </div>
      </AdminLayout>
    );
  }

  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus(order.id, status);
  };

  const handleYalidineDispatch = () => {
    const { tracking } = generateYalidineWaybill(order.id);
    alert(`Bordereau Yalidine généré avec succès !\nNuméro de suivi : ${tracking}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/invoices"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-light-gray bg-white text-brand-charcoal hover:bg-brand-soft-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-brand-charcoal">
                  Facture {order.orderNumber}
                </h1>
                <span className="rounded-full bg-brand-soft-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-brand-charcoal border border-brand-light-gray">
                  {order.status}
                </span>
              </div>
              <span className="text-[11px] text-brand-warm-gray">
                Émise le {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick order selector switch */}
            <div className="w-64">
              <CustomSelect
                value={order.id}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                aria-label="Sélectionner une facture"
                className="py-1.5 text-xs font-bold"
              >
                {orders.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    {ord.orderNumber} — {ord.firstName} ({ord.totalAmount.toLocaleString()} DZD)
                  </option>
                ))}
              </CustomSelect>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-charcoal px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-red cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* ── Printable Invoice Document ─────────────────────────────── */}
        <div className="rounded-3xl border border-brand-light-gray bg-white p-8 sm:p-12 shadow-sm space-y-8">
          {/* Brand Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b border-brand-light-gray/70 pb-8">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-brand-soft-white p-2 border border-brand-light-gray">
                <Image
                  src="/lamsa2.png"
                  alt="Lamsa Communication"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black text-brand-charcoal tracking-tight block">
                  LAMSA <span className="text-brand-red">COMMUNICATION</span>
                </span>
                <span className="text-xs text-brand-warm-gray block">
                  Studio Créatif & Impression Grand Format
                </span>
                <span className="text-xs text-brand-warm-gray block">
                  Blida, Algérie • contact@lamsadz.com • +213 554 776 283
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-warm-gray block">
                Facture Pro-Forma
              </span>
              <span className="text-xl font-black text-brand-charcoal block">
                {order.orderNumber}
              </span>
              <span className="text-xs text-brand-warm-gray block mt-0.5">
                Date : {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Client & Shipping Details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-2xl border border-brand-light-gray/70 bg-brand-soft-white/60 p-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray block mb-1">
                Facturé à :
              </span>
              <h3 className="text-sm font-extrabold text-brand-charcoal">
                {order.firstName} {order.lastName}
              </h3>
              <p className="text-xs text-brand-dark/70 mt-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-brand-red" />
                {order.phone}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray block mb-1">
                Adresse de livraison Yalidine :
              </span>
              <p className="text-xs font-bold text-brand-charcoal">
                Wilaya : {order.wilaya} — {order.commune}
              </p>
              <p className="text-xs text-brand-dark/70 mt-0.5">
                {order.address}
              </p>
              <span className="mt-2 inline-block rounded-full bg-brand-charcoal px-2.5 py-0.5 text-[10px] font-bold text-white">
                {order.isStopDesk ? "Retrait en Bureau StopDesk" : "Livraison directe à domicile"}
              </span>
            </div>
          </div>

          {/* Itemized Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-light-gray text-brand-warm-gray uppercase tracking-wider font-bold">
                  <th className="py-3 px-2">Visuel & Produit</th>
                  <th className="py-3 px-2">Personnalisation</th>
                  <th className="py-3 px-2 text-center">Quantité</th>
                  <th className="py-3 px-2 text-right">Prix Unitaire</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-brand-light-gray bg-brand-soft-white p-1">
                          <Image
                            src={item.preview3DPath || item.clientLogoPath || "/lamsa2.png"}
                            alt={item.productName}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-brand-charcoal block">
                            {item.productName}
                          </span>
                          {item.clientVerified && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Graphisme validé par client
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-2">
                      {item.customText && (
                        <p className="text-xs font-semibold text-brand-charcoal">
                          Texte : &quot;{item.customText}&quot;
                        </p>
                      )}
                      {item.designNotes && (
                        <p className="text-[11px] text-brand-warm-gray italic">
                          Notes : {item.designNotes}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-2 text-center font-bold text-brand-charcoal">
                      {item.quantity}
                    </td>

                    <td className="py-4 px-2 text-right font-medium text-brand-dark">
                      {item.unitPrice.toLocaleString()} DZD
                    </td>

                    <td className="py-4 px-2 text-right font-black text-brand-charcoal">
                      {(item.unitPrice * item.quantity).toLocaleString()} DZD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Totals */}
          <div className="flex justify-end border-t border-brand-light-gray pt-6">
            <div className="w-full max-w-xs space-y-2.5">
              <div className="flex justify-between text-xs text-brand-dark/70">
                <span>Sous-total HT</span>
                <span className="font-bold text-brand-charcoal">
                  {order.subtotal.toLocaleString()} DZD
                </span>
              </div>

              <div className="flex justify-between text-xs text-brand-dark/70">
                <span>Frais d&apos;expédition Yalidine ({order.wilaya})</span>
                <span className="font-bold text-brand-charcoal">
                  {order.shippingFee.toLocaleString()} DZD
                </span>
              </div>

              <div className="flex justify-between border-t border-brand-light-gray pt-2 text-base font-black text-brand-charcoal">
                <span>Montant Total à payer</span>
                <span className="text-brand-red text-lg">
                  {order.totalAmount.toLocaleString()} DZD
                </span>
              </div>
            </div>
          </div>

          {/* Yalidine Tracking & Status Actions */}
          <div className="rounded-2xl border border-brand-light-gray bg-brand-soft-white/60 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray block">
                Statut Expédition Yalidine :
              </span>
              {order.yalidineTracking ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {order.yalidineTracking}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    ✓ Colis Enregistré
                  </span>
                </div>
              ) : (
                <span className="text-xs text-amber-600 font-bold block mt-1">
                  En attente de génération du bordereau
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!order.yalidineTracking && (
                <button
                  type="button"
                  onClick={handleYalidineDispatch}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover cursor-pointer"
                >
                  <Truck className="h-4 w-4" />
                  <span>1-Click Bordereau Yalidine</span>
                </button>
              )}

              {/* Status Selector */}
              <div className="w-52">
                <CustomSelect
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  aria-label="Changer le statut de la commande"
                  className="py-2 text-xs font-bold"
                >
                  <option value="PENDING">Statut: En attente</option>
                  <option value="CONFIRMED">Statut: Confirmée</option>
                  <option value="SHIPPED">Statut: Expédiée</option>
                  <option value="DELIVERED">Statut: Livrée</option>
                  <option value="CANCELLED">Statut: Annulée</option>
                </CustomSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
