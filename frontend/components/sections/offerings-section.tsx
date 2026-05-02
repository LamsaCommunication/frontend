"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Pencil, Printer, Palette, Zap, Sparkles, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={`group flex flex-col rounded-3xl border border-[#ebebeb] bg-white p-6 shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function DesignVisual() {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fff8f8]">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="absolute -bottom-6 left-6 h-24 w-24 rounded-full bg-brand-red/10 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative flex w-full items-center gap-5">
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-full rounded-full bg-brand-red/25" />
            <div className="h-2 w-5/6 rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-3/5 rounded-full bg-brand-charcoal/10" />
            <div className="mt-3 flex gap-2">
              <div className="h-7 w-7 rounded-lg bg-brand-red/25" />
              <div className="h-7 w-7 rounded-lg bg-brand-charcoal/10" />
              <div className="h-7 w-7 rounded-lg bg-brand-red/15" />
            </div>
          </div>
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-md">
            <Pencil className="h-7 w-7 text-brand-red" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintVisual() {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f5f5] to-[#fafafa]">
      <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-brand-charcoal/[0.08] blur-3xl" />
      <div className="absolute bottom-0 right-4 h-24 w-32 rounded-full bg-brand-charcoal/[0.06] blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center px-10">
        <div className="relative w-full">
          <div className="absolute top-4 left-3 right-0 h-12 rounded-xl bg-brand-charcoal/[0.08]" />
          <div className="absolute top-2 left-1.5 right-0 h-12 rounded-xl bg-brand-charcoal/[0.12]" />
          <div className="relative flex h-12 items-center justify-between rounded-xl bg-white px-4 shadow-md">
            <div className="flex items-center gap-3">
              <Printer className="h-5 w-5 text-brand-charcoal/50" strokeWidth={1.5} />
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-red/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-brand-charcoal/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-brand-red/25" />
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-brand-charcoal/30">
              Print
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeonVisual() {
  return (
    <div className="relative h-32 overflow-hidden rounded-2xl bg-[#111]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(227,6,19,0.6) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap
          className="h-10 w-10 text-brand-red"
          strokeWidth={1.5}
          style={{ filter: "drop-shadow(0 0 14px rgba(227,6,19,0.85))" }}
        />
      </div>
    </div>
  );
}

function IconVisual({
  icon: Icon,
  from,
  to,
  iconColor,
  blobColor,
}: {
  icon: React.ElementType;
  from: string;
  to: string;
  iconColor: string;
  blobColor: string;
}) {
  return (
    <div
      className="relative h-32 overflow-hidden rounded-2xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl"
        style={{ background: blobColor }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className={`h-7 w-7 ${iconColor}`} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export function OfferingsSection() {
  return (
    <section
      id="offres"
      className="w-full bg-white py-20 md:py-28 lg:py-32"
    >
      <Container as="div">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="label-eyebrow text-brand-red">
            <span className="block h-px w-8 bg-brand-red" aria-hidden />
            Notre offre
            <span className="block h-px w-8 bg-brand-red" aria-hidden />
          </span>
          <h2 className="heading-section mt-5 text-3xl text-brand-charcoal sm:text-4xl md:text-5xl">
            Ce que nous{" "}
            <span className="text-brand-red">offrons</span>.
          </h2>
          <p className="mt-4 text-base text-brand-dark/60 md:text-lg">
            Une expertise complète pour transformer votre communication visuelle.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 md:mt-16">

          {/* Card 1 — Design Graphique (large) */}
          <BentoCard delay={0} className="sm:col-span-1 lg:col-span-3">
            <DesignVisual />
            <div className="mt-6 flex-1">
              <h3 className="text-xl font-bold text-brand-charcoal">
                Design Graphique
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-dark/65 md:text-base">
                Affiches, flyers, cartes de visite, brochures — des créations
                qui{" "}
                <span className="font-semibold text-brand-red">marquent</span>{" "}
                les esprits.
              </p>
            </div>
          </BentoCard>

          {/* Card 2 — Impression & Production (large) */}
          <BentoCard delay={0.08} className="sm:col-span-1 lg:col-span-3">
            <PrintVisual />
            <div className="mt-6 flex-1">
              <h3 className="text-xl font-bold text-brand-charcoal">
                Impression & Production
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-dark/65 md:text-base">
                Stickers, étiquettes, packaging, impressions sur mesure — du{" "}
                <span className="font-semibold text-brand-red">premium</span> à
                chaque commande.
              </p>
            </div>
          </BentoCard>

          {/* Card 3 — Identité Visuelle (small) */}
          <BentoCard delay={0.12} className="sm:col-span-1 lg:col-span-2">
            <IconVisual
              icon={Palette}
              from="#fef2f2"
              to="#fff"
              iconColor="text-brand-red"
              blobColor="rgba(227,6,19,0.2)"
            />
            <div className="mt-5 flex-1">
              <h3 className="text-base font-bold text-brand-charcoal">
                Identité Visuelle
              </h3>
              <p className="mt-1.5 text-sm text-brand-dark/65">
                Logo, charte graphique et univers cohérent.
              </p>
            </div>
          </BentoCard>

          {/* Card 4 — Neon LED (small) */}
          <BentoCard delay={0.16} className="sm:col-span-1 lg:col-span-2">
            <NeonVisual />
            <div className="mt-5 flex-1">
              <h3 className="text-base font-bold text-brand-charcoal">
                Enseignes Neon LED
              </h3>
              <p className="mt-1.5 text-sm text-brand-dark/65">
                Des enseignes lumineuses qui illuminent votre espace.
              </p>
            </div>
          </BentoCard>

          {/* Card 5 — Commandes Sur Mesure (small, full on sm) */}
          <BentoCard delay={0.2} className="sm:col-span-2 lg:col-span-2">
            <IconVisual
              icon={Sparkles}
              from="#f5f5f5"
              to="#fafafa"
              iconColor="text-brand-charcoal/60"
              blobColor="rgba(20,20,20,0.12)"
            />
            <div className="mt-5 flex-1">
              <h3 className="text-base font-bold text-brand-charcoal">
                Commandes Sur Mesure
              </h3>
              <p className="mt-1.5 text-sm text-brand-dark/65">
                Chaque projet est unique — nous créons selon vos besoins.
              </p>
            </div>
          </BentoCard>
        </div>
      </Container>
    </section>
  );
}
