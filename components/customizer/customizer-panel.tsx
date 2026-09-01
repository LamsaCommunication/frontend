"use client";

import * as React from "react";
import { Upload, CheckCircle2, ShieldCheck, Truck, Clock, Sparkles, FileText, AlertCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/store/useCatalogStore";
import { useCartStore } from "@/lib/store/useCartStore";

interface CustomizerPanelProps {
  product: Product;
  rectoArtworkUrl: string | null;
  versoArtworkUrl: string | null;
  customText: string;
  designNotes: string;
  clientVerified: boolean;
  onRectoUpload: (url: string) => void;
  onVersoUpload: (url: string) => void;
  onCustomTextChange: (text: string) => void;
  onDesignNotesChange: (notes: string) => void;
  onClientVerifiedChange: (verified: boolean) => void;
}

export function CustomizerPanel({
  product,
  rectoArtworkUrl,
  versoArtworkUrl,
  customText,
  designNotes,
  clientVerified,
  onRectoUpload,
  onVersoUpload,
  onCustomTextChange,
  onDesignNotesChange,
  onClientVerifiedChange
}: CustomizerPanelProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = React.useState(product.minQuantity || 1);
  const [activeUploadTab, setActiveUploadTab] = React.useState<"recto" | "verso">("recto");

  const minQty = product.minQuantity || 1;
  const totalPrice = product.price * quantity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, face: "recto" | "verso") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create object URL for client-side preview in 3D canvas
    const previewUrl = URL.createObjectURL(file);
    if (face === "recto") {
      onRectoUpload(previewUrl);
    } else {
      onVersoUpload(previewUrl);
    }
  };

  const handleAddToCart = () => {
    if (!clientVerified) return;

    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      image: rectoArtworkUrl || product.images[0] || "/lamsa2.png",
      customization: {
        clientLogoPath: rectoArtworkUrl || undefined,
        designRectoPath: rectoArtworkUrl || undefined,
        designVersoPath: versoArtworkUrl || undefined,
        preview3DPath: rectoArtworkUrl || product.images[0] || "/lamsa2.png",
        clientVerified: true,
        customText: customText.trim() || undefined,
        designNotes: designNotes.trim() || undefined,
        modelType: product.modelType
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm">
      {/* Product Title & Pricing */}
      <div>
        <h1 className="heading-section text-2xl text-brand-charcoal sm:text-3xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-brand-dark/70">
          {product.description}
        </p>

        <div className="mt-4 flex items-baseline gap-3 border-y border-brand-light-gray/70 py-3">
          <span className="text-2xl font-black text-brand-charcoal">
            {product.price.toLocaleString()}{" "}
            <span className="text-sm font-bold text-brand-red">DZD</span>
          </span>
          <span className="text-xs text-brand-warm-gray">
            / unité {product.dimensions ? `(${product.dimensions})` : ""}
          </span>
        </div>
      </div>

      {/* ── 1. Upload Artwork Dropzone ────────────────────────────────── */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-2">
          1. Téléchargez votre graphisme / Logo
        </label>

        {/* Tab selector for Recto vs Verso upload */}
        <div className="flex rounded-xl bg-brand-soft-white p-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveUploadTab("recto")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeUploadTab === "recto"
                ? "bg-white text-brand-charcoal shadow-sm"
                : "text-brand-warm-gray hover:text-brand-charcoal"
            }`}
          >
            Face Recto {rectoArtworkUrl && "✓"}
          </button>
          <button
            type="button"
            onClick={() => setActiveUploadTab("verso")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeUploadTab === "verso"
                ? "bg-white text-brand-charcoal shadow-sm"
                : "text-brand-warm-gray hover:text-brand-charcoal"
            }`}
          >
            Face Verso {versoArtworkUrl && "✓"}
          </button>
        </div>

        {/* Dropzone container */}
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-light-gray bg-brand-soft-white/60 p-6 text-center transition-colors hover:border-brand-red/50 hover:bg-brand-soft-white">
          <input
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, application/pdf"
            onChange={(e) => handleFileChange(e, activeUploadTab)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`Uploader fichier pour ${activeUploadTab}`}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-red shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <p className="mt-3 text-xs font-bold text-brand-charcoal">
            {activeUploadTab === "recto" && rectoArtworkUrl
              ? "Graphisme Recto chargé avec succès"
              : activeUploadTab === "verso" && versoArtworkUrl
              ? "Graphisme Verso chargé avec succès"
              : "Cliquez ou glissez-déposez votre fichier"}
          </p>
          <p className="mt-1 text-[11px] text-brand-warm-gray">
            Formats acceptés : PNG, JPG, SVG, PDF (Max 25 Mo)
          </p>
        </div>
      </div>

      {/* ── 2. Custom Text & Notes ──────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <label htmlFor="custom-text-input" className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1.5">
            2. Texte personnalisé sur le produit (Optionnel)
          </label>
          <input
            id="custom-text-input"
            type="text"
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="Ex: Nom de marque, Slogan, Téléphone..."
            className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/50 px-4 py-2.5 text-xs font-medium text-brand-charcoal placeholder-brand-warm-gray focus:border-brand-red focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="design-notes-input" className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1.5">
            Consignes d&apos;impression & Finitions
          </label>
          <textarea
            id="design-notes-input"
            rows={2}
            value={designNotes}
            onChange={(e) => onDesignNotesChange(e.target.value)}
            placeholder="Ex: Finition mate, vernis sélectif, découpe selon tracé..."
            className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/50 px-4 py-2 text-xs font-medium text-brand-charcoal placeholder-brand-warm-gray focus:border-brand-red focus:bg-white focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* ── 3. Quantity & Pricing ───────────────────────────────────── */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-2">
          3. Quantité commandée
        </label>
        <div className="flex items-center justify-between rounded-2xl border border-brand-light-gray bg-brand-soft-white p-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(minQty, quantity - (minQty > 1 ? minQty : 1)))}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-charcoal font-bold shadow-sm transition-colors hover:bg-brand-red hover:text-white cursor-pointer"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-extrabold text-brand-charcoal">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + (minQty > 1 ? minQty : 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-charcoal font-bold shadow-sm transition-colors hover:bg-brand-red hover:text-white cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="text-right pr-2">
            <span className="text-[11px] text-brand-warm-gray block">Total HT</span>
            <span className="text-base font-black text-brand-charcoal">
              {totalPrice.toLocaleString()} <span className="text-xs text-brand-red">DZD</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Mandatory Verification Checkbox ──────────────────────── */}
      <div className="rounded-2xl border border-brand-red/20 bg-brand-red/5 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={clientVerified}
            onChange={(e) => onClientVerifiedChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-brand-light-gray text-brand-red focus:ring-brand-red"
          />
          <span className="text-xs font-semibold text-brand-charcoal leading-snug">
            J&apos;ai vérifié mon graphisme, les textes et le rendu 3D, et je valide pour production.
          </span>
        </label>
        {!clientVerified && (
          <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-brand-red">
            <AlertCircle className="h-3 w-3" />
            Veuillez cocher la case de validation pour ajouter au panier.
          </p>
        )}
      </div>

      {/* ── 5. Add to Bag Trigger ───────────────────────────────────── */}
      <button
        type="button"
        disabled={!clientVerified}
        onClick={handleAddToCart}
        className={`group flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-extrabold transition-all duration-200 cursor-pointer ${
          clientVerified
            ? "bg-brand-red text-white hover:bg-brand-red-hover hover:shadow-[0_10px_30px_-8px_rgba(227,6,19,0.55)]"
            : "bg-brand-light-gray text-brand-warm-gray cursor-not-allowed"
        }`}
      >
        <ShoppingBag className="h-4 w-4" />
        Ajouter au panier — {totalPrice.toLocaleString()} DZD
      </button>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 border-t border-brand-light-gray/60 pt-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <Clock className="h-4 w-4 text-brand-red" />
          <span className="text-[10px] font-bold text-brand-charcoal">Expédition 48-72h</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Truck className="h-4 w-4 text-brand-red" />
          <span className="text-[10px] font-bold text-brand-charcoal">58 Wilayas Yalidine</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-brand-red" />
          <span className="text-[10px] font-bold text-brand-charcoal">Contrôle Qualité</span>
        </div>
      </div>
    </div>
  );
}
