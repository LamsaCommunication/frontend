"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Layers,
  Plus,
  Minus,
  Check,
  Maximize2,
  X
} from "lucide-react";
import { Product } from "@/lib/store/useCatalogStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils";

interface ProductStandardViewProps {
  product: Product;
}

export function ProductStandardView({ product }: ProductStandardViewProps) {
  const router = useRouter();
  const { addItem, closeDrawer } = useCartStore();

  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const [quantity, setQuantity] = React.useState(product.minQuantity || 1);
  const [artworkFile, setArtworkFile] = React.useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = React.useState<string | null>(null);
  const [designNotes, setDesignNotes] = React.useState("");
  const [addedFeedback, setAddedFeedback] = React.useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const images = product.images && product.images.length > 0 ? product.images : ["/lamsa2.png"];
  const currentImage = images[activeImageIdx] || images[0];

  const colors =
    product.availableColors && product.availableColors.length > 0
      ? product.availableColors
      : ["#ffffff", "#141414", "#e30613"];
  const [selectedColor, setSelectedColor] = React.useState<string>(colors[0] || "#ffffff");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtworkFile(file);
      setArtworkPreview(URL.createObjectURL(file));
    }
  };

  const handleAddToCart = (goToCheckout = false) => {
    addItem(
      {
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.price,
        quantity,
        image: currentImage,
        customization: {
          clientVerified: true,
          clientLogoPath: artworkPreview || undefined,
          designNotes: designNotes.trim() || undefined,
          selectedColor,
          modelType: "none",
          preview3DPath: currentImage
        }
      },
      !goToCheckout
    );

    if (goToCheckout) {
      closeDrawer();
      router.push("/checkout");
    } else {
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
    }
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* ── Left Column: Image Preview Gallery (7 cols) ───────────── */}
      <div className="space-y-4 lg:col-span-7">
        {/* Main Image Frame */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-10 shadow-xs">
          <div className="relative h-full w-full">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Fullscreen zoom trigger */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Agrandir l'image"
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs text-brand-charcoal hover:bg-white hover:text-brand-red transition-all cursor-pointer"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Thumbnail Gallery (if more than 1 image) */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border p-2 bg-white transition-all cursor-pointer ${activeImageIdx === idx
                  ? "border-brand-red ring-2 ring-brand-red/20 shadow-xs"
                  : "border-brand-light-gray hover:border-brand-charcoal/40"
                  }`}
              >
                <Image src={img} alt="" fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right Column: Product Details & Order Gate (5 cols) ───── */}
      <div className="space-y-6 lg:col-span-5">
        <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h1 className="heading-section text-2xl font-black text-brand-charcoal sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-brand-dark/70 sm:text-sm">
              {product.description}
            </p>
          </div>

          {/* Pricing & Dimensions */}
          <div className="flex items-baseline justify-between border-y border-brand-light-gray/70 py-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray block">
                Prix unitaire
              </span>
              <span className="text-2xl font-black text-brand-charcoal">
                {formatPrice(product.price)}{" "}
                <span className="text-sm font-bold text-brand-red">DZD</span>
              </span>
            </div>

            {product.dimensions && (
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray block">
                  Format / Dimension
                </span>
                <span className="text-xs font-mono font-bold text-brand-charcoal">
                  {product.dimensions}
                </span>
              </div>
            )}
          </div>

          {/* Optional Design File Upload */}
          <div className="rounded-2xl border border-brand-light-gray/80 bg-brand-soft-white/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                Joindre votre logo ou fichier (Optionnel)
              </span>
              <span className="text-[10px] text-brand-warm-gray font-medium">
                PNG, PDF, AI, JPG
              </span>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-dashed border-brand-light-gray bg-white p-3 hover:border-brand-red hover:bg-brand-soft-white cursor-pointer transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft-white text-brand-charcoal">
                <Upload className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-brand-charcoal block truncate">
                  {artworkFile ? artworkFile.name : "Cliquez pour téléverser votre visuel"}
                </span>
                <span className="text-[10px] text-brand-warm-gray">
                  {artworkFile ? `${(artworkFile.size / 1024).toFixed(1)} Ko` : "BAT validé par nos graphistes avant tirage"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*,.pdf,.ai,.eps,.psd"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Design Notes */}
            <input
              type="text"
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder="Instructions particulières (couleurs, texte à ajouter...)"
              className="w-full rounded-xl border border-brand-light-gray bg-white py-2 px-3.5 text-xs text-brand-charcoal placeholder-brand-warm-gray focus:border-brand-red focus:outline-none"
            />
          </div>

          {/* Color Selection (if colors available) */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                  Couleur / Déclinaison
                </span>
                <span className="text-xs font-mono font-bold text-brand-warm-gray">
                  {selectedColor.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {colors.map((hex) => {
                  const isSelected = selectedColor.toLowerCase() === hex.toLowerCase();
                  return (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setSelectedColor(hex)}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all cursor-pointer ${isSelected
                        ? "ring-2 ring-brand-red ring-offset-2 scale-110 shadow-xs border-black/30"
                        : "border-black/20 hover:scale-105"
                        }`}
                      style={{ backgroundColor: hex }}
                      title={hex}
                    >
                      {isSelected && (
                        <Check
                          className={`h-4 w-4 stroke-[3] ${hex.toLowerCase() === "#ffffff" ||
                            hex.toLowerCase() === "#fff" ||
                            hex.toLowerCase() === "#fafafa"
                            ? "text-brand-charcoal"
                            : "text-white"
                            }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                Quantité souhaitée
              </span>
              {product.minQuantity && product.minQuantity > 1 && (
                <span className="text-[10px] font-bold text-amber-600">
                  Minimum : {product.minQuantity} unités
                </span>
              )}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-brand-light-gray bg-brand-soft-white/60 p-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.max(product.minQuantity || 1, q - 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-charcoal shadow-xs hover:bg-brand-charcoal hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-12 text-center text-sm font-black text-brand-charcoal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-charcoal shadow-xs hover:bg-brand-charcoal hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-right pr-2">
                <span className="text-[10px] font-medium text-brand-warm-gray block">
                  Total estimé
                </span>
                <span className="text-sm font-black text-brand-charcoal">
                  {formatPrice(totalPrice)}{" "}
                  <span className="text-xs text-brand-red font-bold">DZD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Add to Cart & Buy Now */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-charcoal bg-brand-charcoal py-3.5 text-xs font-black text-white shadow-sm hover:bg-brand-red hover:border-brand-red transition-all cursor-pointer"
            >
              {addedFeedback ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Ajouter au Panier</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-3.5 text-xs font-black text-white shadow-sm hover:bg-brand-red-hover hover:shadow-[0_8px_25px_-6px_rgba(227,6,19,0.55)] transition-all cursor-pointer"
            >
              <span>Commander Directement</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ──────────────────────────────── */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-h-[85vh] max-w-3xl overflow-hidden rounded-3xl bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-light-gray">
              <span className="text-xs font-bold text-brand-charcoal">{product.name}</span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal hover:bg-brand-soft-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-[16/10] w-full max-h-[70vh] p-4 flex items-center justify-center">
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
