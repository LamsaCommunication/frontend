import * as React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { useCatalogStore, Product } from "@/lib/store/useCatalogStore";
import { ProductCustomizerClient } from "./client-view";

import { catalogApi } from "@/lib/api/lamsa-api";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await catalogApi.getProducts({ limit: 100 });
    return (res.products || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
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
