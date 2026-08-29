export const site = {
  name: "Lamsa Communication",
  tagline: "C'est aussi simple que ça",
  url: "https://lamsadz.com",
  email: ["lamsa.communication@gmail.com", "contact@lamsadz.com"],
  phones: ["+213 (0) 554 776 283", "+213 (0) 540 819 434", "+213 (0) 20 514 776"],
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
    { label: "Accueil", href: "/#accueil" },
    { label: "Agence", href: "/agence" },
    { label: "Réalisation", href: "/#etapes" },
    { label: "Contact", href: "/#contact" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;

export const stats = [
  { value: "+800", label: "Projets réalisés" },
  { value: "+500", label: "Clients satisfaits" },
  { value: "+11", label: "Années d'expérience" },
] as const;

export const agenceCategories = [
  {
    id: "communication-visuelle",
    name: "Communication Visuelle",
    description:
      "Affiches, flyers, brochures et supports imprimés conçus pour marquer les esprits.",
    icon: "Pencil",
    tags: ["Affiches", "Flyers", "Brochures", "Cartes"],
    services: [
      {
        id: "affiches-flyers",
        name: "Affiches & Flyers",
        description: "Supports promotionnels percutants pour vos campagnes.",
      },
      {
        id: "brochures",
        name: "Brochures & Catalogues",
        description: "Documents de présentation élégants et professionnels.",
      },
      {
        id: "cartes-visite",
        name: "Cartes de visite",
        description: "Premières impressions mémorables, finitions premium.",
      },
      {
        id: "supports-evenementiels",
        name: "Supports Événementiels",
        description: "Roll-up, kakémonos et banderoles pour vos événements.",
      },
    ],
  },
  {
    id: "identite-visuelle",
    name: "Identité Visuelle",
    description:
      "Logo, charte graphique et univers de marque cohérents pour une image professionnelle.",
    icon: "Palette",
    tags: ["Logo", "Branding", "Charte graphique"],
    services: [
      {
        id: "creation-logo",
        name: "Création de Logo",
        description: "Logos uniques qui reflètent l'âme de votre marque.",
      },
      {
        id: "charte-graphique",
        name: "Charte Graphique",
        description: "Guide complet pour une identité visuelle cohérente.",
      },
      {
        id: "palette-typo",
        name: "Palette & Typographies",
        description: "Couleurs et polices soigneusement choisies pour votre univers.",
      },
      {
        id: "guide-marque",
        name: "Guide de Marque",
        description: "Documentation pour assurer la cohérence sur tous vos supports.",
      },
    ],
  },
  {
    id: "impression-production",
    name: "Impression & Packging",
    description:
      "Stickers, étiquettes, packaging premium — qualité supérieure garantie à chaque commande.",
    icon: "Printer",
    tags: ["Stickers", "Étiquettes", "Packaging"],
    services: [
      {
        id: "stickers",
        name: "Stickers & Autocollants",
        description: "Découpés, formes libres, finitions mat ou brillant.",
      },
      {
        id: "etiquettes",
        name: "Étiquettes Personnalisées",
        description: "Étiquettes produits avec finitions professionnelles.",
      },
      {
        id: "packaging",
        name: "Packaging Créatif",
        description: "Emballages personnalisés qui valorisent vos produits.",
      },
      {
        id: "cartes-remerciement",
        name: "Cartes de Remerciement",
        description: "Cartes sur mesure pour fidéliser vos clients.",
      },
      {
        id: "cartes-de-visite",
        name: "Carte de Visite",
        description: "Valorisez votre image de marque et marquez les esprits dès la première rencontre.",
      },
      {
        id: "cartes-tags",
        name: "Cartes de tags",
        description: "Facilitez le partage de vos données et connectez vos clients à votre univers en un seul geste.",
      },
    ],
  },
  {
    id: "signaletique-led",
    name: "Signalétique & Neon LED",
    description:
      "Enseignes lumineuses sur mesure qui donnent vie à votre espace et renforcent votre présence.",
    icon: "Zap",
    tags: ["Neon LED", "Enseignes", "Signalétique"],
    services: [
      {
        id: "neon-led",
        name: "Neon LED",
        description: "Néons lumineux sur mesure pour intérieur et extérieur.",
      },
      {
        id: "enseignes-lumineuses",
        name: "Enseignes Lumineuses",
        description: "Caissons lumineux et enseignes rétroéclairées.",
      },
      {
        id: "signaletique-interieure",
        name: "Signalétique Intérieure",
        description: "Panneaux directionnels et signalétique pour vos locaux.",
      },
      {
        id: "decoration-murale",
        name: "Décoration Murale",
        description: "Installations lumineuses décoratives pour votre espace.",
      },
    ],
  },
  {
    id: "textile-personnalise",
    name: "Textile Personnalisé",
    description:
      "Vêtements brodés ou imprimés pour votre marque, votre équipe ou vos événements.",
    icon: "Shirt",
    tags: ["T-shirts", "Broderie", "Uniformes"],
    services: [
      {
        id: "tshirts-polos",
        name: "T-shirts & Polos",
        description: "Sérigraphie | DTF | Broderie | Flex découpe",
      },
      {
        id: "uniformes",
        name: "Uniformes Professionnels",
        description: "Tenues corporate cohérentes pour votre équipe.",
      },
      {
        id: "accessoires-textiles",
        name: "Accessoires Textiles",
        description: "Casquettes, sacs, tabliers et articles dérivés.",
      },
      {
        id: "textile-evenementiel",
        name: "Textile Événementiel",
        description: "Collections spéciales pour vos événements et promotions.",
      },
    ],
  },
  {
    id: "commandes-sur-mesure",
    name: "Commandes Sur Mesure",
    description:
      "Chaque projet unique traité avec créativité et savoir-faire — aucune limite à la création.",
    icon: "Sparkles",
    tags: ["Unique", "Créatif", "Sur mesure"],
    services: [
      {
        id: "projets-speciaux",
        name: "Projets Spéciaux",
        description: "Réalisations hors catalogue selon votre brief créatif.",
      },
      {
        id: "kits-communication",
        name: "Kits de Communication",
        description: "Ensembles complets de supports pour lancer votre marque.",
      },
      {
        id: "cadeaux-entreprise",
        name: "Cadeaux d'Entreprise",
        description: "Articles promotionnels personnalisés pour vos clients.",
      },
      {
        id: "grandes-series",
        name: "Grandes Séries",
        description: "Production en volume avec tarifs dégressifs négociés.",
      },
    ],
  },
] as const;

export const categoryImages: Record<string, string[]> = {
  "communication-visuelle": [
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
  ],
  "identite-visuelle": [
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
  ],
  "impression-production": [
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
  ],
  "signaletique-led": [
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
  ],
  "textile-personnalise": [
    "/lamsa2.png",
    "/lamsa2.png",
    "/lamsa2.png",
  ],
  "commandes-sur-mesure": [],
};
