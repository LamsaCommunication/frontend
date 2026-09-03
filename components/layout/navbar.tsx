"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ShoppingBag } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { useCartStore } from "@/lib/store/useCartStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { getItemCount, openDrawer } = useCartStore();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { label: string; href: string }
  ) => {
    setOpen(false);
    if (item.label === "Accueil") {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
      }
    } else if (item.label === "Contact") {
      if (pathname === "/") {
        e.preventDefault();
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth" });
        }
        if (window.location.hash) {
          window.history.replaceState(null, "", "/");
        }
      } else {
        e.preventDefault();
        sessionStorage.setItem("scrollToSection", "contact");
        router.push("/");
      }
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

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
    <header className="sticky inset-x-0 top-0 z-50 transition-all duration-300">
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
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-[#f4f4f4]/95 p-1.5 ring-1 ring-black/[0.07] backdrop-blur-xl lg:flex shadow-sm"
        >
          {site.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
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

        {/* ── Desktop Right Shopping Bag Button ─────────────────────── */}
        <div className="hidden lg:flex items-center justify-end">
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Ouvrir le panier"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-charcoal transition-all hover:bg-brand-charcoal hover:text-white shadow-sm border border-black/[0.08] cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-extrabold text-white shadow-sm animate-in zoom-in duration-200">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Mobile Right Actions (Cart + Hamburger) ──────────────── */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Shopping Bag */}
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Ouvrir le panier"
            className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#141414] transition-colors hover:bg-[#f4f4f4]"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-extrabold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#141414] transition-colors hover:bg-[#f4f4f4]"
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
        </div>
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
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#141414] transition-colors hover:bg-[#f4f4f4]"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-1.5 h-px bg-black/[0.06]" />

              <a
                href={site.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-charcoal py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                Contactez nous
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}