"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/icons/social-icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden border-t border-brand-light-gray bg-white text-brand-charcoal">

      <Container as="div" className="relative py-14 md:py-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-12">
          <div className="sm:col-span-2 md:col-span-5">
            <Link
              href="#accueil"
              className="inline-flex items-center gap-3"
              aria-label="Lamsa Communication — Accueil"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-brand-light-gray bg-white p-1.5">
                <Image
                  src="/lamsa2.PNG"
                  alt="Lamsa Communication"
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <span className="sr-only">Lamsa Communication</span>
            </Link>

            <p className="mt-6 max-w-md text-base text-brand-dark/70">
              Studio créatif premium spécialisé en design graphique, identité
              visuelle, impression et solutions de communication.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-4 md:mt-6"
            >
              <img
                src="/logoFOOTER.avif"
                alt="C'est aussi simple que ça"
                className="h-auto w-[200px] md:w-[260px] object-contain"
              />
            </motion.div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark/50">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-charcoal/85 transition-colors hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark/50">
              Contact
            </h4>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 text-sm text-brand-charcoal/85 transition-colors hover:text-brand-red"
                >
                  <Mail className="h-4 w-4" />
                  {site.email}
                </a>
              </li>
              {site.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-brand-charcoal/85 transition-colors hover:text-brand-red"
                  >
                    <Phone className="h-4 w-4" />
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-red-hover hover:shadow-[0_10px_30px_-12px_rgba(227,6,19,0.55)] cursor-pointer"
                >
                  <WhatsAppIcon className="h-4 w-4" title="WhatsApp" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-brand-light-gray pt-8 md:flex-row md:items-center">
          <p className="text-sm text-brand-dark/60">
            © {year} Lamsa Communication. Tous droits réservés.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-charcoal/15 bg-white text-brand-charcoal transition-all hover:border-brand-red hover:bg-brand-red hover:text-white cursor-pointer"
            >
              <InstagramIcon className="h-4 w-4" title="Instagram" />
            </a>
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-charcoal/15 bg-white text-brand-charcoal transition-all hover:border-brand-red hover:bg-brand-red hover:text-white cursor-pointer"
            >
              <FacebookIcon className="h-4 w-4" title="Facebook" />
            </a>
            <a
              href={site.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-charcoal/15 bg-white text-brand-charcoal transition-all hover:border-brand-red hover:bg-brand-red hover:text-white cursor-pointer"
            >
              <TikTokIcon className="h-4 w-4" title="TikTok" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
