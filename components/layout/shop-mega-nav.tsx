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
import { AnnouncementCarousel } from "./AnnouncementCarousel";

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

// Removed CATEGORY_MEGA_DATA since data is loaded from the DB

export function ShopMegaNav() {
  const {
    categories,
    activeCategoryId,
    activeSubCategoryId,
    setActiveCategory,
    setActiveSubCategory,
  } = useCatalogStore();

  const [hoveredCategorySlug, setHoveredCategorySlug] = React.useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const navContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mega menu on mouse leave
  const handleMouseLeave = () => {
    setHoveredCategorySlug(null);
  };

  const handleSelectSub = (catId: string | null, subId?: string | null) => {
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
    <nav
      ref={navContainerRef}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full transition-colors duration-150 ${hoveredCategorySlug ? "bg-background" : ""} ${isMobileDrawerOpen ? "z-[999]" : "z-40"}`}
    >
      <Container as="div">
        {/* ── Desktop Category Navigation Strip ───────────────────────── */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {/* All Products Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory(null);
                setActiveSubCategory(null);
                setHoveredCategorySlug(null);
              }}
              className={`relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${activeCategoryId === null
                ? "bg-brand-charcoal text-white shadow-sm"
                : "text-brand-charcoal hover:bg-brand-soft-white"
                }`}
            >
              Tous les produits
            </button>

            {/* Category Tabs with hover mega-menu triggers */}
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              const isHovered = hoveredCategorySlug === cat.slug;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategorySlug(cat.slug)}
                  className="relative py-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setActiveSubCategory(null);
                      setHoveredCategorySlug(null);
                    }}
                    className={`flex items-center gap-1.5 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${isActive
                      ? "bg-brand-red text-white shadow-[0_4px_14px_-3px_rgba(227,6,19,0.5)]"
                      : isHovered
                        ? "bg-brand-soft-white text-brand-red"
                        : "text-brand-charcoal/80 hover:bg-brand-soft-white hover:text-brand-charcoal"
                      }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${isHovered ? "rotate-180 text-brand-red" : "text-brand-warm-gray"
                        }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
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

      {/* ── Desktop Mega Menu Dropdown Panel (Vistaprint Style) ─────── */}
      <AnimatePresence>
        {hoveredCategorySlug && currentHoveredCat && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 hidden border-b border-brand-light-gray/80 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.06)] lg:block"
          >
            <Container as="div" className="py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Left columns: Sub-Categories & Organized Sections */}
                <div className="col-span-8">
                  <h4 className="text-xs font-black uppercase tracking-wider text-brand-charcoal border-b border-brand-light-gray/60 pb-2 mb-4">
                    Sous-catégories {currentHoveredCat.name}
                  </h4>
                  {currentHoveredCat.subCategories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                      {currentHoveredCat.subCategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelectSub(currentHoveredCat.id, sub.id)}
                          className="group flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium text-brand-dark/75 transition-colors hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer"
                        >
                          <span className="group-hover:text-brand-red transition-colors flex items-center gap-1.5 line-clamp-1">
                            {sub.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-brand-warm-gray py-4">
                      Aucune sous-catégorie trouvée.
                    </div>
                  )}
                </div>

                {/* Right column: Promotional Showcase Card */}
                {(() => {
                  const categoryMainImage =
                    currentHoveredCat.image ||
                    (currentHoveredCat.images && currentHoveredCat.images.length > 0
                      ? currentHoveredCat.images[0]
                      : null) ||
                    "/lamsa2.png";

                  return (
                    <div className="col-span-4 border-l border-brand-light-gray/60 pl-8">
                      <div className="relative overflow-hidden rounded-2xl border border-brand-light-gray/70 bg-white p-6 shadow-sm flex flex-col h-full justify-center">
                        <h3 className="text-base font-black text-brand-charcoal text-center">
                          {currentHoveredCat.name}
                        </h3>
                        {currentHoveredCat.description && (
                          <p className="mt-2 text-xs text-brand-warm-gray leading-relaxed text-center">
                            {currentHoveredCat.description}
                          </p>
                        )}

                        <div className="relative mt-6 h-40 w-full overflow-hidden rounded-xl bg-brand-soft-white/60 border border-brand-light-gray/50 p-2.5 flex items-center justify-center">
                          <img
                            src={categoryMainImage}
                            alt={currentHoveredCat.name || "Catégorie"}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectSub(currentHoveredCat.id)}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] cursor-pointer"
                        >
                          <span>Explorer la catégorie</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Promotional Banner (Shown when no mega menu is active) ────── */}
      <AnimatePresence>
        {!hoveredCategorySlug && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block overflow-hidden"
          >
            <Container as="div" className="py-4">
              <AnnouncementCarousel className="mx-auto w-full max-w-7xl" />
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

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
    </nav>
  );
}
