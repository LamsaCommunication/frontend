"use client";

import Link from "next/link";
import { ArrowLeft, AlertOctagon } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#faf9f6] py-20 md:py-32">
        <Container as="div">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-red/10 text-brand-red border border-brand-red/20 shadow-lg">
              <AlertOctagon className="h-10 w-10" />
            </div>
            <h1 className="heading-display mt-6 text-3xl font-black text-brand-charcoal sm:text-4xl">
              Page Non Trouvée
            </h1>
            <p className="mt-3 text-sm text-brand-warm-gray">
              La page demandée est introuvable ou a été déplacée.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour à l&apos;accueil</span>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
