import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { useCatalogStore, Product } from "@/lib/store/useCatalogStore";
import { ProductCustomizerClient } from "./client-view";

export const dynamicParams = false;

const STATIC_SLUGS = [
  "cartes-de-visite-premium-soft-touch",
  "stickers-vinyle-decoupe-forme-libre",
  "mug-personnalise-ceramique-hd",
  "casquette-baseball-brodee-custom",
  "tshirt-coton-bio-serigraphie-dtf",
  "roll-up-kakemono-evenementiel-luxe",
  "cartes-de-remerciement-dorees",
  "kit-branding-startup-corporate",
  "packaging-boite-cadeau-personnalisee",
  "neon-led-enseigne-lumineuse-custom",
  "mug-3d",
  "tshirt-3d",
  "cap-3d",
  "casquette-3d",
  "t-shirt-3d"
];

export function generateStaticParams() {
  return STATIC_SLUGS.map((slug) => ({ slug }));
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Navbar />
      <main className="flex-1 py-10 md:py-14">
        <Container as="div">
          <ProductCustomizerClient slug={slug} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
