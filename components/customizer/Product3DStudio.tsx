import * as React from "react";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  RefreshCw,
  Check
} from "lucide-react";
import { Scene3D } from "./Scene3D";
import { ViewControls } from "./ViewControls";
import { CustomizerToolbar } from "./CustomizerToolbar";
import { SnapshotGenerator } from "./SnapshotGenerator";
import { Product3DType, TextureTransform } from "./ProductModel";
import { Product } from "@/lib/store/useCatalogStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils";

interface Product3DStudioProps {
  product: Product;
}

export function Product3DStudio({ product }: Product3DStudioProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const [addedFeedback, setAddedFeedback] = React.useState(false);
  const { addItem, closeDrawer } = useCartStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 0. Active 3D Product Mesh Type — strictly synced to product.modelType from DB
  const getProductModelType = React.useCallback((mType?: string): Product3DType => {
    const m = (mType || "").toLowerCase().trim();
    if (m === "tshirt" || m.includes("shirt") || m.includes("textile")) return "TSHIRT";
    if (m === "cap" || m.includes("casquet")) return "CASQUET";
    return "CUP";
  }, []);

  const [selectedProductType, setSelectedProductType] = React.useState<Product3DType>(() =>
    getProductModelType(product.modelType)
  );

  React.useEffect(() => {
    setSelectedProductType(getProductModelType(product.modelType));
  }, [product.modelType, getProductModelType]);

  // 1. Customization State
  const [baseColor, setBaseColor] = React.useState("#ffffff");
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoTransform, setLogoTransform] = React.useState<TextureTransform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0
  });

  const [clientVerified, setClientVerified] = React.useState(false);
  const [quantity, setQuantity] = React.useState(product.minQuantity || 1);

  // 1.5. Lock State & Warning Toast
  const [isLocked, setIsLocked] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);

  const triggerWarning = React.useCallback(() => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  }, []);

  // 2. 3D Viewport Controls
  const [orbitEnabled, setOrbitEnabled] = React.useState(true);
  
  const glRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.Camera | null>(null);
  const controlsRef = React.useRef<any>(null);

  const handleUploadLogo = async (url: string) => {
    setLogoUrl(url);
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
  };

  const handleTransformChange = (updates: Partial<TextureTransform>) => {
    setLogoTransform((prev) => ({ ...prev, ...updates }));
  };

  const handleAddToCart = (goToCheckout = false) => {
    if (!clientVerified) return;

    // Capture high-res 3D WebGL snapshot
    const preview3D = SnapshotGenerator.capture(
      glRef.current,
      sceneRef.current,
      cameraRef.current
    );

    addItem(
      {
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        price: product.price,
        quantity,
        image: preview3D || product.images[0] || "/lamsa2.png",
        customization: {
          clientLogoPath: logoUrl || undefined,
          designRectoPath: logoUrl || undefined,
          designVersoPath: undefined,
          preview3DPath: preview3D || product.images[0] || "/lamsa2.png",
          clientVerified: true,
          designNotes: `Modèle: ${selectedProductType}, Couleur: ${baseColor}, Free Placement`,
          selectedColor: baseColor,
          modelType: selectedProductType as any
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

  const minQty = product.minQuantity || 1;
  const totalPrice = product.price * quantity;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      {/* ── Left: Interactive 3D Viewport & Camera Director (7 Cols) ─── */}
      <div className="lg:col-span-7 sticky top-24 space-y-4">
        <div className="relative h-[440px] sm:h-[520px] lg:h-[580px] w-full overflow-hidden rounded-3xl border border-brand-light-gray bg-transparent shadow-inner">
          {/* Top Floating Badge & Warning */}
          <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3.5 py-1 text-xs font-bold text-brand-charcoal backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-brand-red" />
              Studio 3D Temps Réel
            </span>
            
            {showWarning && (
              <div className="animate-in fade-in slide-in-from-top-2 inline-flex items-center gap-1.5 rounded-full border border-brand-red/20 bg-brand-red/90 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                <AlertCircle className="h-3.5 w-3.5" />
                Le logo est verrouillé.
              </div>
            )}
          </div>

          {/* Top Right Controls (Lock & Reset) */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLocked((prev) => !prev)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all ${
                isLocked
                  ? "border-brand-red bg-brand-red text-white"
                  : "border-black/10 bg-white/80 text-brand-charcoal hover:bg-white backdrop-blur-md"
              }`}
              title={isLocked ? "Déverrouiller le logo" : "Verrouiller le logo"}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() =>
                setLogoTransform({ scale: 1, offsetX: 0, offsetY: 0, rotation: 0 })
              }
              disabled={isLocked || !logoUrl}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-brand-charcoal backdrop-blur-md shadow-sm transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:text-brand-red"
              title="Réinitialiser la position"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* WebGL Scene */}
          {isMounted && (
            <Scene3D
              modelType={selectedProductType}
              baseColor={baseColor}
              controlsRef={controlsRef}
              logoUrl={logoUrl}
              logoTransform={logoTransform}
              onTransformChange={handleTransformChange}
              orbitEnabled={orbitEnabled}
              setOrbitEnabled={setOrbitEnabled}
              isLocked={isLocked}
              onLockedDragAttempt={triggerWarning}
              onCanvasReady={(gl, scene, camera) => {
                glRef.current = gl;
                sceneRef.current = scene;
                cameraRef.current = camera;
              }}
            />
          )}

          {/* View Presets & Camera Director */}
          <ViewControls
            onZoomIn={() => {
              if (cameraRef.current && controlsRef.current) {
                const cam = cameraRef.current;
                const dist = cam.position.length();
                cam.position.setLength(Math.max(2.0, dist - 0.5));
                controlsRef.current.update();
              }
            }}
            onZoomOut={() => {
              if (cameraRef.current && controlsRef.current) {
                const cam = cameraRef.current;
                const dist = cam.position.length();
                cam.position.setLength(Math.min(8.0, dist + 0.5));
                controlsRef.current.update();
              }
            }}
            onReset={() => {
              handleTransformChange({ scale: 1, offsetX: 0, offsetY: 0, rotation: 0 });
              if (cameraRef.current && controlsRef.current) {
                cameraRef.current.position.set(0, 0, 4.5);
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();
              }
            }}
          />
        </div>

        {/* Viewport Footer Info */}
        <div className="flex items-center justify-between px-2 text-xs font-semibold text-brand-dark/70">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Rendu WebGL photoréaliste direct
          </span>
          <span className="text-brand-warm-gray">
            Lamsa 3D Studio v2.4
          </span>
        </div>
      </div>

      {/* ── Right: Customizer Toolbar & Order Gate (5 Cols) ─────────── */}
      <div className="lg:col-span-5 space-y-6 pb-24 lg:pb-0">
        {/* Product Details Header */}
        <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm hidden lg:block">
          <h1 className="heading-section text-2xl font-bold text-brand-charcoal sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xs text-brand-dark/70 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 flex items-baseline gap-2 border-y border-brand-light-gray/70 py-3">
            <span className="text-2xl font-black text-brand-charcoal">
              {formatPrice(product.price)}{" "}
              <span className="text-sm font-bold text-brand-red">DZD</span>
            </span>
            <span className="text-xs text-brand-warm-gray">
              / unité {product.dimensions ? `(${product.dimensions})` : ""}
            </span>
          </div>
        </div>

        {/* 3D Customizer Toolbar */}
        <div className="mt-0 lg:mt-6 z-50">
          <CustomizerToolbar
            productType={selectedProductType}
            onProductTypeChange={setSelectedProductType}
            baseColor={baseColor}
            onBaseColorChange={setBaseColor}
            logoUrl={logoUrl}
            onUploadLogo={handleUploadLogo}
            onRemoveLogo={handleRemoveLogo}
            logoTransform={logoTransform}
            onTransformChange={handleTransformChange}
            isLocked={isLocked}
          />
        </div>

        <div className="hidden lg:block">
          {/* Quantity Selector */}
          <div className="mt-6 border-t border-brand-light-gray/70 pt-5">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-2">
              Quantité commandée
            </label>
            <div className="flex items-center justify-between rounded-2xl border border-brand-light-gray bg-brand-soft-white p-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(minQty, quantity - (minQty > 1 ? minQty : 1)))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-charcoal font-bold shadow-sm hover:bg-brand-red hover:text-white transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-brand-charcoal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + (minQty > 1 ? minQty : 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-charcoal font-bold shadow-sm hover:bg-brand-red hover:text-white transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="text-right pr-2">
                <span className="text-[11px] text-brand-warm-gray block">Total HT</span>
                <span className="text-base font-black text-brand-charcoal">
                  {formatPrice(totalPrice)} <span className="text-xs text-brand-red">DZD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Verification Gate */}
          <div className="mt-6 rounded-2xl border border-brand-red/20 bg-brand-red/5 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={clientVerified}
                onChange={(e) => setClientVerified(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-brand-light-gray text-brand-red focus:ring-brand-red cursor-pointer"
              />
              <span className="text-xs font-semibold text-brand-charcoal leading-snug">
                J&apos;ai vérifié mon graphisme et le rendu 3D, et je valide pour production.
              </span>
            </label>
            {!clientVerified && (
              <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-brand-red">
                <AlertCircle className="h-3 w-3" />
                Veuillez cocher la case pour ajouter votre création au panier.
              </p>
            )}
          </div>

          {/* Action Buttons: Add to Cart + Commander Directement */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              disabled={!clientVerified}
              onClick={() => handleAddToCart(false)}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold transition-all ${
                !clientVerified
                  ? "bg-brand-light-gray text-brand-warm-gray cursor-not-allowed"
                  : addedFeedback
                    ? "bg-emerald-600 text-white"
                    : "bg-brand-charcoal text-white hover:bg-black shadow-xs cursor-pointer"
              }`}
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
              disabled={!clientVerified}
              onClick={() => handleAddToCart(true)}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-black transition-all ${
                !clientVerified
                  ? "bg-brand-light-gray text-brand-warm-gray cursor-not-allowed"
                  : "bg-brand-red text-white shadow-sm hover:bg-brand-red-hover hover:shadow-[0_8px_25px_-6px_rgba(227,6,19,0.55)] cursor-pointer"
              }`}
            >
              <span>Commander Directement</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-brand-light-gray/60 pt-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Clock className="h-4 w-4 text-brand-red" />
              <span className="text-[10px] font-bold text-brand-charcoal">Expédition 48-72h</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-brand-red" />
              <span className="text-[10px] font-bold text-brand-charcoal">Yalidine 58 Wilayas</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-red" />
              <span className="text-[10px] font-bold text-brand-charcoal">Garantie Qualité</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Product3DStudio;
