"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Palette,
  Printer,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const steps: Array<{
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  image: string;
  imageAlt: string;
}> = [
  {
    id: "discovery",
    number: "01",
    label: "Découverte",
    title: "Comprendre votre vision.",
    description:
      "Nous commençons par une écoute attentive. Vos objectifs, votre univers, votre audience — chaque détail façonne une communication qui vous ressemble vraiment.",
    Icon: Search,
    image: "/comprendre_votre_vision_hero.svg",
    imageAlt: "Comprendre votre vision",
  },
  {
    id: "design",
    number: "02",
    label: "Conception",
    title: "Donner vie à vos idées.",
    description:
      "Nos créatifs élaborent des propositions sur mesure : typographies, palettes, compositions — chaque élément est pensé pour marquer et séduire votre audience.",
    Icon: Palette,
    image: "/donner_vie_vos_idees_hero.svg",
    imageAlt: "Donner vie à vos idées",
  },
  {
    id: "production",
    number: "03",
    label: "Production",
    title: "Réaliser avec précision.",
    description:
      "De l'écran à l'impression, chaque support est produit avec les meilleures techniques et matériaux pour un rendu final irréprochable.",
    Icon: Printer,
    image: "/realiser_avec_precision_hero.svg",
    imageAlt: "Réaliser avec précision",
  },
  {
    id: "delivery",
    number: "04",
    label: "Livraison",
    title: "Livrer l'excellence.",
    description:
      "Votre commande arrive dans les délais convenus, soigneusement emballée. Notre accompagnement ne s'arrête pas à la livraison.",
    Icon: CheckCircle2,
    image: "/livrer_excellence_hero.svg",
    imageAlt: "Livrer l'excellence",
  },
];

const TOPS = [
  "lg:top-[160px]",
  "lg:top-[180px]",
  "lg:top-[200px]",
  "lg:top-[220px]",
] as const;

/* ─── Section ───────────────────────────────────────────────────────────────── */

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
          <span className="label-eyebrow text-brand-red">Notre processus</span>
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
                  {/* Peek strip */}
                  <div className="mb-8 flex h-8 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-black leading-none text-brand-red/30">
                        {step.number}
                      </span>
                      <span aria-hidden className="h-px w-4 bg-brand-red/20" />
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red/[0.09] ring-1 ring-brand-red/[0.12]">
                        <Icon
                          className="h-3.5 w-3.5 text-brand-red"
                          strokeWidth={1.8}
                        />
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
                    <div className="order-1 lg:order-2">
                      <div className="relative w-full min-h-[300px] overflow-hidden rounded-3xl border border-brand-red/[0.07] bg-[#fdf8f8]">
                        <Image
                          src={step.image}
                          alt={step.imageAlt}
                          width={520}
                          height={380}
                          loading="lazy"
                          unoptimized
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
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
