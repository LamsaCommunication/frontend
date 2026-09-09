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
  Phone,
  Box,
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { CustomSelect } from "@/components/ui/custom-select";
import { OrderRecord, OrderStatus } from "@/lib/store/useAdminStore";
import { ordersApi, uploadsApi } from "@/lib/api/lamsa-api";
import { apiClient } from "@/lib/api/api-client";
import { Scene3D } from "@/components/customizer/Scene3D";
import { DEFAULT_TRANSFORM } from "@/components/customizer/models/types";

function AdminSingleInvoiceContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [order, setOrder] = React.useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // 3D Viewer Modal State
  const [viewing3DItem, setViewing3DItem] = React.useState<any>(null);

  const loadOrder = React.useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await ordersApi.getOrder(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-sm font-bold text-brand-warm-gray">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="rounded-3xl border border-brand-light-gray bg-white p-12 text-center">
          <p className="text-sm font-bold text-brand-charcoal">Aucune commande disponible.</p>
        </div>
      </AdminLayout>
    );
  }

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      await ordersApi.updateStatus(order.id, status);
      await loadOrder();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleYalidineDispatch = async () => {
    try {
      const res = await ordersApi.dispatchYalidine(order.id);
      await loadOrder();
      alert(`Bordereau Yalidine généré avec succès !`);
      if (res?.yalidineLabelUrl) {
        window.open(res.yalidineLabelUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du bordereau.");
    }
  };

  const fixEncoding = (str: string) => {
    if (!str) return str;
    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  };

  const handleDownload = async (url: string, prefix: string, itemName: string, targetFormat: string = "original") => {
    if (url.startsWith("blob:")) {
      alert("Ce fichier est un ancien logo local non sauvegardé sur le serveur et ne peut pas être téléchargé.");
      return;
    }

    try {
      const extensionMatch = url.match(/\.([a-zA-Z0-9]+)$/);
      const originalExtension = extensionMatch ? extensionMatch[1].toLowerCase() : "";
      
      const cleanItemName = fixEncoding(itemName).replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_À-ÿ]/g, "");
      const pathUrl = url.replace('/view/', '/download/');
      
      if (targetFormat === "original" || targetFormat === originalExtension || originalExtension === "pdf") {
        const extension = extensionMatch ? `.${extensionMatch[1]}` : "";
        const filename = `${prefix}-${cleanItemName}${extension}`;
        await uploadsApi.downloadSecureFile(pathUrl, filename);
        return;
      }

      // Convert image format via frontend Canvas
      const res = await apiClient.get(pathUrl, { responseType: "blob" });
      const blob = new Blob([res.data]);
      
      const isImageExt = ["webp", "png", "jpg", "jpeg", "svg"].includes(originalExtension);
      if (!isImageExt) {
        const filename = `${prefix}-${cleanItemName}.${originalExtension}`;
        await uploadsApi.downloadSecureFile(pathUrl, filename);
        return;
      }

      const objectUrl = window.URL.createObjectURL(blob);
      const img = new window.Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // If converting SVG or transparent images to JPEG, add white background
        if (targetFormat === "jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const convertedDataUrl = canvas.toDataURL(`image/${targetFormat}`, 1.0);
        
        const link = document.createElement("a");
        link.href = convertedDataUrl;
        link.setAttribute("download", `${prefix}-${cleanItemName}.${targetFormat}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du téléchargement ou de la conversion du fichier.");
    }
  };

  const DownloadLogoButton = ({ url, prefix, itemName }: { url: string, prefix: string, itemName: string }) => {
    const [format, setFormat] = React.useState("original");
    const isImage = url.endsWith('.webp') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.svg');

    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleDownload(url, prefix, itemName, format)}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded cursor-pointer"
        >
          <Download className="h-3 w-3" />
          Télécharger {prefix === "FaceAvant" ? "Face Avant" : "Dos"}
        </button>
        {isImage && (
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="text-[10px] border border-blue-200 rounded px-1 py-1 text-blue-800 bg-white outline-none cursor-pointer"
          >
            <option value="original">Format Original</option>
            <option value="png">Format PNG</option>
            <option value="jpeg">Format JPG</option>
            <option value="webp">Format WEBP</option>
          </select>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
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
                  <th className="py-3 px-2 min-w-[200px]">Visuel & Produit</th>
                  <th className="py-3 px-2">Fichiers (Admin)</th>
                  <th className="py-3 px-2 text-center">Quantité</th>
                  <th className="py-3 px-2 text-right">Prix Unitaire</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {order.items.map((item) => {
                  const frontLogo = item.designRectoPath || item.clientLogoPath;
                  const backLogo = item.designVersoPath;

                  return (
                    <tr key={item.id}>
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-brand-light-gray bg-brand-soft-white p-1">
                              <Image
                                src={
                                  (item.preview3DPath || frontLogo)
                                    ? ((item.preview3DPath || frontLogo).startsWith("/api/")
                                        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${item.preview3DPath || frontLogo}`
                                        : (item.preview3DPath || frontLogo))
                                    : "/lamsa2.png"
                                }
                                alt={item.productName}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-brand-charcoal block">
                                {fixEncoding(item.productName)}
                              </span>
                              {item.clientVerified && (
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Graphisme validé par client
                                </span>
                              )}
                            </div>
                          </div>
                          {item.modelType && (
                            <button
                              onClick={() => setViewing3DItem(item)}
                              className="self-start inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-brand-charcoal hover:bg-brand-red px-2 py-1 rounded-md transition-colors"
                            >
                              <Box className="h-3 w-3" />
                              Visualiser en 3D
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1.5">
                          {frontLogo && (
                            <DownloadLogoButton url={frontLogo} prefix="FaceAvant" itemName={item.productName} />
                          )}
                          {backLogo && (
                            <DownloadLogoButton url={backLogo} prefix="Dos" itemName={item.productName} />
                          )}
                          {!frontLogo && !backLogo && (
                            <span className="text-[10px] text-gray-400 italic">Aucun fichier</span>
                          )}
                        </div>
                        {item.designNotes && (
                          <p className="text-[10px] text-brand-warm-gray mt-2 italic border-l-2 pl-2">
                            {item.designNotes}
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
                  );
                })}
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
                  <option value="PENDING">Statut: En attente de paiement</option>
                  <option value="PAID">Statut: Payée</option>
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

      {/* ── 3D Viewer Modal ────────────────────────────────────────── */}
      {viewing3DItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-brand-light-gray">
              <h2 className="text-lg font-black text-brand-charcoal flex items-center gap-2">
                <Box className="h-5 w-5 text-brand-red" />
                Visualiseur 3D : {fixEncoding(viewing3DItem.productName)}
              </h2>
              <button
                onClick={() => setViewing3DItem(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-soft-white text-brand-charcoal hover:bg-brand-red hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 bg-brand-soft-white relative flex flex-col">
              <div className="flex-1 relative w-full h-full">
                {(() => {
                  const safeUrl = (url?: string | null) => url?.startsWith("blob:") ? null : url;
                  const safeFrontUrl = safeUrl(viewing3DItem.designRectoPath || viewing3DItem.clientLogoPath);
                  const safeBackUrl = safeUrl(viewing3DItem.designVersoPath);

                  return (
                    <Scene3D
                      modelType={viewing3DItem.modelType}
                      baseColor={viewing3DItem.selectedColor || "#ffffff"}
                      logoUrl={safeFrontUrl}
                      logoTransform={viewing3DItem.frontTransform || DEFAULT_TRANSFORM}
                      frontLogoUrl={safeFrontUrl}
                      frontTransform={viewing3DItem.frontTransform || DEFAULT_TRANSFORM}
                      backLogoUrl={safeBackUrl}
                      backTransform={viewing3DItem.backTransform || DEFAULT_TRANSFORM}
                      isLocked={true}
                      orbitEnabled={true}
                    />
                  );
                })()}
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <span className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-charcoal shadow-sm">
                  Utilisez la souris pour tourner le modèle. Les positions de logo sont centrées par défaut.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminSingleInvoicePage() {
  return (
    <React.Suspense fallback={null}>
      <AdminSingleInvoiceContent />
    </React.Suspense>
  );
}
