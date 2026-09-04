"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
  Folder,
  Package,
  Layers,
  Tag,
  Box,
  ShoppingBag,
  CheckCircle2,
  Images,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { useCatalogStore } from "@/lib/store/useCatalogStore";

const EASE = [0.22, 1, 0.36, 1] as const;

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
  Folder,
  Package,
  Layers,
  Tag,
  Box,
  ShoppingBag,
};

// ── Horizontal Slideshow Carousel ─────────────────────────────────────────────

function CategoryImageGallery({
  images,
  categoryId,
  categoryName,
}: {
  images: string[];
  categoryId: string;
  categoryName: string;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = left, -1 = right
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // How many slides to show (controlled via CSS, logically we track one "page" at a time)
  const VISIBLE = 3; // desktop
  // Total pages = ceil(total / VISIBLE) but we scroll one image at a time for smoothness
  const total = images.length;

  // Reset on category change
  useEffect(() => {
    setCurrent(0);
    setDirection(1);
  }, [categoryId]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  // Auto-advance every 4s
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setTimeout(goNext, 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isPaused, goNext, total]);

  if (total === 0) {
    return (
      <div className="flex h-52 items-center justify-center rounded-3xl border border-dashed border-[#e8e8e8] bg-[#fafafa]">
        <div className="text-center">
          <Images className="mx-auto h-8 w-8 text-brand-dark/20" strokeWidth={1.5} />
          <p className="mt-2 text-xs font-medium text-brand-dark/40">
            Réalisations en cours de numérisation
          </p>
        </div>
      </div>
    );
  }

  // Build a window of 3 consecutive images starting at `current`
  const visibleImages = Array.from({ length: Math.min(VISIBLE, total) }, (_, i) => ({
    src: images[(current + i) % total],
    globalIdx: (current + i) % total,
  }));

  const variants = {
    enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
  };

  return (
    <div
      className="space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel track */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`grid gap-3 ${total === 1
              ? "grid-cols-1"
              : total === 2
                ? "grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
          >
            {visibleImages.map(({ src, globalIdx }) => (
              <div
                key={`${categoryId}-${globalIdx}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-[#ebebeb]"
              >
                {/* Image — shown at natural proportions, no crop */}
                <div className="flex aspect-[4/3] items-center justify-center p-4">
                  <img
                    src={src}
                    alt={`${categoryName} — réalisation ${globalIdx + 1}`}
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                  />
                </div>

                {/* Bottom label strip */}
                <div className="flex items-center justify-center border-t border-[#f0f0f0] px-3 py-2">
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-brand-red">
                    Lamsa Communication
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows — only if more than VISIBLE images */}
        {total > VISIBLE && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Précédent"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-[#e8e8e8] transition-all duration-200 hover:border-brand-red/30 hover:shadow-lg hover:scale-105"
            >
              <ChevronLeft className="h-4 w-4 text-brand-charcoal" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Suivant"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-[#e8e8e8] transition-all duration-200 hover:border-brand-red/30 hover:shadow-lg hover:scale-105"
            >
              <ChevronRight className="h-4 w-4 text-brand-charcoal" />
            </button>
          </>
        )}
      </div>

    </div>
  );
}

// ── Inner section (reads URL params) ──────────────────────────────────────

function AgenceCategoriesSectionInner() {
  const { categories: catalogCategories, fetchCatalog } = useCatalogStore();
  const searchParams = useSearchParams();
  const param = searchParams.get("category") ?? "";

  // Always refresh catalog on mount so DB changes in Admin are synced
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const [activeId, setActiveId] = useState<string>("");
  const initialized = useRef(false);

  useEffect(() => {
    if (catalogCategories.length === 0) return;
    if (initialized.current) return;
    initialized.current = true;

    if (param && catalogCategories.some((c) => c.slug === param || c.id === param)) {
      const found = catalogCategories.find((c) => c.slug === param || c.id === param);
      setActiveId(found?.slug ?? catalogCategories[0].slug);
    } else {
      setActiveId(catalogCategories[0].slug);
    }
  }, [catalogCategories, param]);

  // If loading and no categories loaded yet
  if (catalogCategories.length === 0) {
    return (
      <section id="categories" className="py-20 md:py-32 text-center">
        <Container as="div">
          <div className="animate-pulse space-y-4">
            <div className="mx-auto h-8 w-48 rounded-full bg-neutral-200" />
            <div className="mx-auto h-12 w-96 rounded-2xl bg-neutral-200/80" />
            <div className="mt-12 h-96 w-full rounded-3xl bg-neutral-100" />
          </div>
        </Container>
      </section>
    );
  }

  const active =
    catalogCategories.find((c) => c.slug === activeId || c.id === activeId) ||
    catalogCategories[0];
  const ActiveIcon = ICON_MAP[active?.icon] ?? Sparkles;

  // Retrieve all realization images with fallback to single pinned image
  const rawImages = active?.images && active.images.length > 0
    ? active.images
    : (active?.image ? [active.image] : []);
  const images = rawImages.filter(Boolean);

  const categoryName = active?.name || "";
  const categoryDescription = active?.description || "";
  const services = active?.services || [];

  return (
    <section
      id="categories"
      className="relative w-full overflow-hidden py-20 md:py-28 lg:py-32"
    >
      {/* Subtle red ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[700px] rounded-full bg-brand-red/[0.04] blur-[120px]" />
      </div>

      <Container as="div" className="relative">
        <SectionHeader
          eyebrow="Expertises & Réalisations"
          title={
            <>
              Ce que nous <span className="text-brand-red">créons</span> pour vous.
            </>
          }
          description="Sélectionnez une catégorie pour découvrir nos livrables et nos réalisations réelles en atelier."
          align="center"
        />

        {/* Category tab pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
          className="-mx-6 mt-10 md:mx-0"
        >
          <div className="flex gap-2 overflow-x-auto px-6 pb-2 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0">
            {catalogCategories.map((category) => {
              const CatIcon = ICON_MAP[category.icon] ?? Sparkles;
              const isActive = category.slug === activeId;
              return (
                <button
                  key={category.slug || category.id}
                  onClick={() => setActiveId(category.slug)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                    ? "border-brand-red bg-brand-red text-white shadow-[0_6px_20px_-6px_rgba(227,6,19,0.45)]"
                    : "border-brand-light-gray bg-white text-brand-dark/70 hover:border-brand-red/30 hover:text-brand-charcoal shadow-xs"
                    }`}
                >
                  <CatIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content panel */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden rounded-3xl border border-[#ebebeb] bg-white shadow-[0_4px_32px_-8px_rgba(0,0,0,0.06)]"
            >
              {/* ── Top: category info + services ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left — category header */}
                <div className="flex flex-col justify-center border-b border-[#ebebeb] p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10 bg-gradient-to-b from-[#faf9f6]/50 to-white">
                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fff8f8] shadow-[0_2px_12px_-4px_rgba(227,6,19,0.15)] border border-brand-red/10">
                      <ActiveIcon
                        className="h-6 w-6 text-brand-red"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-2xl font-black text-brand-charcoal">
                      {categoryName}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-dark/65 md:text-base">
                      {categoryDescription}
                    </p>
                  </div>
                </div>

                {/* Right — services grid */}
                <div className="p-8 lg:col-span-8 lg:p-10">
                  <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">
                    Nos engagements & livrables
                  </p>
                  {services.length === 0 ? (
                    <p className="text-xs text-brand-warm-gray italic">
                      Aucun livrable configuré pour cette catégorie.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {services.map((service, idx) => (
                        <motion.div
                          key={service.id || idx}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: "easeOut",
                            delay: 0.04 * idx,
                          }}
                          className="flex gap-3 rounded-2xl border border-[#f0f0f0] bg-[#fafafa] p-4 transition-colors duration-200 hover:border-brand-red/20 hover:bg-[#fff8f8]"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-red"
                            strokeWidth={2}
                          />
                          <div>
                            <p className="text-sm font-bold text-brand-charcoal">
                              {service.name}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-brand-dark/60">
                              {service.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Bottom: High-End Realizations Showcase ── */}
              <div className="border-t border-[#f0f0f0] px-8 py-8 lg:px-10 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-brand-charcoal">
                      Nos réalisations — {active.name}
                    </h4>
                    <p className="text-xs text-brand-warm-gray mt-0.5">
                      Aperçu de nos projets récents livrés à nos clients à travers l&apos;Algérie.
                    </p>
                  </div>
                </div>

                <CategoryImageGallery
                  images={images}
                  categoryId={activeId}
                  categoryName={categoryName}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

// ── Public export — Suspense required for useSearchParams ─────────────────

export function AgenceCategoriesSection() {
  return (
    <Suspense fallback={null}>
      <AgenceCategoriesSectionInner />
    </Suspense>
  );
}
