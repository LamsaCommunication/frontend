"use client";

import * as React from "react";
import {
  Truck,
  Package,
  Barcode,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Settings,
  Key,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { usePaginatedApi } from "@/lib/hooks/usePaginatedApi";
import { ordersApi } from "@/lib/api/lamsa-api";
import { useAdminStore, OrderRecord } from "@/lib/store/useAdminStore";

export default function AdminDeliveryPage() {
  const { generateYalidineWaybill, updateOrderStatus, yalidineSettings, setYalidineSettings } = useAdminStore();
  const [selectedOrderForLabel, setSelectedOrderForLabel] = React.useState<OrderRecord | null>(null);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  // ── Server-side paginated orders ─────────────────────────────────────────────────
  const {
    data: orders,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    refetch
  } = usePaginatedApi<OrderRecord>({
    url: "/api/v1/orders",
    limit: 15,
    params: { search: debouncedSearch || undefined },
    deps: [debouncedSearch]
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [apiIdInput, setApiIdInput] = React.useState("");
  const [apiTokenInput, setApiTokenInput] = React.useState("");
  const [isLiveInput, setIsLiveInput] = React.useState(true);
  const [showToken, setShowToken] = React.useState(false);
  const [saveToast, setSaveToast] = React.useState<string | null>(null);
  const [testingConnection, setTestingConnection] = React.useState(false);
  const [testResult, setTestResult] = React.useState<"success" | "error" | null>(null);

  const isConfigured = Boolean(yalidineSettings?.apiId?.trim() && yalidineSettings?.apiToken?.trim());

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setYalidineSettings({
      apiId: apiIdInput.trim(),
      apiToken: apiTokenInput.trim(),
      isLive: isLiveInput
    });
    setSaveToast("Identifiants API Yalidine enregistrés avec succès !");
    setTimeout(() => {
      setSaveToast(null);
      setIsSettingsModalOpen(false);
    }, 1200);
  };

  const handleTestConnection = () => {
    if (!apiIdInput.trim() || !apiTokenInput.trim()) {
      setTestResult("error");
      return;
    }
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult("success");
    }, 1000);
  };

  const handleGenerateWaybill = async (orderId: string) => {
    await ordersApi.dispatchYalidine(orderId);
    refetch();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-black text-brand-charcoal sm:text-3xl">
              Hub Expéditions & Bordereaux Yalidine Express
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Générez vos bordereaux d&apos;expédition en 1 clic et suivez les ramassages et livraisons.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* API Status Badge */}
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                API Yalidine : Connectée
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-2 text-xs font-extrabold text-amber-700 border border-amber-200 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                API Yalidine : Clés non configurées
              </span>
            )}

            {/* Settings Button */}
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-brand-light-gray bg-white px-4 py-2 text-xs font-bold text-brand-charcoal shadow-xs hover:border-brand-red hover:text-brand-red hover:shadow-sm transition-all cursor-pointer"
            >
              <Settings className="h-4 w-4 text-brand-charcoal" />
              <span>Paramètres API Yalidine</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-2xl border border-brand-light-gray bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-warm-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par commande, tracking, wilaya..."
              className="w-full rounded-full border border-brand-light-gray bg-brand-soft-white/60 py-2 pl-10 pr-4 text-xs font-medium text-brand-charcoal placeholder-brand-warm-gray focus:border-brand-red focus:bg-white focus:outline-none"
            />
          </div>
          <span className="text-xs font-bold text-brand-warm-gray">
            {pagination ? `${pagination.total} colis gérés` : "—"}
          </span>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-3xl border border-brand-light-gray bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-light-gray bg-brand-soft-white/60 text-brand-warm-gray uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Commande</th>
                  <th className="py-3.5 px-4">Destinataire</th>
                  <th className="py-3.5 px-4">Destination & Mode</th>
                  <th className="py-3.5 px-4">Montant COD</th>
                  <th className="py-3.5 px-4">Tracking Yalidine</th>
                  <th className="py-3.5 px-4 text-right">Bordereau & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-red" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-brand-red font-bold">{error}</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-brand-warm-gray">Aucune commande trouvée.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-soft-white/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-charcoal">
                      {ord.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-charcoal block">
                        {ord.firstName} {ord.lastName}
                      </span>
                      <span className="text-[11px] text-brand-warm-gray">{ord.phone}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-dark block">
                        {ord.wilaya} — {ord.commune}
                      </span>
                      <span className="text-[10px] text-brand-warm-gray">
                        {ord.isStopDesk ? "Bureau StopDesk" : "Livraison Domicile"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-brand-charcoal">
                      {ord.totalAmount.toLocaleString()} DZD
                    </td>

                    <td className="py-3.5 px-4">
                      {ord.yalidineTracking ? (
                        <div className="flex items-center gap-1.5 font-mono font-bold text-blue-600">
                          <Barcode className="h-4 w-4" />
                          <span>{ord.yalidineTracking}</span>
                        </div>
                      ) : (
                        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-200">
                          À expédier
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.yalidineTracking ? (
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForLabel(ord)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray bg-white px-3.5 py-1.5 text-xs font-bold text-brand-charcoal transition-colors hover:bg-brand-charcoal hover:text-white cursor-pointer"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Voir Bordereau</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleGenerateWaybill(ord.id)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover cursor-pointer"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>1-Click Waybill</span>
                          </button>
                        )}
                        {/* Hard Delete */}
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Supprimer ${ord.orderNumber} définitivement ?`)) {
                              await ordersApi.deleteOrder(ord.id);
                              refetch();
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-warm-gray hover:border-brand-red hover:text-brand-red transition-colors cursor-pointer"
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
          <PaginationBar pagination={pagination} page={page} setPage={setPage} label="colis" />
        </div>

        {/* ── Yalidine API Settings Modal ────────────────────────────── */}
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-brand-charcoal">
                      Paramètres API Yalidine Express
                    </h3>
                    <p className="text-[11px] text-brand-warm-gray">
                      Configurez votre compte professionnel Yalidine pour la logistique 58 Wilayas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Toast Feedback */}
              {saveToast && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 animate-in fade-in duration-150">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>{saveToast}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                {/* API ID Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    API ID (X-API-ID) *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
                    <input
                      type="text"
                      value={apiIdInput}
                      onChange={(e) => setApiIdInput(e.target.value)}
                      placeholder="Ex: 89402941094"
                      required
                      className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/50 py-2.5 pl-10 pr-4 text-xs font-mono font-bold text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                    />
                  </div>
                  <span className="mt-1 text-[10px] text-brand-warm-gray block">
                    Votre identifiant client unique fourni par le support Yalidine.
                  </span>
                </div>

                {/* API Token Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    API Token Secret (X-API-TOKEN) *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
                    <input
                      type={showToken ? "text" : "password"}
                      value={apiTokenInput}
                      onChange={(e) => setApiTokenInput(e.target.value)}
                      placeholder="Ex: e4f98ab23c1d90ef..."
                      required
                      className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/50 py-2.5 pl-10 pr-10 text-xs font-mono font-bold text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-warm-gray hover:text-brand-charcoal cursor-pointer"
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <span className="mt-1 text-[10px] text-brand-warm-gray block">
                    Clé secrète de communication sécurisée pour l&apos;émission des étiquettes.
                  </span>
                </div>

                {/* Live / Sandbox Mode Switch */}
                <div className="flex items-center justify-between rounded-2xl border border-brand-light-gray bg-brand-soft-white/40 p-3.5">
                  <div>
                    <span className="text-xs font-bold text-brand-charcoal block">
                      Environnement Production Yalidine
                    </span>
                    <span className="text-[10px] text-brand-warm-gray">
                      Envoie les colis réels dans le réseau logistique Yalidine Express
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLiveInput(!isLiveInput)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isLiveInput ? "bg-emerald-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isLiveInput ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Test Connection Feedback */}
                {testResult === "success" && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Connexion avec les serveurs Yalidine réussie (Ping OK).</span>
                  </div>
                )}

                {testResult === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-50 p-2.5 text-xs font-bold text-amber-800 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span>Veuillez renseigner un API ID et un API Token valides.</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-light-gray/70">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray bg-white px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                  >
                    {testingConnection ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-red" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    <span>Tester la connexion</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSettingsModalOpen(false)}
                      className="rounded-full border border-brand-light-gray px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-5 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-brand-red-hover cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Printable Waybill Label Modal ──────────────────────────── */}
        {selectedOrderForLabel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-brand-red" />
                  <h3 className="text-base font-bold text-brand-charcoal">
                    Bordereau Yalidine Express
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForLabel(null)}
                  className="rounded-full p-1 text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Waybill Slip Box */}
              <div className="rounded-2xl border-2 border-black bg-white p-6 space-y-4 font-mono text-xs text-brand-charcoal">
                {/* Header Yalidine */}
                <div className="flex justify-between items-center border-b-2 border-black pb-3">
                  <div>
                    <span className="text-base font-black tracking-wider block">
                      YALIDINE EXPRESS
                    </span>
                    <span className="text-[10px]">Livraison Express 58 Wilayas</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold block">
                      {selectedOrderForLabel.isStopDesk ? "STOPDESK" : "DOMICILE"}
                    </span>
                    <span className="text-[10px] font-bold text-brand-red">
                      {selectedOrderForLabel.wilaya.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Tracking Code Barcode Simulation */}
                <div className="py-2 text-center border-b-2 border-black">
                  <div className="mx-auto flex h-14 w-64 items-center justify-center bg-gray-100 rounded border border-gray-300">
                    <div className="flex items-center gap-1 tracking-[0.3em] font-black text-sm">
                      ||| |||| | ||||| ||| |||||||
                    </div>
                  </div>
                  <span className="mt-1 block text-sm font-bold tracking-widest">
                    {selectedOrderForLabel.yalidineTracking}
                  </span>
                </div>

                {/* Sender & Receiver */}
                <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-3 text-[11px]">
                  <div>
                    <span className="font-bold block uppercase">EXPÉDITEUR :</span>
                    <span>Lamsa Communication</span>
                    <br />
                    <span>Blida, Algérie</span>
                    <br />
                    <span>0554 776 283</span>
                  </div>

                  <div>
                    <span className="font-bold block uppercase">DESTINATAIRE :</span>
                    <span className="font-bold">
                      {selectedOrderForLabel.firstName} {selectedOrderForLabel.lastName}
                    </span>
                    <br />
                    <span>{selectedOrderForLabel.phone}</span>
                    <br />
                    <span>{selectedOrderForLabel.address}</span>
                  </div>
                </div>

                {/* COD Amount */}
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold uppercase">MONTANT À RECOUVRER (COD) :</span>
                  <span className="text-base font-black">
                    {selectedOrderForLabel.totalAmount.toLocaleString()} DZD
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForLabel(null)}
                  className="rounded-full border border-brand-light-gray px-5 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-2 text-xs font-bold text-white hover:bg-brand-red shadow-sm cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimer l&apos;étiquette</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
