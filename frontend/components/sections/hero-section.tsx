"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Marquee } from "@/components/ui/marquee";
import { site, services } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social-icons";

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative isolate w-full overflow-hidden bg-white text-brand-charcoal"
    >
      <Container
        as="div"
        className="relative z-10 pb-12 pt-14 md:pb-20 md:pt-24"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="label-eyebrow text-brand-red"
            >
              <span className="block h-px w-10 bg-brand-red" aria-hidden />
              Studio communication
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="heading-display mt-6 text-center text-balance text-[clamp(2.2rem,6vw,4.8rem)] font-semibold text-brand-charcoal md:mt-8"
            >
              DÉMARQUEZ-VOUS DE VOS{" "}
              <span className="relative inline-block">
                CONCURRENTS !
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-10"
            >
              <a
                href={site.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-brand-red-hover hover:shadow-[0_18px_40px_-18px_rgba(227,6,19,0.55)] cursor-pointer"
              >
                <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
                Demander un devis
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="#services"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-charcoal/15 bg-white px-7 py-4 text-base font-semibold text-brand-charcoal transition-all duration-200 hover:border-brand-charcoal hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.18)] cursor-pointer"
              >
                Découvrir nos services
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[440px] lg:col-span-5 lg:max-w-none"
          >
            <div className="relative aspect-square w-full">
              <div className="relative h-full w-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <Image
                    src="/lamsa2.PNG"
                    alt="Lamsa Communication — logo"
                    width={400}
                    height={400}
                    priority
                    sizes="(max-width: 1024px) 320px, 380px"
                    className="h-auto w-full max-w-[260px] object-contain md:max-w-[300px]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.3 }}
        className="relative z-10 w-[900px] overflow-hidden bg-white mx-auto mt-10
    [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
    [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <Marquee
          speed="fast"
          separator={null}
          className="flex items-center"
          itemClassName="w-[200px] justify-center opacity-40"
          items={[
            <span className="text-sm font-semibold tracking-wide">
              LOGO1
            </span>,
            <span className="text-sm font-medium tracking-[0.2em]">
              LOGO2
            </span>,
            <span className="text-sm font-semibold">LOGO3</span>,
            <span className="text-sm font-medium tracking-wide">LOGO4</span>,
            <span className="text-sm font-semibold">LOGO5</span>,
            <span className="text-sm font-medium tracking-wide">LOGO6</span>,
          ]}
        />
      </motion.div>
    </section>
  );
}
