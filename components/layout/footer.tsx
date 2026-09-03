"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/social-icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden border-t border-brand-light-gray bg-white text-brand-charcoal">
      <Container as="div" className="relative py-14 md:py-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-12">
          <div className="sm:col-span-2 md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="Lamsa Communication — Accueil"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-brand-light-gray bg-white p-1.5">
                <Image
                  src="/lamsa2.png"
                  alt="Lamsa Communication"
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <span className="sr-only">Lamsa Communication</span>
            </Link>

            <p className="mt-6 max-w-md text-base text-brand-dark/70">
              Agence créative experte en design graphique, identité visuelle,
              impression et solutions de communication.
            </p>

            <div className="mt-4 md:mt-6">
              <img
                src="/logoFOOTER.avif"
                alt="C'est aussi simple que ça"
                loading="lazy"
                decoding="async"
                className="h-auto w-[200px] md:w-[260px] object-contain"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark/50">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3">
              {site.nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.label === "Contact") {
                        if (typeof window !== "undefined" && window.location.pathname === "/") {
                          e.preventDefault();
                          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                          if (window.location.hash) window.history.replaceState(null, "", "/");
                        } else {
                          sessionStorage.setItem("scrollToSection", "contact");
                        }
                      } else if (item.label === "Accueil") {
                        if (typeof window !== "undefined" && window.location.pathname === "/") {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          if (window.location.hash) window.history.replaceState(null, "", "/");
                        }
                      }
                    }}
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
              {site.email.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-sm text-brand-charcoal/85 transition-colors hover:text-brand-red"
                  >
                    <Mail className="h-4 w-4" />
                    {email}
                  </a>
                </li>
              ))}
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
                  href="https://maps.app.goo.gl/FAUuAFQjfdoYzQv89"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm text-brand-charcoal/85 transition-colors hover:text-brand-red"
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>
                    Rue Cherif Chalabi, Passage N°E
                    <br />
                    Blida 09000
                  </span>
                </a>
              </li>
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

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-brand-light-gray pt-5 md:flex-row md:items-center">
          <p className="text-xs text-brand-dark/50">
            © {year} Lamsa Communication. Tous droits réservés.
          </p>

          <div className="flex items-center gap-2">
            <a
              className="f-icon"
              href={site.socials.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>
            <a
              className="f-icon"
              href={site.socials.facebook}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
              </svg>
            </a>
            <a
              className="f-icon"
              href={site.socials.tiktok}
              target="_blank"
              rel="noopener"
              aria-label="Linkedin"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-tiktok"
                viewBox="0 0 16 16"
              >
                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
              </svg>
            </a>
            <a
              className="f-icon"
              href={site.whatsapp.link}
              target="_blank"
              rel="noopener"
              aria-label="Tiktok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
