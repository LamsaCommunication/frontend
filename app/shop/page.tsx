"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
  Check,
  ChevronRight,
  Box,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  X
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ShopMegaNav } from "@/components/layout/shop-mega-nav";
import { Container } from "@/components/ui/container";
import { CustomSelect } from "@/components/ui/custom-select";
import { useCatalogStore, Product } from "@/lib/store/useCatalogStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function ShopPage() {
  const {
    products,
    categories,
    activeCategoryId,
    activeSubCategoryId,
    searchQuery,
    sortBy,
    setActiveCategory,
    setActiveSubCategory,
    setSearchQuery,
    setSortBy
  } = useCatalogStore();

  const { addItem, openDrawer } = useCartStore();
  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  // Active Category details
  const currentCategory = categories.find((c) => c.id === activeCategoryId);
  const currentSubCategory = currentCategory?.subCategories.find(
    (s) => s.id === activeSubCategoryId
  );

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    return products
      .filter((product) => {
        if (!product.isActive) return false;
        if (activeCategoryId && product.categoryId !== activeCategoryId) return false;
        if (activeSubCategoryId && product.subCategoryId !== activeSubCategoryId) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            (product.dimensions && product.dimensions.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategoryId, activeSubCategoryId, searchQuery, sortBy]);

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
        modelType: product.modelType,
        preview3DPath: product.images[0] || "/lamsa2.png",
      },
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ShopMegaNav />

      <main className="flex-1">
        {/* ── Dynamic Category Breadcrumb / Sub-category Bar ─────────── */}
        {currentCategory && (
          <section className="border-b border-brand-light-gray/70 bg-white py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
                  <span className="font-bold text-brand-charcoal">
                    {currentCategory.name}
                  </span>
                  {currentSubCategory && (
                    <>
                      <ChevronRight className="h-3 w-3 text-brand-warm-gray/50" />
                      <span className="font-bold text-brand-red">
                        {currentSubCategory.name}
                      </span>
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
          </section>
        )}

        {/* ── Products Control & Grid Section ────────────────────────── */}
        <section className="py-8 md:py-12">
          <Container as="div">
            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="mx-auto max-w-md rounded-3xl border border-brand-light-gray bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft-white text-brand-warm-gray">
                  <Box className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-bold text-brand-charcoal">
                  Aucun produit ne correspond à vos filtres
                </h3>
                <p className="mt-1 text-xs text-brand-warm-gray">
                  Essayez de sélectionner un autre rayon ou modifiez votre recherche.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveSubCategory(null);
                    setSearchQuery("");
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-charcoal px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-red cursor-pointer"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product, idx) => {
                  const has3DModel = product.modelType && product.modelType !== "none";

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.3, delay: (idx % 4) * 0.04 }}
                      className="group flex flex-col justify-between rounded-2xl border border-brand-light-gray/70 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-brand-charcoal/30 hover:shadow-md"
                    >
                      {/* Image Frame — No zoom */}
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

                      {/* Info & Action Strip */}
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
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
