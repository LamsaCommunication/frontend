import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre Agence",
  description:
    "Découvrez Lamsa Communication — studio créatif spécialisé en design graphique, impression, identité visuelle, signalétique LED et communication globale depuis plus de 8 ans.",
  alternates: {
    canonical: "https://lamsadz.com/agence",
  },
  openGraph: {
    title: "Notre Agence | Lamsa Communication",
    description:
      "Un studio créatif où chaque détail compte. Design graphique, branding, impression et Neon LED — tout ce qu'il faut pour une communication visuelle forte.",
    url: "https://lamsadz.com/agence",
    type: "website",
  },
};

export default function AgenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
