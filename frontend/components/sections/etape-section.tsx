"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Palette,
  Printer,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";

const GRID = {
  backgroundImage:
    "linear-gradient(to right, rgba(20,20,20,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,20,0.055) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

/* ─── Visuals ───────────────────────────────────────────────────────────────── */

function DiscoveryVisual() {
  return (
    <div className="relative w-full min-h-[300px] overflow-hidden rounded-3xl border border-brand-red/[0.07] bg-[#fdf8f8] p-6">
      <div aria-hidden className="absolute inset-0 opacity-[0.035]" style={GRID} />
      <div aria-hidden className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-brand-red/[0.08] blur-3xl" />
      <div className="relative flex flex-col gap-3.5 pt-2">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <div className="h-7 w-7 flex-shrink-0 rounded-full bg-brand-red/20" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-brand-charcoal/15" />
            <div className="h-1.5 w-1/2 rounded-full bg-brand-charcoal/[0.07]" />
          </div>
          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-brand-charcoal/[0.05]" />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full bg-brand-charcoal/10" />
            <div className="h-2.5 w-5/6 rounded-full bg-brand-charcoal/10" />
            <div className="h-2.5 w-3/5 rounded-full bg-brand-red/20" />
          </div>
        </div>
        <div className="ml-auto max-w-[72%] rounded-2xl bg-brand-red/[0.09] p-4 shadow-sm">
          <div className="space-y-2">
            <div className="h-2 w-28 rounded-full bg-brand-red/30" />
            <div className="h-2 w-20 rounded-full bg-brand-red/20" />
            <div className="h-2 w-16 rounded-full bg-brand-red/15" />
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-brand-red/10 bg-white px-4 py-3 shadow-sm">
          <div className="h-2 flex-1 rounded-full bg-brand-charcoal/10" />
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-brand-red/20" />
        </div>
      </div>
    </div>
  );
}

function DesignVisual() {
  return (
    <div className="relative w-full min-h-[300px] overflow-hidden rounded-3xl border border-brand-red/[0.07] bg-[#fdf8f8] p-6">
      <div aria-hidden className="absolute inset-0 opacity-[0.035]" style={GRID} />
      <div aria-hidden className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-brand-red/[0.06] blur-3xl" />
      <div className="relative pt-2">
        <div className="mb-5 flex items-center gap-2.5">
          {(
            [
              "bg-brand-red shadow-[0_4px_14px_-3px_rgba(227,6,19,0.45)]",
              "bg-brand-charcoal shadow-sm",
              "bg-[#e8e5e0] shadow-sm",
              "border border-[#ddd] bg-white shadow-sm",
            ] as const
          ).map((cls, i) => (
            <div key={i} className={`h-9 w-9 rounded-xl ${cls}`} />
          ))}
          <div className="ml-auto h-2 w-16 rounded-full bg-brand-charcoal/10" />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="h-3.5 w-32 rounded-full bg-brand-charcoal/70" />
            <div className="h-5 w-5 rounded-full bg-brand-red/15" />
          </div>
          <div className="mb-5 space-y-2">
            <div className="h-2 w-full rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-5/6 rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-2/3 rounded-full bg-brand-charcoal/[0.07]" />
          </div>
          <div className="flex gap-3">
            <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-brand-red/[0.12]" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <div className="h-2 w-full rounded-full bg-brand-charcoal/10" />
              <div className="h-2 w-4/5 rounded-full bg-brand-charcoal/10" />
              <div className="h-2 w-3/5 rounded-full bg-brand-charcoal/[0.07]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductionVisual() {
  const rows = [
    { done: true, pct: 100 },
    { done: false, pct: 62 },
    { done: false, pct: 0 },
  ] as const;
  return (
    <div className="relative w-full min-h-[300px] overflow-hidden rounded-3xl border border-brand-red/[0.07] bg-[#fdf8f8] p-6">
      <div aria-hidden className="absolute inset-0 opacity-[0.035]" style={GRID} />
      <div aria-hidden className="absolute right-6 top-6 h-28 w-28 rounded-full bg-brand-red/[0.06] blur-2xl" />
      <div className="relative space-y-3.5 pt-2">
        {rows.map((row, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                    row.done
                      ? "bg-brand-red shadow-[0_0_8px_rgba(227,6,19,0.45)]"
                      : row.pct > 0
                      ? "bg-brand-red/40"
                      : "bg-[#e0dbd5]"
                  }`}
                />
                <div className="h-2 w-28 rounded-full bg-brand-charcoal/15" />
              </div>
              <span className="font-mono text-[11px] tabular-nums font-medium text-brand-charcoal/35">
                {row.pct}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#ede8e3]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-red/80 to-brand-red"
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryVisual() {
  return (
    <div className="relative w-full min-h-[300px] overflow-hidden rounded-3xl border border-brand-red/[0.12] bg-[#fdf8f8] p-6">
      <div aria-hidden className="absolute inset-0 opacity-[0.035]" style={GRID} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(227,6,19,0.055) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex h-full min-h-[240px] flex-col items-center justify-center gap-7 py-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-brand-red/[0.05] ring-1 ring-brand-red/[0.09]" />
          <div className="absolute h-22 w-22 rounded-full bg-brand-red/[0.07] ring-1 ring-brand-red/[0.13]" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-red shadow-[0_8px_32px_-6px_rgba(227,6,19,0.55)]">
            <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-3 w-32 rounded-full bg-brand-charcoal/15" />
          <div className="h-2.5 w-24 rounded-full bg-brand-charcoal/10" />
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <React.Fragment key={i}>
              <div
                className={`rounded-full ${
                  i === 3
                    ? "h-3 w-3 bg-brand-red shadow-[0_0_10px_rgba(227,6,19,0.5)]"
                    : "h-2 w-2 bg-brand-red/25"
                }`}
              />
              {i < 3 && <div className="h-px w-8 bg-brand-red/20" />}
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

const TOPS = [
  "lg:top-[160px]",
  "lg:top-[180px]",
  "lg:top-[200px]",
  "lg:top-[220px]",
] as const;

export function EtapesSection() {
  return (
    <section
      id="etapes"
      className="relative w-full scroll-mt-16 pt-28 pb-10 md:pt-36 md:pb-0 lg:scroll-mt-20"
      style={{
        background: [
          "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(227,6,19,0.038) 0%, transparent 70%)",
          "linear-gradient(180deg, #ffffff 0%, #fdf8f8 5%, #fdf8f8 100%)",
        ].join(", "),
      }}
    >
      <Container as="div">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center md:mb-24"
        >
          <span className="label-eyebrow text-brand-red">
            Notre processus
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

        {/* Card stack */}
        <div className="flex flex-col gap-10 sm:gap-14 lg:gap-0 lg:pb-[220px]">
          {steps.map((step, index) => {
            const { Icon } = step;
            return (
              <div
                key={step.id}
                role="region"
                aria-label={`Étape ${step.number} — ${step.label}`}
                style={{ zIndex: (index + 1) * 10 }}
                className={[
                  "lg:sticky",
                  TOPS[index],
                  index > 0 ? "lg:-mt-[56px]" : "",
                ].join(" ")}
              >
                <motion.div
                  initial={{ opacity: 0, y: 36, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-56px" }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.06 * index,
                  }}
                  className="rounded-[2rem] border border-[#ede8e4] bg-white px-8 pb-14 pt-5 shadow-[0_6px_60px_-12px_rgba(0,0,0,0.09),0_2px_18px_-6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-brand-red/20 hover:shadow-[0_16px_80px_-16px_rgba(0,0,0,0.13)] md:px-14 md:pb-16 md:pt-6"
                >
                  {/* Peek strip — visible beneath the next stacked card */}
                  <div className="mb-8 flex h-8 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-black leading-none text-brand-red/30">
                        {step.number}
                      </span>
                      <span aria-hidden className="h-px w-4 bg-brand-red/20" />
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red/[0.09] ring-1 ring-brand-red/[0.12]">
                        <Icon className="h-3.5 w-3.5 text-brand-red" strokeWidth={1.8} />
                      </div>
                      <span className="rounded-full bg-brand-red/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-red/60">
                        {step.label}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="hidden select-none font-mono text-[10px] uppercase tracking-[0.22em] text-brand-charcoal/20 lg:block"
                    >
                      Étape {step.number}
                    </span>
                  </div>

                  {/* Main content */}
                  <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-18">
                    {/* Text — left on desktop, below visual on mobile */}
                    <div className="order-2 lg:order-1">
                      <h3 className="text-3xl font-black leading-[1.08] tracking-tight text-brand-charcoal sm:text-4xl md:text-[2.4rem]">
                        {step.title}
                      </h3>
                      <p className="mt-6 text-base leading-relaxed text-brand-dark/60 md:text-lg">
                        {step.description}
                      </p>
                    </div>
                    {/* Visual — right on desktop, above text on mobile */}
                    <div className="order-1 lg:order-2">{getVisual(step.id)}</div>
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
