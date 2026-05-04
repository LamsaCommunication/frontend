"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
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
  ImageIcon,
  X,
  ZoomIn,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { agenceCategories, agenceProjects } from "@/lib/site";
import type { AgenceProject } from "@/lib/site";

const ICON_MAP: Record<string, React.ElementType> = {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
};

type Category = (typeof agenceCategories)[number];

// ── Quick view modal ───────────────────────────────────────────────────────

function ProjectQuickView({
  project,
  category,
  onClose,
}: {
  project: AgenceProject;
  category: Category;
  onClose: () => void;
}) {
  const gallery = [project.image, ...(project.images ?? [])].filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end p-3 pb-6 md:items-center md:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-[6px]" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 56 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="relative z-10 mx-auto flex max-h-[84dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:max-h-[88dvh] md:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex shrink-0 justify-center pb-1 pt-3 md:hidden">
          <div className="h-[3px] w-10 rounded-full bg-brand-charcoal/12" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between px-5 py-4 md:px-8 md:py-5">
          <div className="min-w-0 flex-1 pr-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red">
              {category.name}
            </span>
            <h3 className="mt-1 text-lg font-bold leading-snug text-brand-charcoal md:text-xl">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="ml-4 mt-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f5f5f5] text-brand-charcoal/55 transition-colors hover:bg-[#ebebeb] hover:text-brand-charcoal"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px shrink-0 bg-[#f0f0f0]" />

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery */}
            <div className="bg-[#f8f8f8] p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#efefef] md:aspect-square">
                <AnimatePresence mode="wait">
                  {gallery[activeIdx] ? (
                    <motion.img
                      key={activeIdx}
                      src={gallery[activeIdx]}
                      alt={project.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon
                        className="h-10 w-10 text-brand-dark/20"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                        activeIdx === idx
                          ? "ring-2 ring-brand-red ring-offset-2"
                          : "opacity-50 hover:opacity-85"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-5 md:p-7">
              {project.description && (
                <p className="text-sm leading-[1.75] text-brand-dark/65">
                  {project.description}
                </p>
              )}
              {category.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f5f5f5] px-3 py-1 text-[11px] font-medium text-brand-dark/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project card ───────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: AgenceProject;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.04 * index }}
      onClick={onClick}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-8px_rgba(0,0,0,0.13)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon
              className="h-6 w-6 text-brand-dark/20"
              strokeWidth={1.5}
            />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/22">
          <div className="flex h-10 w-10 translate-y-1 scale-90 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 text-brand-charcoal" strokeWidth={2} />
          </div>
        </div>
      </div>
      <div className="px-3 py-3">
        <p className="truncate text-[11px] font-semibold text-brand-charcoal">
          {project.title}
        </p>
        {project.description && (
          <p className="mt-0.5 truncate text-[10px] text-brand-dark/40">
            {project.description}
          </p>
        )}
      </div>
    </motion.button>
  );
}

// ── Inner section (reads URL params) ──────────────────────────────────────

function AgenceCategoriesSectionInner() {
  const searchParams = useSearchParams();
  const param = searchParams.get("category") ?? "";
  const defaultId =
    agenceCategories.find((c) => c.id === param)?.id ?? agenceCategories[0].id;

  const [activeId, setActiveId] = useState<string>(defaultId);
  const [selectedProject, setSelectedProject] =
    useState<AgenceProject | null>(null);

  const active = agenceCategories.find((c) => c.id === activeId) as Category;
  const ActiveIcon = ICON_MAP[active.icon] ?? Sparkles;
  const projects = agenceProjects[activeId] ?? [];

  return (
    <>
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

                {/* ── Bottom: project gallery ── */}
                {projects.length > 0 && (
                  <div className="border-t border-[#f0f0f0] px-8 py-8 lg:px-10">
                    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-dark/40">
                      Nos réalisations
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {projects.map((project, idx) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={idx}
                          onClick={() => setSelectedProject(project)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </section>

      {/* Quick view modal — rendered outside section to avoid stacking context issues */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectQuickView
            project={selectedProject}
            category={active}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
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
