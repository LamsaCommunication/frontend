"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";

const EASE = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    id: "start",
    question: "Comment démarrer un projet avec vous ?",
    answer:
      "C'est très simple : contactez-nous via WhatsApp ou par email. Nous étudions votre besoin et vous envoyons un devis personnalisé sous 24h. Aucun engagement avant validation de votre part.",
  },
  {
    id: "duration",
    question: "Quels sont vos délais de livraison ?",
    answer:
      "Les délais varient selon la complexité du projet. Pour une commande simple (stickers, cartes), comptez 24 à 72h. Pour un projet de branding complet, prévoyez 7 à 14 jours. Nous respectons toujours les délais convenus.",
  },
  {
    id: "delivery",
    question: "Est-ce que vous livrez partout en Algérie ?",
    answer:
      "Oui, nous livrons dans toute l'Algérie. Pour les commandes de grande envergure ou les clients à l'international, contactez-nous pour discuter des modalités.",
  },
  {
    id: "revisions",
    question: "Et si le design ne me convient pas ?",
    answer:
      "Votre satisfaction est notre priorité. Nous proposons des révisions jusqu'à ce que le résultat vous satisfasse pleinement. Nous travaillons en collaboration étroite avec vous à chaque étape.",
  },
  {
    id: "branding",
    question: "Pouvez-vous créer mon identité visuelle complète ?",
    answer:
      "Absolument. Nous proposons des packages de branding complets : logo, palette de couleurs, typographies, charte graphique et guide d'utilisation. Tout ce qu'il faut pour une image cohérente et professionnelle.",
  },
  {
    id: "payment",
    question: "Quels sont vos modes de paiement ?",
    answer:
      "Nous acceptons le virement bancaire CCP/CIB et le paiement en espèces. Pour les nouveaux clients, un acompte de 50 % est demandé à la commande, le solde à la livraison.",
  },
  {
    id: "pricing",
    question: "Comment sont calculés vos tarifs ?",
    answer:
      "Nos tarifs dépendent de la nature et de la complexité du projet. Nous établissons des devis personnalisés et transparents. Contactez-nous pour obtenir une estimation gratuite sans engagement.",
  },
] as const;

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.05 * index }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full rounded-2xl border px-6 py-5 text-left transition-all duration-200 ${
          open
            ? "border-brand-light-gray bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]"
            : "border-transparent bg-[#f5f5f5] hover:bg-[#efefef]"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-semibold text-brand-charcoal md:text-lg">
            {question}
          </span>
          <span className="flex-shrink-0 text-brand-red">
            {open ? (
              <Minus className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2} />
            )}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="mt-4 text-sm leading-relaxed text-brand-dark/70 md:text-base">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <Container as="div" className="py-20 md:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
              <span className="block h-px w-8 bg-brand-red" aria-hidden />
              Support
              <span className="block h-px w-8 bg-brand-red" aria-hidden />
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-brand-charcoal md:text-5xl lg:text-6xl">
              Questions fréquentes
            </h1>
            <p className="mt-5 text-base text-brand-dark/60 md:text-lg">
              Tout ce que vous devez savoir avant de commencer votre projet avec
              nous.
            </p>
          </motion.div>

          <div className="mx-auto mt-14 max-w-2xl space-y-3 md:mt-16">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-16 max-w-2xl rounded-3xl bg-[#f5f5f5] p-8 text-center md:mt-20 md:p-10"
          >
            <p className="text-base font-semibold text-brand-charcoal md:text-lg">
              Vous n&apos;avez pas trouvé votre réponse ?
            </p>
            <p className="mt-2 text-sm text-brand-dark/60">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
            <a
              href="https://wa.me/213554776283"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-red-hover hover:shadow-[0_10px_30px_-12px_rgba(227,6,19,0.55)] cursor-pointer"
            >
              Contactez-nous
            </a>
          </motion.div>

          <div className="mt-12 text-center">
            <Link
              href="/#accueil"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark/50 transition-colors hover:text-brand-charcoal"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
