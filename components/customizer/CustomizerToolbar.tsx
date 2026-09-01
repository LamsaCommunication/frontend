"use client";

import * as React from "react";
import {
  Upload,
  RotateCw,
  MoveHorizontal,
  MoveVertical,
  Maximize2,
  Palette,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Coffee,
  Shirt,
  Sparkles
} from "lucide-react";
import { Product3DType, TextureTransform } from "./ProductModel";

interface CustomizerToolbarProps {
  productType: Product3DType | string;
  onProductTypeChange: (type: Product3DType) => void;
  baseColor: string;
  onBaseColorChange: (color: string) => void;
  logoUrl: string | null;
  onUploadLogo: (url: string) => void;
  onRemoveLogo: () => void;
  logoTransform: TextureTransform;
  onTransformChange: (transform: Partial<TextureTransform>) => void;
  isLocked?: boolean;
}

const COLOR_SWATCHES = [
  { name: "Blanc", hex: "#ffffff", border: "border-gray-200" },
  { name: "Noir", hex: "#141414", border: "border-transparent" },
  { name: "Rouge", hex: "#e30613", border: "border-transparent" },
  { name: "Jaune", hex: "#ffd700", border: "border-transparent" },
  { name: "Bleu Ciel", hex: "#87ceeb", border: "border-transparent" },
  { name: "Bleu Roi", hex: "#4169e1", border: "border-transparent" },
  { name: "Orange", hex: "#ffa500", border: "border-transparent" },
  { name: "Vert", hex: "#228b22", border: "border-transparent" },
  { name: "Rose", hex: "#ff69b4", border: "border-transparent" }
];

export function CustomizerToolbar({
  productType,
  onProductTypeChange,
  baseColor,
  onBaseColorChange,
  logoUrl,
  onUploadLogo,
  onRemoveLogo,
  logoTransform,
  onTransformChange,
  isLocked
}: CustomizerToolbarProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUploadLogo(url);
    }
  };

  const handleResetTransform = () => {
    onTransformChange({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0
    });
  };

  const normalizedType = (productType || "").toUpperCase();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-4 max-h-[50vh] overflow-y-auto space-y-6 lg:relative lg:block lg:bg-transparent lg:shadow-none lg:p-0 lg:max-h-none lg:overflow-visible lg:z-auto">
      {/* ── 0. 3D Product Selector (Pills) ─────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            Modèle 3D Actif
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-brand-soft-white p-1.5 border border-brand-light-gray/60">
          <button
            type="button"
            onClick={() => onProductTypeChange("CUP")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-bold transition-all cursor-pointer ${
              normalizedType === "CUP" || normalizedType === "MUG"
                ? "bg-white text-brand-charcoal shadow-sm border border-black/5"
                : "text-brand-warm-gray hover:text-brand-charcoal"
            }`}
          >
            <Coffee className="h-3.5 w-3.5 text-brand-red shrink-0" />
            <span className="truncate">Mug</span>
          </button>

          <button
            type="button"
            onClick={() => onProductTypeChange("TSHIRT")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-bold transition-all cursor-pointer ${
              normalizedType.includes("TSHIRT")
                ? "bg-white text-brand-charcoal shadow-sm border border-black/5"
                : "text-brand-warm-gray hover:text-brand-charcoal"
            }`}
          >
            <Shirt className="h-3.5 w-3.5 text-brand-red shrink-0" />
            <span className="truncate">T-Shirt</span>
          </button>

          <button
            type="button"
            onClick={() => onProductTypeChange("CASQUET")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-bold transition-all cursor-pointer ${
              normalizedType.includes("CASQUET")
                ? "bg-white text-brand-charcoal shadow-sm border border-black/5"
                : "text-brand-warm-gray hover:text-brand-charcoal"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-red shrink-0" />
            <span className="truncate">Casquette</span>
          </button>
        </div>
      </div>

      {/* ── 1. Base Product Color Swatches ─────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Palette className="h-4 w-4 text-brand-red" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            Couleur de base du support
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => onBaseColorChange(swatch.hex)}
              title={swatch.name}
              className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                swatch.border
              } ${
                baseColor.toLowerCase() === swatch.hex.toLowerCase()
                  ? "ring-2 ring-brand-red ring-offset-2 scale-110"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              {baseColor.toLowerCase() === swatch.hex.toLowerCase() && (
                <span
                  className={`h-2 w-2 rounded-full ${
                    swatch.hex === "#ffffff" ? "bg-black" : "bg-white"
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. File Upload Dropzone ─────────────────────────────────── */}
      <div>
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-light-gray bg-brand-soft-white/60 p-5 text-center transition-colors hover:border-brand-red/50 hover:bg-brand-soft-white mt-4">
          <input
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, application/pdf"
            onChange={handleFile}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Uploader un logo"
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-red shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <p className="mt-2 text-xs font-bold text-brand-charcoal">
            {logoUrl ? "Logo chargé (Cliquer pour changer)" : "Importer votre logo"}
          </p>
          <p className="mt-0.5 text-[10px] text-brand-warm-gray">
            PNG (transparent recommandé), JPG, SVG
          </p>
        </div>

        {logoUrl && (
          <div className="mt-2 flex items-center justify-between px-1 text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Fichier actif
            </span>
            <button
              type="button"
              onClick={onRemoveLogo}
              className="text-brand-warm-gray hover:text-brand-red transition-colors flex items-center gap-1 font-bold"
            >
              <Trash2 className="h-3 w-3" /> Retirer
            </button>
          </div>
        )}
      </div>

      {/* ── 3. Precision 3D Transform Sliders ──────────────────────── */}
      {logoUrl && (
        <div className="rounded-2xl border border-brand-light-gray bg-brand-soft-white/40 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-light-gray pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              Ajustement du Logo
            </span>
          </div>

          {/* Scale Slider */}
          <div className={isLocked ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex justify-between text-xs font-semibold text-brand-charcoal mb-1">
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-brand-red" />
                Taille
              </span>
              <span className="font-mono text-brand-warm-gray">
                {Math.round(logoTransform.scale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={logoTransform.scale}
              onChange={(e) =>
                onTransformChange({ scale: parseFloat(e.target.value) })
              }
              className="w-full accent-brand-red cursor-pointer"
            />
          </div>

          {/* Position X Slider */}
          <div className={isLocked ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex justify-between text-xs font-semibold text-brand-charcoal mb-1">
              <span className="flex items-center gap-1.5">
                <MoveHorizontal className="h-3.5 w-3.5 text-brand-red" />
                Position Horizontale (Rotation)
              </span>
              <span className="font-mono text-brand-warm-gray">
                {logoTransform.offsetX}
              </span>
            </div>
            <input
              type="range"
              min="-5000"
              max="5000"
              step="5"
              value={logoTransform.offsetX}
              onChange={(e) =>
                onTransformChange({ offsetX: parseInt(e.target.value, 10) })
              }
              className="w-full accent-brand-red cursor-pointer"
            />
          </div>

          {/* Position Y Slider */}
          <div className={isLocked ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex justify-between text-xs font-semibold text-brand-charcoal mb-1">
              <span className="flex items-center gap-1.5">
                <MoveVertical className="h-3.5 w-3.5 text-brand-red" />
                Position Verticale
              </span>
              <span className="font-mono text-brand-warm-gray">
                {logoTransform.offsetY}
              </span>
            </div>
            <input
              type="range"
              min="-2000"
              max="2000"
              step="5"
              value={logoTransform.offsetY}
              onChange={(e) =>
                onTransformChange({ offsetY: parseInt(e.target.value, 10) })
              }
              className="w-full accent-brand-red cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
