"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky inset-x-0 top-0 z-50 bg-transparent transition-all duration-300">
      <Container
        as="div"
        className="relative flex h-16 items-center justify-between lg:h-20"
      >
        {/* ── Logo — pulled 50px left on desktop ───────────────────── */}
        <Link
          href="/"
          aria-label="Lamsa Communication — accueil"
          onClick={() => setOpen(false)}
          className="flex flex-shrink-0 items-center lg:-ml-14"
        >
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 lg:h-[58px] lg:w-[58px]">
            <Image
              src="/lamsa2.png"
              alt="Lamsa Communication"
              fill
              priority
              sizes="52px"
              className="object-contain"
            />
          </div>
        </Link>

        {/* ── Desktop nav pill — absolutely centered ────────────────── */}
        <nav
          aria-label="Navigation principale"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-[#f4f4f4]/90 p-1.5 ring-1 ring-black/[0.07] backdrop-blur-xl lg:flex"
        >
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-[#141414] transition-all duration-150 hover:bg-white hover:shadow-[0_1px_6px_rgba(0,0,0,0.07)]"
            >
              {item.label}
            </Link>
          ))}

          <span aria-hidden className="mx-1 h-4 w-px bg-black/10" />

          <a
            href={site.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-charcoal px-5 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-brand-red hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)]"
          >
            <span className="flex items-center gap-1.5 transition-all duration-300 group-hover:-translate-x-full group-hover:opacity-0">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              Contactez nous
            </span>
            <span className="absolute flex items-center gap-1.5 translate-x-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              Contactez nous
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </a>
        </nav>

        {/* ── Mobile hamburger ─────────────────────────────────────── */}
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#141414] transition-colors hover:bg-[#f4f4f4] lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </Container>

      {/* ── Mobile menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute inset-x-3 top-full mt-2 overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] lg:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex flex-col p-2">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-[#141414] transition-colors hover:bg-[#f4f4f4]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-black/[0.06] p-2">
              <a
                href={site.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group relative inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#141414] py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red"
              >
                <span className="flex items-center gap-2 transition-all duration-300 group-hover:-translate-x-full group-hover:opacity-0">
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  Contactez nous
                </span>
                <span className="absolute flex items-center gap-2 translate-x-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Contactez nous
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
