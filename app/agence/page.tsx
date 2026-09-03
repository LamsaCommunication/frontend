"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/sections/about-section";
import { AgenceCategoriesSection } from "@/components/sections/agence-categories-section";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social-icons";
import { Suspense } from "react";
import { AgenceScrollHandler } from "@/components/ui/agence-scroll-handler";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AgencePage() {
  return (
    <>
      <Suspense fallback={null}>
        <AgenceScrollHandler />
      </Suspense>
      <Navbar />
      <main className="flex-1">
        <AboutSection />
        <AgenceCategoriesSection />

        {/* CTA Section */}
        <section className="w-full bg-white py-20 md:py-28 lg:py-32">
          <Container as="div">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: EASE }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="label-eyebrow text-brand-red">
                Prêt à démarrer ?
              </span>

              <h2 className="heading-section mt-5 text-balance text-3xl text-brand-charcoal sm:text-4xl md:text-5xl">
                Donnons vie à votre{" "}
                <span className="text-brand-red">projet</span>.
              </h2>

              <p className="mt-5 text-base text-brand-dark/65 md:text-lg">
                Une idée, un besoin, un projet — notre équipe vous accompagne de
                A à Z avec créativité et précision.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-8 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-red-hover hover:shadow-[0_10px_30px_-12px_rgba(227,6,19,0.55)]"
                >
                  Démarrer un projet
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </Link>

                <a
                  href={site.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-charcoal/15 bg-white px-8 py-4 text-sm font-semibold text-brand-charcoal transition-all duration-200 hover:border-brand-charcoal/30 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)]"
                >
                  <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
                  Nous écrire sur WhatsApp
                </a>
              </motion.div>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
