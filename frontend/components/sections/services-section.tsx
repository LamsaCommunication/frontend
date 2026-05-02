"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Palette,
  Printer,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

const GRID = {
  backgroundImage:
    "linear-gradient(to right, rgba(20,20,20,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,20,0.07) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

/* ─── Visuals ───────────────────────────────────────────────────────────────── */

function DiscoveryVisual() {
  return (
    <div className="relative w-full min-h-[220px] overflow-hidden rounded-2xl border border-brand-red/[0.08] bg-[#fdf8f8] p-5">
      <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={GRID} />
      <div aria-hidden className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full bg-brand-red/20" />
          <div className="h-2 w-24 rounded-full bg-brand-charcoal/15" />
          <div className="ml-auto h-2 w-10 rounded-full bg-brand-charcoal/10" />
        </div>
        <div className="rounded-xl bg-white p-3.5 shadow-sm">
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-4/5 rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-3/5 rounded-full bg-brand-red/20" />
          </div>
        </div>
        <div className="ml-auto max-w-[75%] rounded-xl bg-brand-red/10 p-3 shadow-sm">
          <div className="space-y-1.5">
            <div className="h-2 w-28 rounded-full bg-brand-red/25" />
            <div className="h-2 w-20 rounded-full bg-brand-red/15" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-brand-red/10 bg-white px-3 py-2.5 shadow-sm">
          <div className="h-2 w-32 rounded-full bg-brand-charcoal/10" />
          <div className="ml-auto h-6 w-6 flex-shrink-0 rounded-full bg-brand-red/20" />
        </div>
      </div>
    </div>
  );
}

function DesignVisual() {
  return (
    <div className="relative w-full min-h-[220px] overflow-hidden rounded-2xl border border-brand-red/[0.08] bg-[#fdf8f8] p-5">
      <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={GRID} />
      <div aria-hidden className="absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-brand-red/[0.07] blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-red shadow-sm" />
          <div className="h-8 w-8 rounded-lg bg-brand-charcoal shadow-sm" />
          <div className="h-8 w-8 rounded-lg bg-[#e8e5e0] shadow-sm" />
          <div className="h-8 w-8 rounded-lg border border-[#e8e5e0] bg-white shadow-sm" />
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 h-3.5 w-28 rounded-full bg-brand-charcoal/80" />
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-5/6 rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-2/3 rounded-full bg-brand-charcoal/10" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-10 w-10 rounded-2xl bg-brand-red/15" />
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              <div className="h-2 w-full rounded-full bg-brand-charcoal/10" />
              <div className="h-2 w-3/4 rounded-full bg-brand-charcoal/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductionVisual() {
  const rows = [
    { width: "100%", done: true, pct: "100%" },
    { width: "62%", done: false, pct: "62%" },
    { width: "0%", done: false, pct: "0%" },
  ] as const;
  return (
    <div className="relative w-full min-h-[220px] overflow-hidden rounded-2xl border border-brand-red/[0.08] bg-[#fdf8f8] p-5">
      <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={GRID} />
      <div aria-hidden className="absolute right-4 top-4 h-20 w-20 rounded-full bg-brand-red/[0.07] blur-2xl" />
      <div className="relative space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-xl bg-white p-3.5 shadow-sm">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-2 w-2 flex-shrink-0 rounded-full ${
                    row.done ? "bg-brand-red" : row.pct !== "0%" ? "bg-brand-red/40" : "bg-[#e8e5e0]"
                  }`}
                />
                <div className="h-2 w-24 rounded-full bg-brand-charcoal/15" />
              </div>
              <span className="font-mono text-[10px] tabular-nums text-brand-charcoal/30">
                {row.pct}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#e8e5e0]/60">
              <div className="h-full rounded-full bg-brand-red/70" style={{ width: row.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryVisual() {
  return (
    <div className="relative w-full min-h-[220px] overflow-hidden rounded-2xl border border-brand-red/15 bg-[#fdf8f8] p-5">
      <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={GRID} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(227,6,19,0.05) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-5 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/[0.08] ring-[6px] ring-brand-red/[0.06]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red shadow-[0_6px_20px_-4px_rgba(227,6,19,0.45)]">
            <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-2.5 w-28 rounded-full bg-brand-charcoal/15" />
          <div className="h-2 w-20 rounded-full bg-brand-charcoal/10" />
        </div>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }, (_, i) => (
            <React.Fragment key={i}>
              <div className="h-2 w-2 rounded-full bg-brand-red" />
              {i < 3 && <div className="h-px w-5 bg-brand-red/25" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const steps: Array<{
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
}> = [
  {
    id: "discovery",
    number: "01",
    label: "Découverte",
    title: "Comprendre votre vision.",
    description:
      "Nous commençons par une écoute attentive. Vos objectifs, votre univers, votre audience — chaque détail façonne une communication qui vous ressemble vraiment.",
    Icon: Search,
  },
  {
    id: "design",
    number: "02",
    label: "Conception",
    title: "Donner vie à vos idées.",
    description:
      "Nos créatifs élaborent des propositions sur mesure : typographies, palettes, compositions — chaque élément est pensé pour marquer et séduire votre audience.",
    Icon: Palette,
  },
  {
    id: "production",
    number: "03",
    label: "Production",
    title: "Réaliser avec précision.",
    description:
      "De l'écran à l'impression, chaque support est produit avec les meilleures techniques et matériaux pour un rendu final irréprochable.",
    Icon: Printer,
  },
  {
    id: "delivery",
    number: "04",
    label: "Livraison",
    title: "Livrer l'excellence.",
    description:
      "Votre commande arrive dans les délais convenus, soigneusement emballée. Notre accompagnement ne s'arrête pas à la livraison.",
    Icon: CheckCircle2,
  },
];

function getVisual(id: string): React.ReactNode {
  switch (id) {
    case "discovery":  return <DiscoveryVisual />;
    case "design":     return <DesignVisual />;
    case "production": return <ProductionVisual />;
    default:           return <DeliveryVisual />;
  }
}

/* ─── sticky top offsets — 40 px apart so the peek strip is readable ────────── */
const TOPS = [
  "lg:top-[100px]",
  "lg:top-[140px]",
  "lg:top-[180px]",
  "lg:top-[220px]",
] as const;

/* ─── Section ───────────────────────────────────────────────────────────────── */

export function ServicesSection() {
  return (
    /*
     * NO overflow-hidden on this element.
     * overflow:hidden creates a new scroll-container and makes
     * position:sticky children stick to the section, not the viewport.
     */
    <section
      id="services"
      className="relative w-full py-24 md:py-32"
      style={{
        background:
          "radial-gradient(ellipse 100% 55% at 50% 0%, rgba(227,6,19,0.045) 0%, transparent 60%), #ffffff",
      }}
    >
      <Container as="div">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center md:mb-20"
        >
          <span className="label-eyebrow text-brand-red">
            <span className="block h-px w-8 bg-brand-red" aria-hidden />
            Notre processus
            <span className="block h-px w-8 bg-brand-red" aria-hidden />
          </span>
          <h2 className="heading-section mt-5 text-[clamp(2.2rem,5vw,3.8rem)] text-brand-charcoal">
            De l&apos;idée à la{" "}
            <span className="text-brand-red">réalisation</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-brand-dark/60 md:text-lg">
            Un processus éprouvé en 4 étapes pour des résultats toujours
            au-delà de vos attentes.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 lg:gap-0 lg:pb-[180px]">
          {steps.map((step, index) => {
            const { Icon } = step;
            return (
              <div
                key={step.id}
                style={{ zIndex: (index + 1) * 10 }}
                className={[
                  "lg:sticky",
                  TOPS[index],
                  index > 0 ? "lg:-mt-[64px]" : "",
                ].join(" ")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1 * index,
                  }}
                  className="rounded-3xl border border-[#f0e8e8] bg-white px-8 pb-12 pt-3 shadow-[0_4px_48px_-14px_rgba(0,0,0,0.1)] transition-all duration-300 hover:border-brand-red/15 hover:shadow-[0_12px_60px_-16px_rgba(0,0,0,0.15)] md:px-12 md:pb-16"
                >
                  <div className="mb-6 flex h-7 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-black leading-none text-brand-red/25">
                        {step.number}
                      </span>
                      <span aria-hidden className="h-px w-3 bg-brand-red/20" />
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red/[0.08]">
                        <Icon className="h-3.5 w-3.5 text-brand-red" strokeWidth={1.8} />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-dark/40">
                        {step.label}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="hidden select-none font-mono text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/20 lg:block"
                    >
                      Étape {step.number}
                    </span>
                  </div>

                  {/* Main content — below the peek strip */}
                  <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                    <div>
                      <h3 className="text-2xl font-black leading-[1.1] tracking-tight text-brand-charcoal sm:text-3xl md:text-[2.15rem]">
                        {step.title}
                      </h3>
                      <p className="mt-5 text-base leading-relaxed text-brand-dark/65 md:text-lg">
                        {step.description}
                      </p>
                    </div>
                    <div>{getVisual(step.id)}</div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
