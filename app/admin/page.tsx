"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  ShoppingBag,
  Package,
  Truck,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useCatalogStore } from "@/lib/store/useCatalogStore";
import { ordersApi } from "@/lib/api/lamsa-api";
import { OrderRecord } from "@/lib/store/useAdminStore";
import { formatPrice } from "@/lib/utils";

interface AdminStats {
  totalRevenue: number;
  activeOrders: number;
  yalidineDispatches: number;
  catalogProductsCount: number;
  currentYear: number;
  kpis?: {
    revenue: { change: string; trend: "up" | "down" | "neutral"; subtext: string };
    activeOrders: { change: string; trend: "up" | "down" | "neutral"; subtext: string };
    catalog: { change: string; trend: "up" | "down" | "neutral"; subtext: string };
    dispatches: { change: string; trend: "up" | "down" | "neutral"; subtext: string };
  };
  monthlyEvolution: Array<{ month: string; revenue: number; orders: number }>;
  categoryDistribution: Array<{ name: string; fullName?: string; value: number; count?: number }>;
  recentOrders: OrderRecord[];
}

export default function AdminDashboardPage() {
  const { products } = useCatalogStore();

  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const data = await ordersApi.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Erreur de chargement des statistiques", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const totalRevenue = stats?.totalRevenue || 0;
  const activeOrders = stats?.activeOrders || 0;
  const yalidineDispatches = stats?.yalidineDispatches || 0;
  const catalogProductsCount = stats?.catalogProductsCount ?? products.filter((p) => p.isActive).length;
  const recentOrders = stats?.recentOrders || [];
  const currentYear = stats?.currentYear || new Date().getFullYear();
  const monthlyEvolution = stats?.monthlyEvolution || [];
  const categoryDistribution = stats?.categoryDistribution || [];

  const kpis = [
    {
      title: "Chiffre d'Affaires Global",
      value: `${formatPrice(totalRevenue)} DZD`,
      change: stats?.kpis?.revenue?.change ?? "+100%",
      trend: stats?.kpis?.revenue?.trend ?? "up",
      subtext: stats?.kpis?.revenue?.subtext ?? "vs mois préc.",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Commandes Actives",
      value: activeOrders.toString(),
      change: stats?.kpis?.activeOrders?.change ?? `${activeOrders} actives`,
      trend: stats?.kpis?.activeOrders?.trend ?? "up",
      subtext: stats?.kpis?.activeOrders?.subtext ?? "en cours",
      icon: ShoppingBag,
      color: "bg-brand-red/10 text-brand-red"
    },
    {
      title: "Articles au Catalogue",
      value: catalogProductsCount.toString(),
      change: stats?.kpis?.catalog?.change ?? "100% actifs",
      trend: stats?.kpis?.catalog?.trend ?? "up",
      subtext: stats?.kpis?.catalog?.subtext ?? "en ligne",
      icon: Package,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Expéditions Yalidine",
      value: yalidineDispatches.toString(),
      change: stats?.kpis?.dispatches?.change ?? "0% expédiées",
      trend: stats?.kpis?.dispatches?.trend ?? "neutral",
      subtext: stats?.kpis?.dispatches?.subtext ?? "expédiées",
      icon: Truck,
      color: "bg-amber-50 text-amber-600"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Livrée
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-200">
            <Truck className="h-3 w-3" /> Expédiée
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-600 border border-purple-200">
            <Clock className="h-3 w-3" /> Confirmée
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600 border border-amber-200">
            <Clock className="h-3 w-3" /> En attente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-charcoal sm:text-3xl">
              Tableau de Bord & Performance
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Aperçu analytique en direct de la boutique, des commandes et des expéditions Yalidine.
            </p>
          </div>
        </div>

        {/* ── Metric KPI Cards Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-3xl border border-brand-light-gray bg-white p-6 shadow-sm hover:border-brand-red/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-warm-gray">
                    {kpi.title}
                  </span>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-black text-brand-charcoal truncate">
                    {kpi.value}
                  </span>
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                        kpi.trend === "up"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                          : kpi.trend === "down"
                          ? "bg-rose-50 text-rose-700 border-rose-200/80"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200"
                      }`}
                    >
                      {kpi.trend === "up" && <TrendingUp className="h-3 w-3 mr-1 shrink-0" />}
                      {kpi.trend === "down" && <TrendingDown className="h-3 w-3 mr-1 shrink-0" />}
                      {kpi.trend === "neutral" && <Minus className="h-3 w-3 mr-1 shrink-0" />}
                      <span>{kpi.change}</span>
                    </span>
                    {kpi.subtext && (
                      <span className="mt-1 text-[10px] font-medium text-neutral-400">
                        {kpi.subtext}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Charts Grid (Recharts) ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Revenue Evolution Area Chart (8 Cols) */}
          <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm lg:col-span-8">
            <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-brand-charcoal">
                  Évolution des Ventes &amp; Volume ({currentYear})
                </h2>
                <p className="text-xs text-brand-warm-gray">
                  Chiffre d&apos;affaires mensuel en DZD
                </p>
              </div>
              <span className="rounded-full bg-brand-soft-white px-3 py-1 text-xs font-bold text-brand-charcoal border border-brand-light-gray">
                Jan — Déc {currentYear}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e30613" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#e30613" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e5e0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a7a29a" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#a7a29a" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (Number(v) >= 1000 ? `${v / 1000}k` : `${v}`)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141414",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${formatPrice(Number(value))} DZD (${props?.payload?.orders ?? 0} commande${(props?.payload?.orders ?? 0) > 1 ? "s" : ""})`,
                      "Revenu"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#e30613"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Bar Chart (4 Cols) */}
          <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm lg:col-span-4">
            <div className="border-b border-brand-light-gray/70 pb-4 mb-6">
              <h2 className="text-base font-bold text-brand-charcoal">
                Part par Catégorie (%)
              </h2>
              <p className="text-xs text-brand-warm-gray">
                Répartition des commandes
              </p>
            </div>

            <div className="h-72 w-full">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution} layout="vertical" margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8e5e0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#a7a29a" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#141414", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#141414",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px"
                      }}
                      formatter={(v: any, name: any, props: any) => [
                        `${v}% ${props?.payload?.count !== undefined ? `(${props.payload.count} articles)` : ""}`,
                        props?.payload?.fullName || "Part"
                      ]}
                    />
                    <Bar dataKey="value" fill="#141414" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-brand-warm-gray">
                  Chargement des catégories...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Recent Orders Data Table ───────────────────────────────── */}
        <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-brand-charcoal">
                Dernières Commandes Clients
              </h2>
              <p className="text-xs text-brand-warm-gray">
                Commandes passées via la boutique en ligne
              </p>
            </div>
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:underline"
            >
              <span>Voir toutes les factures</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-light-gray text-brand-warm-gray uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Commande</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Wilaya</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Yalidine</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-soft-white/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-charcoal">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-charcoal block">
                        {ord.firstName} {ord.lastName}
                      </span>
                      <span className="text-[11px] text-brand-warm-gray">{ord.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-brand-dark">
                      {ord.wilaya}
                    </td>
                    <td className="py-3.5 px-4 font-black text-brand-charcoal">
                      {ord.totalAmount.toLocaleString()} DZD
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.yalidineTracking ? (
                        <span className="font-mono text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                          {ord.yalidineTracking}
                        </span>
                      ) : (
                        <span className="text-brand-warm-gray text-[11px]">Non assigné</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/single-invoice?id=${ord.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-brand-light-gray bg-white px-2.5 py-1 text-xs font-bold text-brand-charcoal transition-colors hover:border-brand-red hover:text-brand-red"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
