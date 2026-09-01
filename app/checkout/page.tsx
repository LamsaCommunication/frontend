"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Home,
  Phone,
  User,
  MapPin,
  FileCheck,
  ArrowRight,
  Printer,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { CustomSelect } from "@/components/ui/custom-select";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAdminStore, OrderRecord } from "@/lib/store/useAdminStore";
import { formatPrice } from "@/lib/utils";
import { ALGERIA_WILAYAS } from "@/lib/data/algeria-wilayas";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    selectedWilayaCode,
    selectedCommune,
    isStopDesk,
    setSelectedWilaya,
    setSelectedCommune,
    setIsStopDesk,
    getSubtotal,
    getShippingFee,
    getTotalAmount,
    clearCart
  } = useCartStore();

  const { createOrder } = useAdminStore();

  // Form State
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"CASH_ON_DELIVERY" | "CCP_TRANSFER">("CASH_ON_DELIVERY");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmedOrder, setConfirmedOrder] = React.useState<OrderRecord | null>(null);

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentWilaya = React.useMemo(() => {
    return ALGERIA_WILAYAS.find((w) => w.code === selectedWilayaCode) || ALGERIA_WILAYAS[15];
  }, [selectedWilayaCode]);

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getTotalAmount();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "Veuillez renseigner votre prénom.";
    if (!lastName.trim()) newErrors.lastName = "Veuillez renseigner votre nom.";

    // Algerian phone number validation: 05, 06, or 07 followed by 8 digits
    const phoneClean = phone.replace(/[\s.-]/g, "");
    if (!phoneClean) {
      newErrors.phone = "Veuillez renseigner votre numéro de téléphone.";
    } else if (!/^(0)(5|6|7)[0-9]{8}$/.test(phoneClean)) {
      newErrors.phone = "Numéro invalide. Format attendu : 05/06/07 xx xx xx xx";
    }

    if (!isStopDesk && !address.trim()) {
      newErrors.address = "Veuillez renseigner votre adresse de livraison complète.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const newOrder = createOrder({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        wilaya: currentWilaya.name,
        commune: selectedCommune || currentWilaya.communes[0],
        address: isStopDesk ? `Bureau Yalidine StopDesk — ${selectedCommune}` : address.trim(),
        isStopDesk,
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
        items: items.map((it) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: it.productId,
          productName: it.name,
          quantity: it.quantity,
          unitPrice: it.price,
          clientLogoPath: it.customization?.clientLogoPath,
          designRectoPath: it.customization?.designRectoPath,
          designVersoPath: it.customization?.designVersoPath,
          preview3DPath: it.customization?.preview3DPath || it.image,
          clientVerified: it.customization?.clientVerified ?? true,
          customText: it.customization?.customText,
          designNotes: it.customization?.designNotes
        }))
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setConfirmedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error("Order creation failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#faf9f6] py-10 md:py-16">
        <Container as="div">
          {/* Breadcrumbs */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs font-medium text-brand-warm-gray mb-8">
            <Link href="/" className="hover:text-brand-charcoal transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-brand-charcoal transition-colors">
              Boutique
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-brand-charcoal font-semibold">Finalisation de commande</span>
          </nav>

          {/* Empty cart notification */}
          {items.length === 0 && !confirmedOrder ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-brand-light-gray bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft-white text-brand-warm-gray">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-brand-charcoal">
                Votre panier est vide
              </h1>
              <p className="mt-2 text-sm text-brand-warm-gray">
                Ajoutez des articles depuis notre boutique pour finaliser votre commande.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-brand-red-hover cursor-pointer"
              >
                Explorer la boutique
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : confirmedOrder ? (
            /* ── Order Confirmation View ────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-2xl rounded-3xl border border-brand-light-gray bg-white p-8 sm:p-12 shadow-sm"
            >
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <span className="mt-4 inline-block rounded-full bg-brand-soft-white px-4 py-1 text-xs font-bold text-brand-charcoal">
                  Commande N° {confirmedOrder.orderNumber}
                </span>
                <h1 className="heading-section mt-3 text-2xl text-brand-charcoal sm:text-3xl">
                  Merci, votre commande est confirmée !
                </h1>
                <p className="mt-2 text-sm text-brand-dark/70">
                  Un agent Lamsa Communication vous contactera par téléphone au{" "}
                  <span className="font-bold text-brand-charcoal">{confirmedOrder.phone}</span> pour validation finale de la maquette avant expédition Yalidine.
                </p>
              </div>

              {/* Summary Card */}
              <div className="mt-8 rounded-2xl border border-brand-light-gray bg-brand-soft-white/60 p-6 space-y-4">
                <div className="flex justify-between text-xs text-brand-dark/70 border-b border-brand-light-gray pb-3">
                  <span>Destinataire</span>
                  <span className="font-bold text-brand-charcoal">
                    {confirmedOrder.firstName} {confirmedOrder.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-dark/70 border-b border-brand-light-gray pb-3">
                  <span>Destination</span>
                  <span className="font-bold text-brand-charcoal">
                    {confirmedOrder.wilaya} — {confirmedOrder.commune} ({confirmedOrder.isStopDesk ? "Bureau StopDesk" : "À domicile"})
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-dark/70 border-b border-brand-light-gray pb-3">
                  <span>Mode de paiement</span>
                  <span className="font-bold text-brand-charcoal">
                    Paiement à la livraison (Cash on Delivery)
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-brand-charcoal pt-1">
                  <span>Montant Total à payer</span>
                  <span className="text-brand-red font-black">
                    {formatPrice(confirmedOrder.totalAmount)} DZD
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-light-gray bg-white px-6 py-3 text-xs font-bold text-brand-charcoal transition-colors hover:bg-brand-soft-white cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer le reçu
                </button>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-brand-red-hover cursor-pointer"
                >
                  Continuer mes achats
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── Checkout Form + Summary Layout ──────────────────────── */
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
              {/* Form Column (7 Cols) */}
              <div className="lg:col-span-7">
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  {/* Step 1: Customer Information */}
                  <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-brand-light-gray/70 pb-4 mb-6">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-charcoal text-xs font-bold text-white">
                        1
                      </div>
                      <h2 className="text-lg font-bold text-brand-charcoal">
                        Coordonnées du client
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1.5">
                          Prénom *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Votre prénom"
                            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs font-medium text-brand-charcoal focus:bg-white focus:outline-none ${errors.firstName
                                ? "border-brand-red bg-brand-red/5"
                                : "border-brand-light-gray bg-brand-soft-white/60 focus:border-brand-red"
                              }`}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-[11px] font-medium text-brand-red">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1.5">
                          Nom de famille *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Votre nom"
                            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs font-medium text-brand-charcoal focus:bg-white focus:outline-none ${errors.lastName
                                ? "border-brand-red bg-brand-red/5"
                                : "border-brand-light-gray bg-brand-soft-white/60 focus:border-brand-red"
                              }`}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-[11px] font-medium text-brand-red">{errors.lastName}</p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1.5">
                          Numéro de téléphone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-warm-gray" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="05 / 06 / 07 xx xx xx xx"
                            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs font-medium text-brand-charcoal focus:bg-white focus:outline-none ${errors.phone
                                ? "border-brand-red bg-brand-red/5"
                                : "border-brand-light-gray bg-brand-soft-white/60 focus:border-brand-red"
                              }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-[11px] font-medium text-brand-red">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Shipping Destination (Algeria 58 Wilayas) */}
                  <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-brand-light-gray/70 pb-4 mb-6">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-charcoal text-xs font-bold text-white">
                        2
                      </div>
                      <h2 className="text-lg font-bold text-brand-charcoal">
                        Adresse & Mode de livraison
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Wilaya select */}
                        <CustomSelect
                          label="Wilaya *"
                          value={selectedWilayaCode}
                          onChange={(e) => setSelectedWilaya(e.target.value)}
                        >
                          {ALGERIA_WILAYAS.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.code} - {w.name} ({w.nameAr})
                            </option>
                          ))}
                        </CustomSelect>

                        {/* Commune select */}
                        <CustomSelect
                          label="Commune *"
                          value={selectedCommune}
                          onChange={(e) => setSelectedCommune(e.target.value)}
                        >
                          {currentWilaya.communes.map((commune) => (
                            <option key={commune} value={commune}>
                              {commune}
                            </option>
                          ))}
                        </CustomSelect>
                      </div>

                      {/* Delivery Mode Toggle (StopDesk vs Home) */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-2">
                          Type d&apos;expédition Yalidine
                        </label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setIsStopDesk(false)}
                            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${!isStopDesk
                                ? "border-brand-red bg-brand-red/5 shadow-sm"
                                : "border-brand-light-gray bg-brand-soft-white/60 hover:bg-white"
                              }`}
                          >
                            <Home className={`h-5 w-5 mt-0.5 ${!isStopDesk ? "text-brand-red" : "text-brand-warm-gray"}`} />
                            <div>
                              <span className="text-xs font-bold text-brand-charcoal block">
                                Livraison à Domicile
                              </span>
                              <span className="text-[11px] text-brand-dark/70 block mt-0.5">
                                Directement à votre adresse ({currentWilaya.homeDeliveryFee} DZD)
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsStopDesk(true)}
                            className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${isStopDesk
                                ? "border-brand-red bg-brand-red/5 shadow-sm"
                                : "border-brand-light-gray bg-brand-soft-white/60 hover:bg-white"
                              }`}
                          >
                            <Building2 className={`h-5 w-5 mt-0.5 ${isStopDesk ? "text-brand-red" : "text-brand-warm-gray"}`} />
                            <div>
                              <span className="text-xs font-bold text-brand-charcoal block">
                                Bureau Yalidine (StopDesk)
                              </span>
                              <span className="text-[11px] text-brand-dark/70 block mt-0.5">
                                Récupération en agence ({currentWilaya.stopDeskFee} DZD)
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {!isStopDesk && (
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1.5">
                            Adresse exacte de livraison *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-brand-warm-gray" />
                            <textarea
                              rows={2}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Cité, Numéro de rue, Bâtiment, Étage..."
                              className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-xs font-medium text-brand-charcoal focus:bg-white focus:outline-none resize-none ${errors.address
                                  ? "border-brand-red bg-brand-red/5"
                                  : "border-brand-light-gray bg-brand-soft-white/60 focus:border-brand-red"
                                }`}
                            />
                          </div>
                          {errors.address && (
                            <p className="mt-1 text-[11px] font-medium text-brand-red">{errors.address}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Payment Method */}
                  <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-brand-light-gray/70 pb-4 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-charcoal text-xs font-bold text-white">
                        3
                      </div>
                      <h2 className="text-lg font-bold text-brand-charcoal">
                        Mode de paiement
                      </h2>
                    </div>

                    <div className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-brand-red" />
                        <div>
                          <span className="text-xs font-bold text-brand-charcoal block">
                            Paiement à la livraison (Cash on Delivery)
                          </span>
                          <span className="text-[11px] text-brand-dark/70">
                            Réglez le livreur Yalidine lors de la réception de votre colis.
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-brand-red border border-brand-red/20">
                        100% SÉCURISÉ
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover hover:shadow-[0_8px_25px_-6px_rgba(227,6,19,0.55)] cursor-pointer"
                  >
                    <span>Confirmer la commande — {formatPrice(grandTotal)} DZD</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              </div>

              {/* Order Summary Column (5 Cols) */}
              <div className="lg:col-span-5 sticky top-24">
                <div className="rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-brand-charcoal border-b border-brand-light-gray/70 pb-4">
                    Récapitulatif de la commande ({items.length})
                  </h3>

                  {/* Item List */}
                  <ul className="divide-y divide-brand-light-gray/60 max-h-80 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <li key={item.id} className="py-3 flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-brand-light-gray bg-brand-soft-white p-1">
                          <Image
                            src={item.customization?.preview3DPath || item.image || "/lamsa2.png"}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-brand-charcoal line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-[11px] text-brand-warm-gray">
                              Quantité : {item.quantity} × {formatPrice(item.price)} DZD
                            </span>
                            {item.customization?.customText && (
                              <p className="text-[10px] text-brand-dark/70 line-clamp-1 italic">
                                &quot;{item.customization.customText}&quot;
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-black text-brand-charcoal text-right">
                            {formatPrice(item.price * item.quantity)} DZD
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Calculations */}
                  <div className="mt-6 border-t border-brand-light-gray/80 pt-4 space-y-2.5">
                    <div className="flex justify-between text-xs text-brand-dark/70">
                      <span>Sous-total articles</span>
                      <span className="font-semibold text-brand-charcoal">
                        {formatPrice(subtotal)} DZD
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-brand-dark/70">
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-brand-red" />
                        Livraison Yalidine ({currentWilaya.name})
                      </span>
                      <span className="font-semibold text-brand-charcoal">
                        {formatPrice(shippingFee)} DZD
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-brand-light-gray pt-3 text-base font-black text-brand-charcoal">
                      <span>Total TTC</span>
                      <span className="text-brand-red text-lg">
                        {formatPrice(grandTotal)} DZD
                      </span>
                    </div>
                  </div>

                  {/* Security Assurance */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-brand-warm-gray text-center">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Expédition officielle garantie par Yalidine Express
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
