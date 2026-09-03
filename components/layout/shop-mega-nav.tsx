import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Check,
  ShieldCheck,
  X,
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Store
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCatalogStore } from "@/lib/store/useCatalogStore";
import { useAnnouncementStore } from "@/lib/store/useAnnouncementStore";
import { AnnouncementCarousel } from "./AnnouncementCarousel";
import { formatPrice } from "@/lib/utils";

const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
};

export function ShopMegaNav() {
  const {
    categories,
    products,
    activeCategoryId,
    activeSubCategoryId,
    setActiveCategory,
    setActiveSubCategory,
  } = useCatalogStore();

  const { announcements, fetchAnnouncements } = useAnnouncementStore();

  const [hoveredCategorySlug, setHoveredCategorySlug] = React.useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const navContainerRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setMounted(true);
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const hasActiveAnnouncements = React.useMemo(() => {
    return announcements.some((a) => a.isActive);
  }, [announcements]);

  // Handle category hover with immediate switch and debounce cancel
  const handleCategoryHover = (slug: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredCategorySlug(slug);
  };

  // Debounced mouse leave so the menu doesn't jitter/flicker if moving cursor across borders
  const handleNavMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredCategorySlug(null);
    }, 140);
  };

  const handleNavMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSelectSub = (catId: string | null, subId?: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveCategory(catId);
    setActiveSubCategory(subId || null);
    setHoveredCategorySlug(null);
    setIsMobileDrawerOpen(false);
  };

  const currentHoveredCat = categories.find((c) => c.slug === hoveredCategorySlug);
  const currentActiveCat = categories.find((c) => c.id === activeCategoryId);

  React.useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  return (
    <>
      <nav
        ref={navContainerRef}
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
        className={`relative w-full transition-colors duration-150 ${isMobileDrawerOpen ? "z-[999]" : "z-40"}`}
      >
        <Container as="div">
          {/* ── Desktop Category Navigation Strip (VistaPrint Style, No scrollbar, No Offres & Packs) ──────── */}
          <div className="hidden lg:flex items-center gap-1 w-full flex-wrap">
            {/* All Products Tab */}
            <button
              type="button"
              onMouseEnter={() => handleCategoryHover(null)}
              onClick={() => {
                setActiveCategory(null);
                setActiveSubCategory(null);
                setHoveredCategorySlug(null);
              }}
              className={`relative py-3 px-3.5 text-[12.5px] font-medium whitespace-nowrap transition-colors cursor-pointer ${activeCategoryId === null
                ? "font-bold text-neutral-900"
                : "text-neutral-700 hover:text-neutral-900"
                }`}
            >
              <span>Tous les produits</span>
              {activeCategoryId === null && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-900" />
              )}
            </button>

            {/* Category Tabs directly loaded from DB */}
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              const isHovered = hoveredCategorySlug === cat.slug;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => handleCategoryHover(cat.slug)}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubCategory(null);
                    setHoveredCategorySlug(null);
                  }}
                  className={`relative py-3 px-3.5 text-[12.5px] font-medium whitespace-nowrap transition-colors cursor-pointer ${isActive || isHovered
                    ? "font-bold text-neutral-900"
                    : "text-neutral-700 hover:text-neutral-900"
                    }`}
                >
                  <span>{cat.name}</span>
                  {(isActive || isHovered) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-900" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Mobile Category Navigation Bar (Clean Rayons Trigger) ────── */}
          <div className="py-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-brand-light-gray/80 bg-white p-2 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 px-1 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft-white text-brand-red flex-shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray">
                    Rayon sélectionné
                  </span>
                  <span className="text-xs font-black text-brand-charcoal truncate">
                    {currentActiveCat?.name || "Tous les produits"}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </Container>

        {/* ── Desktop Mega Menu Dropdown Panel ─────── */}
        <AnimatePresence>
          {hoveredCategorySlug && currentHoveredCat && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className="absolute inset-x-0 top-full z-50 hidden border-b border-neutral-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] lg:block"
            >
              <Container as="div" className="py-7">
                <motion.div
                  key={currentHoveredCat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12 }}
                  className="grid grid-cols-12 gap-6 lg:gap-8 items-start min-h-[260px]"
                >
                  {(() => {
                    const catSubs = currentHoveredCat.subCategories || [];
                    const half = Math.ceil(catSubs.length / 2);
                    const col1Subs = catSubs.slice(0, half);
                    const col2Subs = catSubs.slice(half);

                    const categoryProducts = products.filter(
                      (p) => p.categoryId === currentHoveredCat.id
                    );

                    // Last 3 products related to the main category (sorted by newest)
                    const newestProducts = [...categoryProducts]
                      .sort((a, b) => {
                        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return timeB - timeA;
                      })
                      .slice(0, 3);

                    return (
                      <>
                        {/* ── Column 1: Subcategories Group 1 (Max 5 products) ── */}
                        <div className="col-span-3 space-y-6">
                          {col1Subs.map((sub) => {
                            const subProds = products
                              .filter(
                                (p) =>
                                  p.subCategoryId === sub.id ||
                                  (p.categoryId === currentHoveredCat.id &&
                                    p.slug.toLowerCase().includes(sub.slug.toLowerCase()))
                              )
                              .slice(0, 5);

                            return (
                              <div key={sub.id} className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSelectSub(currentHoveredCat.id, sub.id)}
                                  className="text-[13px] font-bold text-neutral-900 hover:text-brand-red transition-colors block text-left cursor-pointer"
                                >
                                  {sub.name}
                                </button>
                                {subProds.length > 0 ? (
                                  <ul className="space-y-1">
                                    {subProds.map((prod) => (
                                      <li key={prod.id}>
                                        <Link
                                          href={`/shop/${prod.slug}`}
                                          onClick={() => setHoveredCategorySlug(null)}
                                          className="text-[12px] text-neutral-600 hover:text-neutral-900 hover:underline transition-colors block py-0.5 leading-snug"
                                        >
                                          {prod.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => handleSelectSub(currentHoveredCat.id, null)}
                                      className="text-[11px] font-medium text-neutral-400 hover:text-brand-red hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                                    >
                                      Voir les articles &rarr;
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* ── Column 2: Subcategories Group 2 (Max 5 products) ── */}
                        <div className="col-span-3 space-y-6">
                          {col2Subs.map((sub) => {
                            const subProds = products
                              .filter(
                                (p) =>
                                  p.subCategoryId === sub.id ||
                                  (p.categoryId === currentHoveredCat.id &&
                                    p.slug.toLowerCase().includes(sub.slug.toLowerCase()))
                              )
                              .slice(0, 5);

                            return (
                              <div key={sub.id} className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSelectSub(currentHoveredCat.id, sub.id)}
                                  className="text-[13px] font-bold text-neutral-900 hover:text-brand-red transition-colors block text-left cursor-pointer"
                                >
                                  {sub.name}
                                </button>
                                {subProds.length > 0 ? (
                                  <ul className="space-y-1">
                                    {subProds.map((prod) => (
                                      <li key={prod.id}>
                                        <Link
                                          href={`/shop/${prod.slug}`}
                                          onClick={() => setHoveredCategorySlug(null)}
                                          className="text-[12px] text-neutral-600 hover:text-neutral-900 hover:underline transition-colors block py-0.5 leading-snug"
                                        >
                                          {prod.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => handleSelectSub(currentHoveredCat.id, null)}
                                      className="text-[11px] font-medium text-neutral-400 hover:text-brand-red hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                                    >
                                      Voir les articles &rarr;
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* ── Column 3: Nouveautés (Last 3 products related to main category) ── */}
                        <div className="col-span-3 border-l border-neutral-200/80 pl-6 flex flex-col justify-between h-full">
                          <div>
                            <h5 className="text-[13px] font-bold text-neutral-900 mb-3">
                              Nouveautés
                            </h5>
                            {newestProducts.length > 0 ? (
                              <div className="space-y-3">
                                {newestProducts.map((prod) => (
                                  <Link
                                    key={prod.id}
                                    href={`/shop/${prod.slug}`}
                                    onClick={() => setHoveredCategorySlug(null)}
                                    className="group flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-2.5 transition-all hover:border-neutral-300 hover:bg-white hover:shadow-2xs"
                                  >
                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-neutral-200/60 p-1 flex items-center justify-center">
                                      <img
                                        src={prod.images?.[0] || "/lamsa2.png"}
                                        alt={prod.name}
                                        className="h-full w-full object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col min-w-0 flex-1">
                                      <span className="text-[12px] font-bold text-neutral-900 group-hover:text-brand-red transition-colors line-clamp-1">
                                        {prod.name}
                                      </span>
                                      <span className="text-[11px] font-bold text-brand-red mt-0.5">
                                        {formatPrice(prod.price)} DA
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[12px] text-neutral-400">
                                Aucun produit pour cette catégorie.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ── Column 4: Right Visual Card (from DB) ── */}
                        <div className="col-span-3 flex flex-col items-center justify-start">
                          <div className="w-full max-w-[220px] rounded-2xl border border-neutral-200/90 bg-[#fbfbfb] p-4 flex flex-col items-center justify-center transition-all hover:border-neutral-300">
                            <div className="relative h-36 w-full flex items-center justify-center overflow-hidden">
                              <img
                                src={
                                  currentHoveredCat.image ||
                                  (categoryProducts[0]?.images?.[0]) ||
                                  "/lamsa2.png"
                                }
                                alt={currentHoveredCat.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            {currentHoveredCat.description && (
                              <p className="mt-2.5 text-[11px] text-neutral-500 text-center leading-relaxed line-clamp-3">
                                {currentHoveredCat.description}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSub(currentHoveredCat.id)}
                            className="mt-3 text-xs font-bold text-neutral-900 hover:text-brand-red hover:underline transition-colors text-center cursor-pointer leading-snug"
                          >
                            Voir tous les {currentHoveredCat.name.toLowerCase()} &rarr;
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Promotional Banner (Shown steadily, zero layout shift on hover) ────── */}
      {hasActiveAnnouncements && (
        <div className="hidden lg:block">
          <Container as="div" className="py-4">
            <AnnouncementCarousel className="mx-auto w-full max-w-7xl" />
          </Container>
        </div>
      )}

      {/* ── Mobile Accordion / Drawer (Rayons & Subcategories) Teleported to Body ─────── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isMobileDrawerOpen && (
              <div className="fixed inset-0 z-[9999] lg:hidden">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                />

                {/* Slide-over panel */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  className="fixed inset-y-0 left-0 flex w-[85vw] max-w-sm h-full flex-col bg-white shadow-2xl z-[10000]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-brand-light-gray px-5 py-4 bg-white flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft-white text-brand-red">
                        <Store className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-brand-charcoal">
                          Rayons & Catégories
                        </h3>
                        <p className="text-[10px] text-brand-warm-gray font-medium">
                          Boutique Lamsa Communication
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Category Tree */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                    {/* All products button */}
                    <button
                      type="button"
                      onClick={() => handleSelectSub(null, null)}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-xs font-bold transition-all cursor-pointer ${activeCategoryId === null
                        ? "bg-brand-charcoal text-white shadow-sm"
                        : "bg-brand-soft-white text-brand-charcoal hover:bg-brand-light-gray/50"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-brand-red" />
                        Tous les produits de la boutique
                      </span>
                      {activeCategoryId === null && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>

                    <div className="pt-2 pb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-warm-gray px-1">
                        Nos Rayons
                      </span>
                    </div>

                    {categories.map((cat) => {
                      const isExpanded = mobileExpandedCat === cat.id;
                      const isCatActive = activeCategoryId === cat.id;
                      const IconComp = CATEGORY_ICON_MAP[cat.icon] || Sparkles;

                      return (
                        <div
                          key={cat.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${isCatActive
                            ? "border-brand-red/40 bg-brand-red/[0.02]"
                            : "border-brand-light-gray/80 bg-white"
                            }`}
                        >
                          {/* Main category row */}
                          <div className="flex items-center justify-between p-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectSub(cat.id, null)}
                              className="flex flex-1 items-center gap-2.5 text-left rounded-xl p-1.5 transition-colors hover:bg-brand-soft-white cursor-pointer"
                            >
                              <div
                                className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl transition-colors ${isCatActive
                                  ? "bg-brand-red text-white"
                                  : "bg-brand-soft-white text-brand-charcoal"
                                  }`}
                              >
                                {cat.image || (cat.images && cat.images.length > 0 ? cat.images[0] : null) ? (
                                  <img
                                    src={cat.image || (cat.images && cat.images[0]) || ""}
                                    alt={cat.name}
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <IconComp className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className={`text-xs font-bold ${isCatActive
                                    ? "text-brand-red font-black"
                                    : "text-brand-charcoal"
                                    }`}
                                >
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-brand-warm-gray">
                                  {cat.subCategories.length} sous-catégories
                                </span>
                              </div>
                            </button>

                            {cat.subCategories.length > 0 && (
                              <button
                                type="button"
                                aria-label={`Ouvrir ${cat.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMobileExpandedCat(isExpanded ? null : cat.id);
                                }}
                                className={`flex h-8 w-8 items-center justify-center rounded-xl text-brand-warm-gray transition-all hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer ${isExpanded ? "bg-brand-soft-white text-brand-red" : ""
                                  }`}
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-brand-red" : ""
                                    }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Expandable sub-categories */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="border-t border-brand-light-gray/60 bg-[#f9f9f9]/80 p-2 space-y-1"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectSub(cat.id, null)}
                                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-brand-charcoal hover:bg-white hover:text-brand-red transition-colors cursor-pointer"
                                >
                                  <span>Voir toute la catégorie &rarr;</span>
                                  <ChevronRight className="h-3 w-3 text-brand-warm-gray" />
                                </button>

                                {cat.subCategories.map((sub) => {
                                  const isSubActive =
                                    activeCategoryId === cat.id &&
                                    activeSubCategoryId === sub.id;
                                  return (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => handleSelectSub(cat.id, sub.id)}
                                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${isSubActive
                                        ? "bg-brand-red text-white font-bold shadow-xs"
                                        : "text-brand-dark/80 hover:bg-white hover:text-brand-charcoal"
                                        }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <span
                                          className={`h-1.5 w-1.5 rounded-full ${isSubActive
                                            ? "bg-white"
                                            : "bg-brand-warm-gray/40"
                                            }`}
                                        />
                                        {sub.name}
                                      </span>
                                      {isSubActive && (
                                        <Check className="h-3.5 w-3.5 text-white" />
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-brand-light-gray p-4 bg-brand-soft-white/50 flex-shrink-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-brand-warm-gray">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Livraison express Yalidine dans 69 wilayas</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
