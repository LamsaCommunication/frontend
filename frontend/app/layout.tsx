import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Lamsa Communication — Design, Print & Creative Studio",
  description:
    "Lamsa Communication est un studio créatif premium spécialisé en communication visuelle, design graphique, branding, impression personnalisée, stickers, étiquettes, cartes de remerciement, enseignes Neon LED, packaging et commandes créatives sur mesure.",
  keywords: [
    "Lamsa Communication",
    "design graphique Algérie",
    "stickers Algérie",
    "cartes de remerciement",
    "neon LED",
    "branding",
    "studio d'impression",
    "studio de communication",
    "design graphique",
    "Algérie",
    "neon",
    "communication",
    "studio",
  ],
  authors: [{ name: "Lamsa Communication" }],
  creator: "Lamsa Communication",
  metadataBase: new URL("https://lamsadz.com"),
  openGraph: {
    title: "Lamsa Communication — Design, Print & Creative Studio",
    description:
      "Studio créatif premium spécialisé en design graphique, impression, identité visuelle et solutions de communication sur mesure.",
    url: "https://lamsadz.com",
    siteName: "Lamsa Communication",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/lamsa2.PNG",
        width: 1200,
        height: 630,
        alt: "Lamsa Communication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamsa Communication — Design, Print & Creative Studio",
    description:
      "Studio créatif premium spécialisé en design graphique, impression, identité visuelle et solutions de communication sur mesure.",
    images: ["/lamsa2.PNG"],
  },
  icons: {
    icon: "/lamsa1.PNG",
    apple: "/lamsa1.PNG",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
