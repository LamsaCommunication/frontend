"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Box,
  Loader2,
  AlertCircle
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShopMegaNav } from "@/components/layout/shop-mega-nav";
import { Container } from "@/components/ui/container";
import { CustomSelect } from "@/components/ui/custom-select";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { usePaginatedApi } from "@/lib/hooks/usePaginatedApi";
import { useCatalogStore } from "@/lib/store/useCatalogStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/store/useCatalogStore";

const SORT_OPTIONS = [
  { value: "popular", label: "Les plus populaires" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "newest", label: "Nouveautés" }
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ShopPage() {
  const {
    categories,
    activeCategoryId,
    activeSubCategoryId,
    setActiveCategory,
    setActiveSubCategory
  } = useCatalogStore();

  const { addItem } = useCartStore();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("popular");

  // Debounce search input
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  // Active category / sub-category metadata
  const currentCategory = categories.find((c) => c.id === activeCategoryId);
  const currentSubCategory = currentCategory?.subCategories.find(
    (s) => s.id === activeSubCategoryId
  );

  // ── Server-side Paginated Fetch ─────────────────────────────────────────
  const { data: products, pagination, isLoading, error, page, setPage } =
    usePaginatedApi<Product>({
      url: "/api/v1/products",
      limit: 12,
      params: {
        categoryId: activeCategoryId ?? undefined,
        subCategoryId: activeSubCategoryId ?? undefined,
        search: debouncedSearch || undefined,
        sortBy: sortBy
      },
      deps: [activeCategoryId, activeSubCategoryId, debouncedSearch, sortBy]
    });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "/lamsa2.png",
      customization: {
        clientVerified: true,
        modelType: product.modelType ?? "none",
        preview3DPath: product.images[0] || "/lamsa2.png"
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ShopMegaNav />

      <main className="flex-1">
        {/* Dynamic Category Breadcrumb / Sub-category Bar */}
        {currentCategory && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="border-b border-brand-light-gray/70 bg-white py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            <Container as="div">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-warm-gray">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveSubCategory(null);
                    }}
                    className="hover:text-brand-red transition-colors cursor-pointer"
                  >
                    Catalogue
                  </button>
                  <ChevronRight className="h-3 w-3 text-brand-warm-gray/50" />
                  <span className="font-bold text-brand-charcoal">{currentCategory.name}</span>
                  {currentSubCategory && (
                    <>
                      <ChevronRight className="h-3 w-3 text-brand-warm-gray/50" />
                      <span className="font-bold text-brand-red">{currentSubCategory.name}</span>
                    </>
                  )}
                </div>

                {/* Sub-Category Pills */}
                {currentCategory.subCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setActiveSubCategory(null)}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${activeSubCategoryId === null
                        ? "bg-brand-charcoal text-white"
                        : "bg-brand-soft-white text-brand-charcoal hover:bg-brand-light-gray/60"
                        }`}
                    >
                      Tous
                    </button>
                    {currentCategory.subCategories.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setActiveSubCategory(sub.id)}
                        className={`rounded-full px-3 py-1 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeSubCategoryId === sub.id
                          ? "bg-brand-red text-white shadow-xs"
                          : "bg-brand-soft-white text-brand-charcoal hover:bg-brand-light-gray/60"
                          }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </motion.section>
        )}

        {/* Products Section */}
        <section className="py-8 md:py-12">
          <Container as="div">
            {/* Loading skeleton */}
            {isLoading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="mx-auto max-w-md rounded-3xl border border-red-100 bg-red-50 p-10 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-brand-red" />
                <p className="mt-3 text-sm font-bold text-brand-charcoal">
                  Impossible de charger les produits
                </p>
                <p className="mt-1 text-xs text-brand-warm-gray">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && products.length === 0 && (
              <div className="mx-auto max-w-md rounded-3xl border border-brand-light-gray bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft-white text-brand-warm-gray">
                  <Box className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-charcoal">
                  Aucun produit disponible
                </h3>
                <p className="mt-1 text-xs text-brand-warm-gray">
                  Essayez de sélectionner un autre rayon ou modifiez votre recherche.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveSubCategory(null);
                    setSearch("");
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-charcoal px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-red cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!isLoading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, idx) => {
                    const has3DModel = product.modelType && product.modelType !== "none";
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.5, ease: EASE, delay: (idx % 4) * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.25, ease: EASE } }}
                        className="group flex flex-col justify-between rounded-2xl border border-brand-light-gray/70 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-brand-charcoal/30 hover:shadow-md"
                      >
                        <Link
                          href={`/shop/${product.slug}`}
                          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#faf9f6] p-4 flex items-center justify-center block"
                        >
                          <Image
                            src={product.images[0] || "/lamsa2.png"}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </Link>

                        <div className="mt-3 flex flex-col gap-2">
                          <Link
                            href={`/shop/${product.slug}`}
                            className="text-xs font-black text-brand-charcoal transition-colors hover:text-brand-red line-clamp-1 block"
                          >
                            {product.name}
                          </Link>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-black text-brand-charcoal">
                              {formatPrice(product.price)}{" "}
                              <span className="text-xs font-bold text-brand-red">DZD</span>
                            </span>

                            <Link
                              href={`/shop/${product.slug}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-brand-charcoal px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:bg-brand-red hover:shadow-[0_4px_14px_-2px_rgba(227,6,19,0.5)]"
                            >
                              <span>{has3DModel ? "3D" : "Détails"}</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Server-side Pagination */}
                <div className="mt-10">
                  <PaginationBar
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    label="produits"
                  />
                </div>
              </>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
