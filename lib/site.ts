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
    { label: "Boutique", href: "/shop" },
    { label: "Contact", href: "/#contact" },
    { label: "FAQ", href: "/faq" },
  ],
} as const;

export const stats = [
  { value: "+800", label: "Projets réalisés" },
  { value: "+500", label: "Clients satisfaits" },
  { value: "+11", label: "Années d'expérience" },
] as const;


