"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Layers, Clock, Truck, Loader2 } from "lucide-react";
import { useCatalogStore } from "@/lib/store/useCatalogStore";
import { ProductStandardView } from "@/components/customizer/ProductStandardView";

// Dynamically import Product3DStudio with SSR disabled for optimal WebGL performance
const Product3DStudio = dynamic(
  () => import("@/components/customizer/Product3DStudio").then((mod) => mod.Product3DStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[500px] w-full items-center justify-center rounded-3xl border border-brand-light-gray bg-[#f7f5f2]">
        <div className="flex flex-col items-center gap-3 text-brand-charcoal">
          <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-warm-gray">
            Chargement du Studio 3D WebGL...
          </span>
        </div>
      </div>
    )
  }
);

export function ProductCustomizerClient({ slug }: { slug: string }) {
  const { products, categories } = useCatalogStore();
  const product = products.find((p) => p.slug === slug) || products[0];
  const category = categories.find((c) => c.id === product.categoryId);

  const has3D = product.modelType && product.modelType !== "none";

  return (
    <div className="space-y-8">
      {/* ── Breadcrumbs ────────────────────────────────────────────── */}
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs font-medium text-brand-warm-gray">
        <Link href="/" className="hover:text-brand-charcoal transition-colors">
          Accueil
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-brand-charcoal transition-colors">
          Boutique
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-brand-charcoal">{category.name}</span>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-brand-red font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* ── Dynamic Product View: 3D Studio vs 2D Photo View ───────── */}
      {has3D ? (
        <Product3DStudio product={product} />
      ) : (
        <ProductStandardView product={product} />
      )}
    </div>
  );
}
