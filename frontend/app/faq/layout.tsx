import type { Metadata } from "next";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment démarrer un projet avec Lamsa Communication ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "C'est très simple : contactez-nous via WhatsApp ou par email. Nous étudions votre besoin et vous envoyons un devis personnalisé sous 24h. Aucun engagement avant validation de votre part.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les délais de livraison de Lamsa Communication ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les délais varient selon la complexité du projet. Pour une commande simple (stickers, cartes), comptez 24 à 72h. Pour un projet de branding complet, prévoyez 7 à 14 jours. Nous respectons toujours les délais convenus.",
      },
    },
    {
      "@type": "Question",
      name: "Est-ce que Lamsa Communication livre partout en Algérie ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, nous livrons dans toute l'Algérie. Pour les commandes de grande envergure ou les clients à l'international, contactez-nous pour discuter des modalités.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si le design ne me convient pas ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Votre satisfaction est notre priorité. Nous proposons des révisions jusqu'à ce que le résultat vous satisfasse pleinement. Nous travaillons en collaboration étroite avec vous à chaque étape.",
      },
    },
    {
      "@type": "Question",
      name: "Pouvez-vous créer mon identité visuelle complète ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolument. Nous proposons des packages de branding complets : logo, palette de couleurs, typographies, charte graphique et guide d'utilisation. Tout ce qu'il faut pour une image cohérente et professionnelle.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les modes de paiement acceptés ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nous acceptons le virement bancaire CCP/CIB et le paiement en espèces. Pour les nouveaux clients, un acompte de 50 % est demandé à la commande, le solde à la livraison.",
      },
    },
    {
      "@type": "Question",
      name: "Comment sont calculés les tarifs de Lamsa Communication ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nos tarifs dépendent de la nature et de la complexité du projet. Nous établissons des devis personnalisés et transparents. Contactez-nous pour obtenir une estimation gratuite sans engagement.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Questions Fréquentes",
  description:
    "Découvrez les réponses aux questions les plus fréquentes sur les services de Lamsa Communication : délais, tarifs, révisions, livraison, branding et modes de paiement.",
  alternates: {
    canonical: "https://lamsadz.com/faq",
  },
  openGraph: {
    title: "FAQ — Questions Fréquentes | Lamsa Communication",
    description:
      "Tout ce que vous devez savoir avant de démarrer votre projet avec Lamsa Communication : délais, tarifs, révisions et livraison.",
    url: "https://lamsadz.com/faq",
    type: "website",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
