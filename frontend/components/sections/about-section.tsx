"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { stats, site } from "@/lib/site";

export function AboutSection() {
  return (
    <section
      id="a-propos"
      className="relative w-full overflow-hidden bg-brand-soft-white py-20 md:py-28 lg:py-36"
    >
      <Container as="div" className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="À propos du studio"
              title={
                <>
                  Un studio créatif où chaque{" "}
                  <span className="text-brand-red">détail</span> compte.
                </>
              }
              description={
                <>
                  Lamsa Communication accompagne les marques, commerces et
                  événements qui veulent une communication visuelle forte,
                  cohérente et soignée. Du logo à la signalétique LED, en
                  passant par l&apos;impression personnalisée, nous concevons
                  des supports qui marquent les esprits.
                </>
              }
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="mt-10 space-y-6 text-base text-brand-dark/80 md:text-lg"
            >
              <p>
                Notre approche est simple : écouter, comprendre, créer. Nous
                travaillons main dans la main avec chaque client pour traduire
                son univers en supports concrets et impactants.
              </p>
              <p className="font-[cursive] text-2xl italic text-brand-red">
                « {site.tagline} »
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-3 gap-3 md:mt-14 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: 0.1 * index,
                  }}
                  className="border-l-2 border-brand-red pl-3 md:pl-6"
                >
                  <div className="heading-display text-2xl text-brand-charcoal sm:text-3xl md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-[10px] font-medium uppercase tracking-wider text-brand-dark/60 sm:text-xs md:text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div
                id="logo-about-anchor"
                className="scroll-logo-static relative flex h-full w-full items-center justify-center p-10 md:p-12"
              >
                <Image
                  src="/lamsa2.png"
                  alt="Lamsa Communication — logo"
                  width={400}
                  height={400}
                  sizes="(min-width: 1024px) 400px, 280px"
                  className="h-auto w-full max-w-[220px] object-contain md:max-w-[280px]"
                />
              </div>
              <div
                aria-hidden
                className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-red"
              />
            </div>

            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl border border-brand-red/20 bg-brand-soft-white md:block"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
