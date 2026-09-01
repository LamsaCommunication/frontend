"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount
  } = useCartStore();

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isMounted) return null;

  const subtotal = getSubtotal();
  const count = getItemCount();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="flex w-screen max-w-md flex-col bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-light-gray/80 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft-white text-brand-charcoal">
                    <ShoppingBag className="h-5 w-5 text-brand-red" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-brand-charcoal">Mon Panier</h2>
                    <p className="text-xs text-brand-warm-gray">
                      {count} article{count > 1 ? "s" : ""} sélectionné{count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-brand-charcoal/60 transition-colors hover:bg-brand-soft-white hover:text-brand-charcoal"
                  aria-label="Fermer le panier"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft-white text-brand-warm-gray">
                      <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-brand-charcoal">
                      Votre panier est vide
                    </h3>
                    <p className="mt-1 text-sm text-brand-warm-gray">
                      Découvrez nos réalisations et personnalisez vos supports créatifs.
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeDrawer}
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-red-hover hover:shadow-[0_8px_20px_-6px_rgba(227,6,19,0.5)]"
                    >
                      Explorer la boutique
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-brand-light-gray/60">
                    {items.map((item) => (
                      <li key={item.id} className="py-4">
                        <div className="flex gap-4">
                          {/* Image or 3D preview thumbnail */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-brand-light-gray bg-brand-soft-white p-1">
                            <Image
                              src={item.customization?.preview3DPath || item.image || "/lamsa2.png"}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                            {item.customization &&
                              item.customization.modelType &&
                              item.customization.modelType !== "none" && (
                                <span className="absolute bottom-1 right-1 rounded bg-brand-red/90 px-1 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                                  3D
                                </span>
                              )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-bold text-brand-charcoal leading-tight">
                                  {item.name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-brand-warm-gray transition-colors hover:text-brand-red cursor-pointer"
                                  aria-label="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {item.customization?.selectedColor && (
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-brand-dark/70">
                                  <span
                                    className="h-3 w-3 rounded-full border border-black/20 shadow-2xs"
                                    style={{
                                      backgroundColor: item.customization.selectedColor,
                                    }}
                                  />
                                  <span className="font-mono text-[10px]">
                                    {item.customization.selectedColor.toUpperCase()}
                                  </span>
                                </div>
                              )}

                              {item.customization?.customText && (
                                <p className="mt-1 text-xs text-brand-dark/70 line-clamp-1">
                                  Texte: &quot;{item.customization.customText}&quot;
                                </p>
                              )}

                              {item.customization?.clientVerified && (
                                <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Graphisme validé
                                </div>
                              )}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              {/* Quantity toggle */}
                              <div className="flex items-center rounded-lg border border-brand-light-gray bg-brand-soft-white p-0.5">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded text-brand-charcoal transition-colors hover:bg-white"
                                  aria-label="Diminuer la quantité"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-brand-charcoal">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="flex h-6 w-6 items-center justify-center rounded text-brand-charcoal transition-colors hover:bg-white"
                                  aria-label="Augmenter la quantité"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="text-sm font-black text-brand-red">
                                {formatPrice(item.price * item.quantity)} DZD
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-brand-light-gray bg-brand-soft-white/60 p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-brand-dark/70">
                      <span>Sous-total HT</span>
                      <span className="font-semibold text-brand-charcoal">
                        {formatPrice(subtotal)} DZD
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-brand-warm-gray">
                      <span>Livraison Yalidine Express</span>
                      <span>Calculée au paiement</span>
                    </div>
                    <div className="flex justify-between border-t border-brand-light-gray/80 pt-2 text-base font-extrabold text-brand-charcoal">
                      <span>Total estimé</span>
                      <span className="text-brand-red">{formatPrice(subtotal)} DZD</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5">
                    <Link
                      href="/checkout"
                      onClick={closeDrawer}
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-red-hover hover:shadow-[0_8px_25px_-6px_rgba(227,6,19,0.55)]"
                    >
                      Commander maintenant
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="w-full text-center text-xs font-semibold text-brand-dark/60 transition-colors hover:text-brand-charcoal"
                    >
                      Continuer mes achats
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-brand-warm-gray">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Paiement sécurisé à la livraison partout en Algérie
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
