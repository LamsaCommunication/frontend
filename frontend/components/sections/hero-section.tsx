"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social-icons";

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * CTA buttons — rendered twice (desktop inline / mobile standalone)
 * to achieve: title → logo → buttons order on mobile.
 */
function CTAButtons() {
  return (
    <>
      <a
        href={site.whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-8px_rgba(227,6,19,0.4)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_14px_42px_-10px_rgba(227,6,19,0.55)] active:scale-[0.98] cursor-pointer lg:px-7 lg:py-3.5"
      >
        <WhatsAppIcon className="h-4 w-4 flex-shrink-0" title="WhatsApp" />
        Demander un devis
        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
      <Link
        href="#offres"
        className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-charcoal/20 bg-transparent px-6 py-3 text-sm font-semibold text-brand-charcoal transition-all duration-200 hover:border-brand-charcoal/45 hover:bg-brand-charcoal/[0.04] cursor-pointer lg:px-7 lg:py-3.5"
      >
        Découvrir nos services
        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </>
  );
}

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative isolate w-full scroll-mt-16 overflow-hidden bg-white text-brand-charcoal lg:scroll-mt-20"
    >
      <Container
        as="div"
        className="relative z-10 pb-8 pt-12 md:pb-16 md:pt-22"
      >
        {/*
         * Three-child grid: order-1 (text) → order-2 (logo) → order-3 (mobile buttons).
         * Desktop collapses order-3 (lg:hidden) and shows buttons inside order-1.
         */}
        <div className="grid grid-cols-1 items-center gap-y-5 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {/* ── 1. Heading column ───────────────────────────────────── */}
          <div className="order-1 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red"
            >
              Studio communication
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="text-[clamp(2.4rem,5.5vw,4.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-brand-charcoal"
            >
              Démarquez-vous
              <br className="hidden lg:block" />
              {" "}de vos{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.6, ease: EASE }}
                className="inline-flex items-center gap-2.5 align-middle lg:ml-4 lg:-translate-y-[0.1em] lg:gap-3"
              >
                <span className="inline-flex items-baseline gap-1 lg:gap-1.5">
                  <span className="text-sm font-semibold leading-none text-brand-red lg:text-base lg:font-bold">+800</span>
                  <span className="text-[11px] font-medium leading-none text-brand-charcoal/45 lg:text-[10px] lg:font-medium lg:uppercase lg:tracking-wide lg:opacity-60">projets</span>
                </span>
                <span aria-hidden className="inline-block h-3 w-px self-center bg-brand-charcoal/15 lg:h-4" />
                <span className="inline-flex items-baseline gap-1 lg:gap-1.5">
                  <span className="text-sm font-semibold leading-none text-brand-red lg:text-base lg:font-bold">+500</span>
                  <span className="text-[11px] font-medium leading-none text-brand-charcoal/45 lg:text-[10px] lg:font-medium lg:uppercase lg:tracking-wide lg:opacity-60">clients</span>
                </span>
              </motion.span>
              <br className="hidden lg:block" />
              {" "}
              <span className="text-brand-red">concurrents.</span>
            </motion.h1>

            {/* Desktop-only buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.4, ease: EASE }}
              className="mt-9 hidden items-center gap-3 lg:flex"
            >
              <CTAButtons />
            </motion.div>
          </div>

          {/* ── 2. Logo ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.28, ease: EASE }}
            className="order-2 mx-auto w-full max-w-[280px] sm:max-w-[340px] lg:col-span-5 lg:mx-0 lg:max-w-none"
          >
            <div className="relative flex items-center justify-center py-2 lg:py-0">
              <div
                aria-hidden
                className="absolute h-3/4 w-3/4 rounded-full bg-brand-red/[0.07] blur-3xl"
              />
              <Image
                src="/lamsa2.png"
                alt="Lamsa Communication"
                width={480}
                height={480}
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 430px"
                className="relative h-auto w-full max-w-[280px] object-contain sm:max-w-[340px] lg:max-w-[430px]"
              />
            </div>
          </motion.div>

          {/* ── 3. Mobile-only buttons (below logo) ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.46, ease: EASE }}
            className="order-3 flex flex-col gap-2.5 sm:flex-row sm:items-center lg:hidden"
          >
            <CTAButtons />
          </motion.div>
        </div>
      </Container>

      {/* ── Marquee ticker ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.0 }}
        className="relative z-10 mx-auto mt-4 w-full max-w-[900px] overflow-hidden md:mt-6
          [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
          [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <Marquee
          speed="fast"
          separator={null}
          className="flex items-center"
          itemClassName="w-[180px] justify-center opacity-80 md:w-[200px]"
          items={[
            <img
              alt="Lamsa Communication"
              src="/lamsa2.png"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="l1"
            />,
            <img
              alt="C'est aussi simple que ça"
              src="/logoFOOTER.avif"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="f1"
            />,
            <img
              alt="Lamsa Communication"
              src="/lamsa2.png"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="l2"
            />,
            <img
              alt="C'est aussi simple que ça"
              src="/logoFOOTER.avif"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="f2"
            />,
            <img
              alt="Lamsa Communication"
              src="/lamsa2.png"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="l3"
            />,
            <img
              alt="C'est aussi simple que ça"
              src="/logoFOOTER.avif"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="f3"
            />,
            <img
              alt="Lamsa Communication"
              src="/lamsa2.png"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="l4"
            />,
            <img
              alt="C'est aussi simple que ça"
              src="/logoFOOTER.avif"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="f4"
            />,
            <img
              alt="Lamsa Communication"
              src="/lamsa2.png"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="l5"
            />,
            <img
              alt="C'est aussi simple que ça"
              src="/logoFOOTER.avif"
              className="h-6 w-auto object-contain opacity-80 md:h-8"
              key="f5"
            />,
          ]}
        />
      </motion.div>
    </section>
  );
}
