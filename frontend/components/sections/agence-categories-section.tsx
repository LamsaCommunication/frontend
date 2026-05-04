"use client";

import * as React from "react";
import { useState, Suspense } from "react";
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

// ── Project card ───────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
}: {
  project: AgenceProject;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.04 * index }}
      className="group relative overflow-hidden rounded-2xl bg-brand-soft-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#f5f5f5]">
            <ImageIcon
              className="h-5 w-5 text-brand-dark/20"
              strokeWidth={1.5}
            />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-charcoal/0 p-4 transition-all duration-300 group-hover:bg-brand-charcoal/55">
          <p className="translate-y-2 text-center text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {project.title}
          </p>
          {project.description && (
            <p className="mt-1 translate-y-2 text-center text-[10px] leading-snug text-white/75 opacity-0 transition-all duration-300 [transition-delay:30ms] group-hover:translate-y-0 group-hover:opacity-100">
              {project.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-3 py-2.5">
        <p className="truncate text-xs font-semibold text-brand-charcoal">
          {project.title}
        </p>
        {project.description && (
          <p className="mt-0.5 truncate text-[10px] text-brand-dark/50">
            {project.description}
          </p>
        )}
      </div>
    </motion.div>
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
  const projects = agenceProjects[activeId] ?? [];

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

              {/* ── Bottom: project gallery (rendered only when projects exist) ── */}
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
