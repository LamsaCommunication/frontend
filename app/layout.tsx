import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/providers/motion-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Lamsa Communication",
  description:
    "Studio créatif premium à Blida, Algérie, spécialisé en design graphique, identité visuelle, impression personnalisée, stickers, étiquettes, cartes de remerciement, enseignes Neon LED, packaging et commandes créatives sur mesure.",
  url: "https://lamsadz.com",
  telephone: "+213554776283",
  email: "contact@lamsadz.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue Cherif Chalabi, Passage N°E",
    addressLocality: "Blida",
    postalCode: "09000",
    addressCountry: "DZ",
  },
  image: "https://lamsadz.com/lamsa2.png",
  logo: "https://lamsadz.com/lamsa2.png",
  sameAs: [
    "https://www.facebook.com/lamsa.communication",
    "https://www.instagram.com/lamsa_communication/",
    "https://www.tiktok.com/@lamsa_com",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de communication visuelle",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Design Graphique", description: "Affiches, flyers, brochures, cartes de visite et supports visuels." },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Impression & Production", description: "Stickers, étiquettes, packaging et impressions premium sur mesure." },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Identité Visuelle & Branding", description: "Logo, charte graphique et univers de marque cohérent." },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Enseignes Neon LED", description: "Enseignes lumineuses Neon LED personnalisées pour votre espace." },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Cartes de Remerciement", description: "Cartes sur mesure pour événements, mariages et fidélisation." },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Packaging & Communication", description: "Packaging créatif et produits de communication sur mesure." },
      },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lamsadz.com"),
  title: {
    default: "Lamsa Communication — Design Graphique, Impression & Branding à Blida, Algérie",
    template: "%s | Lamsa Communication",
  },
  description:
    "Lamsa Communication est un studio créatif premium à Blida, Algérie. Spécialisé en design graphique, branding, impression personnalisée, stickers, étiquettes, cartes de remerciement, enseignes Neon LED et packaging. Devis gratuit sous 24h.",
  keywords: [
    "Lamsa Communication",
    "design graphique Blida",
    "design graphique Algérie",
    "studio communication Algérie",
    "impression personnalisée Algérie",
    "stickers Algérie",
    "étiquettes personnalisées",
    "cartes de remerciement",
    "neon LED Algérie",
    "enseignes lumineuses",
    "branding Algérie",
    "identité visuelle",
    "logo Algérie",
    "packaging Algérie",
    "flyers affiches",
    "studio impression Blida",
    "communication visuelle",
    "devis design",
  ],
  authors: [{ name: "Lamsa Communication", url: "https://lamsadz.com" }],
  creator: "Lamsa Communication",
  publisher: "Lamsa Communication",
  applicationName: "Lamsa Communication",
  alternates: {
    canonical: "https://lamsadz.com",
  },
  openGraph: {
    title: "Lamsa Communication — Design Graphique, Impression & Branding",
    description:
      "Studio créatif premium à Blida, Algérie. Design graphique, branding, impression sur mesure, neon LED, stickers et packaging. Devis gratuit sous 24h.",
    url: "https://lamsadz.com",
    siteName: "Lamsa Communication",
    locale: "fr_DZ",
    type: "website",
    images: [
      {
        url: "/lamsa2.png",
        width: 1200,
        height: 630,
        alt: "Lamsa Communication — Studio créatif à Blida, Algérie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamsa Communication — Design Graphique & Impression en Algérie",
    description:
      "Studio créatif premium à Blida, Algérie. Design, branding, impression, neon LED. Devis gratuit sous 24h.",
    images: ["/lamsa2.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CatalogProvider } from "@/components/providers/catalog-provider";
import { HashUrlCleaner } from "@/components/layout/HashUrlCleaner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <MotionProvider>
          <CatalogProvider>
            <div className="flex min-h-full flex-1 flex-col">
              <HashUrlCleaner />
              {children}
              <CartDrawer />
            </div>
          </CatalogProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
