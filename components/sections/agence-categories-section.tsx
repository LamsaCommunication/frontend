"use client";

import * as React from "react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
  X,
  ExternalLink,
  Eye
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { useCatalogStore } from "@/lib/store/useCatalogStore";

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
};

type Category = any; // Will be properly typed from store in inner component

// ── Professional Bento Gallery with Lightbox ──────────────────────────────

function BentoImageGrid({
  images,
  categoryId,
  categoryName,
}: {
  images: string[];
  categoryId: string;
  categoryName: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
  }, [categoryId]);

  const prev = useCallback(
    () => setActiveIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIdx((i) => (i + 1) % images.length),
    [images.length]
  );

  const prevLightbox = useCallback(
    () => setLightboxIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const nextLightbox = useCallback(
    () => setLightboxIdx((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") prevLightbox();
        if (e.key === "ArrowRight") nextLightbox();
        if (e.key === "Escape") setLightboxOpen(false);
      } else {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, prevLightbox, nextLightbox, lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-[#e8e8e8] bg-[#fafafa]">
        <div className="text-center">
          <Images
            className="mx-auto h-8 w-8 text-brand-dark/20"
            strokeWidth={1.5}
          />
          <p className="mt-2 text-xs font-medium text-brand-dark/40">
            Réalisations de cette catégorie en cours de numérisation
          </p>
        </div>
      </div>
    );
  }

  const openModal = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((imgSrc, idx) => (
          <motion.div
            key={`${categoryId}-${idx}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            onClick={() => openModal(idx)}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-[#ebebeb] bg-[#fbfaf8] p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-lg"
          >
            {/* Visual preview */}
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-white p-2">
              <img
                src={imgSrc}
                alt={`${categoryName} réalisation ${idx + 1}`}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                draggable={false}
              />
            </div>

            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 rounded-2xl">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-charcoal shadow-md">
                <Maximize2 className="h-3.5 w-3.5 text-brand-red" />
                <span>Agrandir</span>
              </div>
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-white/90 px-2.5 py-1.5 backdrop-blur-md shadow-xs">
              <span className="text-[11px] font-bold text-brand-charcoal truncate">
                {categoryName} #{idx + 1}
              </span>
              <span className="text-[9px] font-extrabold uppercase text-brand-red tracking-wider">
                Studio Lamsa
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Fullscreen Lightbox Modal ──────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 max-h-[85vh] max-w-4xl overflow-hidden rounded-3xl bg-white p-4 shadow-2xl"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-brand-light-gray pb-3 mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                    {categoryName}
                  </span>
                  <span className="text-xs font-bold text-brand-warm-gray">
                    Vue haute définition ({lightboxIdx + 1}/{images.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal hover:bg-brand-soft-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Large Image Frame */}
              <div className="relative aspect-[16/10] w-full max-h-[65vh] overflow-hidden rounded-2xl bg-[#fafafa] p-4 flex items-center justify-center">
                <img
                  src={images[lightboxIdx]}
                  alt="Aperçu haute résolution"
                  className="max-h-full max-w-full object-contain"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevLightbox}
                      aria-label="Image précédente"
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
                    >
                      <ChevronLeft className="h-5 w-5 text-brand-charcoal" />
                    </button>
                    <button
                      type="button"
                      onClick={nextLightbox}
                      aria-label="Image suivante"
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
                    >
                      <ChevronRight className="h-5 w-5 text-brand-charcoal" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Inner section (reads URL params) ──────────────────────────────────────

function AgenceCategoriesSectionInner() {
  const { categories: catalogCategories } = useCatalogStore();
  const searchParams = useSearchParams();
  const param = searchParams.get("category") ?? "";
  const defaultId = catalogCategories.length > 0 
    ? (catalogCategories.find((c) => c.slug === param)?.slug ?? catalogCategories[0].slug)
    : "";

  const [activeId, setActiveId] = useState<string>(defaultId);

  // If no categories loaded yet, show empty state or fallback
  if (catalogCategories.length === 0) {
    return <div className="py-20 text-center">Chargement des catégories...</div>;
  }

  const active = catalogCategories.find((c) => c.slug === activeId) || catalogCategories[0];
  const ActiveIcon = ICON_MAP[active?.icon] ?? Sparkles;

  const images = active?.images || [];
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
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
          className="-mx-6 mt-10 md:mx-0"
        >
          <div className="flex gap-2 overflow-x-auto px-6 pb-2 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0">
            {catalogCategories.map((category) => {
              const CatIcon = ICON_MAP[category.icon] ?? Sparkles;
              const isActive = category.slug === activeId;
              return (
                <button
                  key={category.slug}
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
              transition={{ duration: 0.3, ease: "easeOut" }}
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
                  <span className="hidden sm:inline-block rounded-full bg-brand-soft-white px-3 py-1 text-[11px] font-bold text-brand-warm-gray">
                    {images.length} visuels haute résolution
                  </span>
                </div>

                <BentoImageGrid
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
