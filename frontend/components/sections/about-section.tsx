"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { stats } from "@/lib/site";

export function AboutSection() {
  return (
    <section
      id="a-propos"
      className="relative w-full bg-white py-20 md:py-28 lg:py-36"
    >
      <Container as="div">
        {/* Header block — constrained for readability */}
        <div className="max-w-2xl">
          <SectionHeader
            eyebrow="À propos de l'agence"
            title={
              <>
                Une agence créative où chaque{" "}
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
        </div>

        {/* Body text + signature */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-10 max-w-xl"
        >
          <p className="text-base leading-[1.8] text-brand-dark/70 md:text-lg">
            Notre approche est simple : écouter, comprendre, créer. Nous
            travaillons main dans la main avec chaque client pour traduire
            son univers en supports concrets et impactants.
          </p>

          {/* Signature — visual separation above */}
          <div className="mt-8 border-t border-brand-light-gray/70 pt-6">
            <img
              src="/logoFOOTER.avif"
              alt="C'est aussi simple que ça"
              loading="lazy"
              decoding="async"
              className="h-auto w-[170px] object-contain opacity-80 md:w-[210px]"
            />
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-3 gap-6 border-t border-brand-light-gray pt-14 md:gap-10 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
                delay: 0.08 * index,
              }}
              className="border-l-2 border-brand-red pl-4 md:pl-5"
            >
              <div className="heading-display text-3xl text-brand-charcoal sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-dark/50 sm:text-xs">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
