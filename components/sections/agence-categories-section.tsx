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
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { agenceCategories, categoryImages } from "@/lib/site";

const ICON_MAP: Record<string, React.ElementType> = {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
};

type Category = (typeof agenceCategories)[number];

// ── Bento image grid with integrated slider ────────────────────────────────

function BentoImageGrid({
  images,
  categoryId,
}: {
  images: string[];
  categoryId: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  if (images.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-[#e8e8e8] bg-[#fafafa]">
        <div className="text-center">
          <Images
            className="mx-auto h-8 w-8 text-brand-dark/20"
            strokeWidth={1.5}
          />
          <p className="mt-2 text-xs font-medium text-brand-dark/30">
            Réalisations à venir
          </p>
        </div>
      </div>
    );
  }

  // Show up to 2 thumbnail slots in the bento only when 3+ images exist
  const thumbIndices =
    images.length > 2
      ? images
          .map((_, i) => i)
          .filter((i) => i !== activeIdx)
          .slice(0, 2)
      : [];
  const useBento = thumbIndices.length === 2;

  return (
    <div
      className={`grid gap-3 ${
        useBento ? "lg:h-[420px] lg:grid-cols-[2fr_1fr] lg:grid-rows-2" : ""
      }`}
    >
      {/* Featured image */}
      <div
        className={`relative rounded-2xl bg-white ${
          useBento
            ? "aspect-[16/10] lg:aspect-auto lg:row-span-2"
            : "aspect-[16/9]"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={images[activeIdx]}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="h-full w-full object-contain"
            draggable={false}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            {/* Prev / next arrows */}
            <button
              onClick={prev}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-white"
            >
              <ChevronLeft
                className="h-4 w-4 text-brand-charcoal"
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={next}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-white"
            >
              <ChevronRight
                className="h-4 w-4 text-brand-charcoal"
                strokeWidth={2.5}
              />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                    i === activeIdx
                      ? "w-5 bg-white shadow-sm"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bento thumbnails — visible on desktop only */}
      {thumbIndices.map((imgIdx) => (
        <button
          key={imgIdx}
          onClick={() => setActiveIdx(imgIdx)}
          aria-label={`Voir image ${imgIdx + 1}`}
          className="group relative hidden cursor-pointer rounded-xl bg-white lg:block"
        >
          <img
            src={images[imgIdx]}
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/8" />
        </button>
      ))}
    </div>
  );
}

// ── Inner section (reads URL params) ──────────────────────────────────────

function AgenceCategoriesSectionInner() {
  const searchParams = useSearchParams();
  const param = searchParams.get("category") ?? "";
  const defaultId =
    agenceCategories.find((c) => c.id === param)?.id ?? agenceCategories[0].id;

  const [activeId, setActiveId] = useState<string>(defaultId);

  const active = agenceCategories.find((c) => c.id === activeId) as Category;
  const ActiveIcon = ICON_MAP[active.icon] ?? Sparkles;
  const images = categoryImages[activeId] ?? [];

  return (
    <section
      id="categories"
      className="relative w-full overflow-hidden bg-white py-20 md:py-28 lg:py-32"
    >
      {/* Subtle red ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[700px] rounded-full bg-brand-red/[0.055] blur-[120px]" />
      </div>

      <Container as="div" className="relative">
        <SectionHeader
          eyebrow="Nos services"
          title={
            <>
              Ce que nous{" "}
              <span className="text-brand-red">créons</span> pour vous.
            </>
          }
          description="Sélectionnez une catégorie pour découvrir les services associés."
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
            {agenceCategories.map((category) => {
              const CatIcon = ICON_MAP[category.icon] ?? Sparkles;
              const isActive = category.id === activeId;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveId(category.id)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border-brand-red bg-brand-red text-white shadow-[0_6px_20px_-6px_rgba(227,6,19,0.45)]"
                      : "border-brand-light-gray bg-white text-brand-dark/70 hover:border-brand-red/30 hover:text-brand-charcoal"
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
              className="overflow-hidden rounded-3xl border border-[#ebebeb] bg-white shadow-[0_4px_32px_-8px_rgba(0,0,0,0.07)]"
            >
              {/* ── Top: category info + services ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left — category header */}
                <div className="flex flex-col justify-between border-b border-[#ebebeb] p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fff8f8] shadow-[0_2px_12px_-4px_rgba(227,6,19,0.15)]">
                      <ActiveIcon
                        className="h-6 w-6 text-brand-red"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-charcoal">
                      {active.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-dark/65 md:text-base">
                      {active.description}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-1.5">
                    {active.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-soft-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-dark/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — services grid */}
                <div className="p-8 lg:col-span-8 lg:p-10">
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">
                    Ce que nous livrons
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {active.services.map((service, idx) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          ease: "easeOut",
                          delay: 0.04 * idx,
                        }}
                        className="flex gap-3 rounded-2xl border border-[#f0f0f0] bg-[#fafafa] p-4 transition-colors duration-200 hover:border-brand-red/15 hover:bg-[#fff8f8]"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand-red/70"
                          strokeWidth={2}
                        />
                        <div>
                          <p className="text-sm font-semibold text-brand-charcoal">
                            {service.name}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-brand-dark/55">
                            {service.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Bottom: Bento image slider ── */}
              <div className="border-t border-[#f0f0f0] px-8 py-8 lg:px-10">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-dark/40">
                  Nos réalisations
                </p>
                <BentoImageGrid images={images} categoryId={activeId} />
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
    <Suspense>
      <AgenceCategoriesSectionInner />
    </Suspense>
  );
}
