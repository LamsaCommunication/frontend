"use client";

import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pencil,
  Printer,
  Palette,
  Zap,
  Shirt,
  Sparkles,
  Folder,
  Package,
  Layers,
  Tag,
  Box,
  ShoppingBag,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCatalogStore, Category } from "@/lib/store/useCatalogStore";

// ── Icon Registry ──────────────────────────────────────────────────────────

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
  Folder,
  Package,
  Layers,
  Tag,
  Box,
  ShoppingBag,
};

// ── Visual components ──────────────────────────────────────────────────────

function DesignVisual() {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fef2f2] to-[#fff8f8]">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="absolute -bottom-6 left-6 h-24 w-24 rounded-full bg-brand-red/10 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative flex w-full items-center gap-5">
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-full rounded-full bg-brand-red/25" />
            <div className="h-2 w-5/6 rounded-full bg-brand-charcoal/10" />
            <div className="h-2 w-3/5 rounded-full bg-brand-charcoal/10" />
            <div className="mt-3 flex gap-2">
              <div className="h-7 w-7 rounded-lg bg-brand-red/25" />
              <div className="h-7 w-7 rounded-lg bg-brand-charcoal/10" />
              <div className="h-7 w-7 rounded-lg bg-brand-red/15" />
            </div>
          </div>
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
            <Pencil className="h-7 w-7 text-brand-red" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintVisual() {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-[#f5f5f5] to-[#fafafa]">
      <div className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-brand-charcoal/[0.08] blur-3xl" />
      <div className="absolute bottom-0 right-4 h-24 w-32 rounded-full bg-brand-charcoal/[0.06] blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center px-10">
        <div className="relative w-full">
          <div className="absolute left-3 right-0 top-4 h-12 rounded-xl bg-brand-charcoal/[0.08]" />
          <div className="absolute left-1.5 right-0 top-2 h-12 rounded-xl bg-brand-charcoal/[0.12]" />
          <div className="relative flex h-12 items-center justify-between rounded-xl bg-white px-4 shadow-md transition-transform duration-300 group-hover:scale-[1.04]">
            <div className="flex items-center gap-3">
              <Printer
                className="h-5 w-5 text-brand-charcoal/50"
                strokeWidth={1.5}
              />
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-red/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-brand-charcoal/20" />
                <div className="h-2.5 w-2.5 rounded-full bg-brand-red/25" />
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-brand-charcoal/30">
              Print
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeonVisual() {
  return (
    <div className="relative h-32 overflow-hidden rounded-2xl bg-[#111]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(227,6,19,0.6) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap
          className="h-10 w-10 text-brand-red transition-transform duration-300 group-hover:scale-110"
          strokeWidth={1.5}
          style={{ filter: "drop-shadow(0 0 14px rgba(227,6,19,0.85))" }}
        />
      </div>
    </div>
  );
}

function IconVisual({
  icon: Icon,
  from,
  to,
  iconColor,
  blobColor,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  from: string;
  to: string;
  iconColor: string;
  blobColor: string;
}) {
  return (
    <div
      className="relative h-32 overflow-hidden rounded-2xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl"
        style={{ background: blobColor }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className={`h-7 w-7 ${iconColor}`} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

function ImageVisual({ imageUrl, alt, isLarge }: { imageUrl: string; alt: string; isLarge?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#faf9f6] to-[#ffffff] border border-[#ebebeb] p-3 flex items-center justify-center ${
        isLarge ? "h-48 md:h-52" : "h-36 md:h-40"
      }`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-red/5 blur-2xl" />
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-white p-2 flex items-center justify-center shadow-2xs">
        <img
          src={imageUrl}
          alt={alt}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

// ── Dynamic Visual Resolver ────────────────────────────────────────────────

function getCategoryVisual(category: Category, isLarge: boolean) {
  // 1. ALWAYS check and show the principle/pinned image from the database first!
  const customImage =
    category.image ||
    (category.images && category.images.length > 0 ? category.images[0] : null);

  if (customImage && !customImage.includes("placeholder")) {
    return <ImageVisual imageUrl={customImage} alt={category.name} isLarge={isLarge} />;
  }

  const iconKey = category.icon;
  const slug = category.slug;

  // 2. Signature visuals fallback if no image configured in DB
  if (slug === "communication-visuelle" || iconKey === "Pencil") {
    return isLarge ? <DesignVisual /> : (
      <IconVisual
        icon={Pencil}
        from="#fef2f2"
        to="#fff8f8"
        iconColor="text-brand-red"
        blobColor="rgba(227,6,19,0.2)"
      />
    );
  }

  if (slug === "impression-production" || iconKey === "Printer") {
    return isLarge ? <PrintVisual /> : (
      <IconVisual
        icon={Printer}
        from="#f5f5f5"
        to="#fafafa"
        iconColor="text-brand-charcoal/70"
        blobColor="rgba(20,20,20,0.12)"
      />
    );
  }

  if (slug === "signaletique-led" || iconKey === "Zap") {
    return <NeonVisual />;
  }

  if (slug === "identite-visuelle" || iconKey === "Palette") {
    return (
      <IconVisual
        icon={Palette}
        from="#fef2f2"
        to="#fff"
        iconColor="text-brand-red"
        blobColor="rgba(227,6,19,0.2)"
      />
    );
  }

  if (slug === "textile-personnalise" || iconKey === "Shirt") {
    return (
      <IconVisual
        icon={Shirt}
        from="#f5f5f5"
        to="#fafafa"
        iconColor="text-brand-charcoal/60"
        blobColor="rgba(20,20,20,0.12)"
      />
    );
  }

  if (slug === "commandes-sur-mesure" || iconKey === "Sparkles") {
    return (
      <IconVisual
        icon={Sparkles}
        from="#fbf8f2"
        to="#fffdf9"
        iconColor="text-amber-600"
        blobColor="rgba(217,119,6,0.15)"
      />
    );
  }

  // 3. Fallback to IconVisual with mapped or default icon
  const FallbackIcon = ICON_MAP[iconKey] || Sparkle;
  return (
    <IconVisual
      icon={FallbackIcon}
      from="#f8f8f8"
      to="#ffffff"
      iconColor="text-brand-charcoal/70"
      blobColor="rgba(227,6,19,0.12)"
    />
  );
}

// ── Bento Col-Span calculation ────────────────────────────────────────────

function getBentoLayout(index: number, total: number): { colSpan: string; large: boolean } {
  if (total <= 2) {
    return { colSpan: "sm:col-span-1 lg:col-span-3", large: true };
  }
  if (total === 3) {
    return { colSpan: "sm:col-span-1 lg:col-span-2", large: false };
  }
  if (total === 4) {
    return { colSpan: "sm:col-span-1 lg:col-span-3", large: true };
  }
  if (total === 5) {
    if (index < 2) return { colSpan: "sm:col-span-1 lg:col-span-3", large: true };
    return { colSpan: "sm:col-span-1 lg:col-span-2", large: false };
  }
  if (total === 6) {
    if (index === 0 || index === 1) return { colSpan: "sm:col-span-1 lg:col-span-3", large: true };
    if (index === 5) return { colSpan: "sm:col-span-2 lg:col-span-6", large: false };
    return { colSpan: "sm:col-span-1 lg:col-span-2", large: false };
  }

  // For 7+ categories: 2 large cards at top, remainder 3-col grid
  if (index === 0 || index === 1) {
    return { colSpan: "sm:col-span-1 lg:col-span-3", large: true };
  }
  const isLast = index === total - 1;
  const remainder = (total - 2) % 3;
  if (isLast && remainder === 1) {
    return { colSpan: "sm:col-span-2 lg:col-span-6", large: false };
  }
  return { colSpan: "sm:col-span-1 lg:col-span-2", large: false };
}

// ── Card Component ─────────────────────────────────────────────────────────

const CARD_CLASS =
  "group flex flex-col rounded-3xl border border-[#ebebeb] bg-white p-6 shadow-[0_1px_12px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-brand-red/20 hover:shadow-[0_16px_48px_-12px_rgba(227,6,19,0.10)] md:p-8";

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  categorySlug?: string;
};

function BentoCard({
  children,
  className = "",
  delay = 0,
  categorySlug,
}: BentoCardProps) {
  const motionNode = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={`${CARD_CLASS}${categorySlug ? " h-full cursor-pointer" : ` ${className}`}`}
    >
      {children}
    </motion.div>
  );

  if (categorySlug) {
    return (
      <Link
        href={`/agence?category=${categorySlug}#categories`}
        className={`block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${className}`}
      >
        {motionNode}
      </Link>
    );
  }

  return motionNode;
}

// ── Skeleton Loader ────────────────────────────────────────────────────────

function OfferingsSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 md:mt-16 animate-pulse">
      <div className="sm:col-span-1 lg:col-span-3 h-80 rounded-3xl bg-neutral-100 p-6 md:p-8 flex flex-col justify-between">
        <div className="h-44 w-full rounded-2xl bg-neutral-200/70" />
        <div className="space-y-2 mt-4">
          <div className="h-6 w-1/2 rounded-md bg-neutral-200" />
          <div className="h-4 w-3/4 rounded-md bg-neutral-200/60" />
        </div>
      </div>
      <div className="sm:col-span-1 lg:col-span-3 h-80 rounded-3xl bg-neutral-100 p-6 md:p-8 flex flex-col justify-between">
        <div className="h-44 w-full rounded-2xl bg-neutral-200/70" />
        <div className="space-y-2 mt-4">
          <div className="h-6 w-1/2 rounded-md bg-neutral-200" />
          <div className="h-4 w-3/4 rounded-md bg-neutral-200/60" />
        </div>
      </div>
      <div className="sm:col-span-1 lg:col-span-2 h-64 rounded-3xl bg-neutral-100 p-6 flex flex-col justify-between">
        <div className="h-32 w-full rounded-2xl bg-neutral-200/70" />
        <div className="space-y-2 mt-4">
          <div className="h-5 w-1/2 rounded-md bg-neutral-200" />
          <div className="h-3.5 w-3/4 rounded-md bg-neutral-200/60" />
        </div>
      </div>
      <div className="sm:col-span-1 lg:col-span-2 h-64 rounded-3xl bg-neutral-100 p-6 flex flex-col justify-between">
        <div className="h-32 w-full rounded-2xl bg-neutral-200/70" />
        <div className="space-y-2 mt-4">
          <div className="h-5 w-1/2 rounded-md bg-neutral-200" />
          <div className="h-3.5 w-3/4 rounded-md bg-neutral-200/60" />
        </div>
      </div>
      <div className="sm:col-span-1 lg:col-span-2 h-64 rounded-3xl bg-neutral-100 p-6 flex flex-col justify-between">
        <div className="h-32 w-full rounded-2xl bg-neutral-200/70" />
        <div className="space-y-2 mt-4">
          <div className="h-5 w-1/2 rounded-md bg-neutral-200" />
          <div className="h-3.5 w-3/4 rounded-md bg-neutral-200/60" />
        </div>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────

export function OfferingsSection() {
  const { categories, isLoading, fetchCatalog } = useCatalogStore();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchCatalog();
    }
  }, [categories, fetchCatalog]);

  const totalCategories = categories.length;

  return (
    <section
      id="offres"
      className="w-full scroll-mt-16 bg-white py-20 md:py-28 lg:py-32 lg:scroll-mt-20"
    >
      <Container as="div">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="label-eyebrow text-brand-red">Notre offre</span>
          <h2 className="heading-section mt-5 text-3xl text-brand-charcoal sm:text-4xl md:text-5xl">
            Ce que nous{" "}
            <span className="text-brand-red">offrons</span>.
          </h2>
          <p className="mt-4 text-base text-brand-dark/60 md:text-lg">
            Une expertise complète pour transformer votre communication visuelle.
          </p>
        </motion.div>

        {isLoading && totalCategories === 0 ? (
          <OfferingsSkeleton />
        ) : totalCategories === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 p-12 text-center">
            <p className="text-sm font-medium text-brand-dark/60">
              Aucune catégorie disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 md:mt-16">
            {categories.map((cat, idx) => {
              const { colSpan, large } = getBentoLayout(idx, totalCategories);
              const visual = getCategoryVisual(cat, large);
              const targetSlug = cat.slug || cat.id;

              return (
                <BentoCard
                  key={cat.id || cat.slug || idx}
                  delay={idx * 0.05}
                  className={colSpan}
                  categorySlug={targetSlug}
                >
                  {visual}
                  <div className={`flex flex-col flex-1 ${large ? "mt-6" : "mt-5"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-bold text-brand-charcoal ${
                          large ? "text-xl" : "text-base"
                        }`}
                      >
                        {cat.name}
                      </h3>
                      {cat.subCategories && cat.subCategories.length > 0 && (
                        <span className="hidden sm:inline-flex items-center rounded-full bg-brand-soft-white px-2.5 py-0.5 text-[10px] font-semibold text-brand-charcoal/60">
                          {cat.subCategories.length} options
                        </span>
                      )}
                    </div>
                    <p
                      className={`leading-relaxed text-brand-dark/65 ${
                        large ? "mt-2 text-sm md:text-base" : "mt-1.5 text-sm"
                      }`}
                    >
                      {cat.description}
                    </p>

                    <div className="mt-4 pt-2 flex items-center gap-1.5 text-xs font-bold text-brand-red opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span>Découvrir l&apos;offre</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
