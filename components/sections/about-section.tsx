"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { stats } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutSection() {
  return (
    <section
      id="a-propos"
      className="relative w-full bg-white pb-10 pt-20 md:pb-12 md:pt-28 lg:pb-14 lg:pt-32"
    >
      <Container as="div">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-20">
          {/* ── Left: text block ── */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <span className="label-eyebrow text-brand-red">
                À propos de l&apos;agence
              </span>
              <h2 className="heading-section mt-5 text-3xl text-brand-charcoal sm:text-4xl md:text-5xl">
                Une agence créative où chaque{" "}
                <span className="text-brand-red">détail</span> compte.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
              className="mt-7 space-y-4"
            >
              <p className="text-base leading-[1.85] text-brand-dark/70 md:text-[1.0625rem]">
                Lamsa Communication accompagne les marques, commerces et
                événements qui veulent une communication visuelle forte,
                cohérente et soignée. Du logo à la signalétique LED, en
                passant par l&apos;impression personnalisée, nous concevons
                des supports qui marquent les esprits.
              </p>
              <p className="text-base leading-[1.85] text-brand-dark/55 md:text-[1.0625rem]">
                Notre approche est simple : écouter, comprendre, créer. Nous
                travaillons main dans la main avec chaque client pour traduire
                son univers en supports concrets et impactants.
              </p>
            </motion.div>

          </div>

          {/* ── Right: stats ── */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-0 lg:divide-y lg:divide-brand-light-gray/50">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    ease: EASE,
                    delay: 0.1 + 0.1 * index,
                  }}
                  className="lg:py-7 lg:first:pt-0 lg:last:pb-0 "
                >
                  <div className="text-3xl font-bold text-brand-charcoal sm:text-4xl lg:text-[2.75rem] lg:leading-none text-brand-red">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.15em] text-brand-dark/45 sm:text-xs">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
