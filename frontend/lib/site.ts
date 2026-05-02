export const site = {
  name: "Lamsa Communication",
  tagline: "C'est aussi simple que ça",
  url: "https://lamsadz.com",
  email: "contact@lamsadz.com",
  phones: ["+213 554 776 283", "+213 540 819 434"],
  whatsapp: {
    number: "213554776283",
    link: "https://wa.me/213554776283",
  },
  socials: {
    facebook: "https://www.facebook.com/lamsa.communication",
    instagram: "https://www.instagram.com/lamsa_communication/",
    tiktok: "https://www.tiktok.com/@lamsa_com",
  },
  nav: [
    { label: "Process", href: "#services" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const services = [
  {
    id: "graphic-design",
    name: "Design Graphique",
    description:
      "Affiches, flyers, brochures, cartes de visite et supports visuels conçus avec précision.",
    icon: "Pencil",
  },
  {
    id: "thank-you-cards",
    name: "Cartes de Remerciement",
    description:
      "Cartes sur mesure pour vos événements, mariages et campagnes de fidélisation.",
    icon: "Heart",
  },
  {
    id: "stickers-labels",
    name: "Stickers & Étiquettes",
    description:
      "Stickers et étiquettes personnalisés, finitions premium et formes sur mesure.",
    icon: "Tag",
  },
  {
    id: "neon-led",
    name: "Enseignes Neon LED",
    description:
      "Enseignes lumineuses Neon LED uniques pour donner vie à votre espace.",
    icon: "Zap",
  },
  {
    id: "branding",
    name: "Branding & Identité Visuelle",
    description:
      "Création complète de l'identité de marque : logo, charte graphique, univers.",
    icon: "Palette",
  },
  {
    id: "print",
    name: "Impression & Sur Mesure",
    description:
      "Impression de qualité et commandes 100% personnalisées selon votre besoin.",
    icon: "Printer",
  },
  {
    id: "packaging",
    name: "Emballages & Communication",
    description:
      "Packaging créatif et produits de communication qui valorisent votre marque.",
    icon: "Package",
  },
] as const;

export const stats = [
  { value: "+800", label: "Projets réalisés" },
  { value: "+500", label: "Clients satisfaits" },
  { value: "8+", label: "Années d'expérience" },
] as const;
