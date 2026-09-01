import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Check,
  ShieldCheck,
  X,
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Store
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCatalogStore } from "@/lib/store/useCatalogStore";

const CATEGORY_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  Sparkles,
};

// Rich section configurations mimicking enterprise print platforms like Vistaprint
interface MegaMenuSection {
  title: string;
  items: { name: string; subSlug?: string; is3D?: boolean }[];
}

const CATEGORY_MEGA_DATA: Record<
  string,
  {
    sections: MegaMenuSection[];
    promo: {
      title: string;
      subtitle: string;
      image: string;
      actionText: string;
    };
  }
> = {
  "communication-visuelle": {
    sections: [
      {
        title: "Cartes & Formats",
        items: [
          { name: "Cartes de visite Standard", subSlug: "cartes-visite" },
          { name: "Coins arrondis & Carré", subSlug: "cartes-visite" },
          { name: "Format Slim & Déplié", subSlug: "cartes-visite" },
          { name: "Cartes de fidélité & RDV", subSlug: "cartes-visite" },
        ],
      },
      {
        title: "Papiers & Finitions",
        items: [
          { name: "Mat & Brillant classique", subSlug: "affiches-flyers" },
          { name: "Pelliculage Soft-Touch", subSlug: "cartes-visite" },
          { name: "Vernis sélectif 3D relief", subSlug: "cartes-visite", is3D: true },
          { name: "Dorure à chaud Or / Argent", subSlug: "cartes-visite" },
        ],
      },
      {
        title: "Flyers & Événementiel",
        items: [
          { name: "Flyers A5 & A6 promotionnels", subSlug: "affiches-flyers" },
          { name: "Brochures & Catalogues multipages", subSlug: "brochures" },
          { name: "Roll-Up & Kakémonos alu", subSlug: "supports-evenementiels", is3D: true },
          { name: "Banderoles & Affiches grand format", subSlug: "supports-evenementiels" },
        ],
      },
    ],
    promo: {
      title: "Cartes de Visite Soft-Touch",
      subtitle: "Effet velours & vernis sélectif pour une première impression inoubliable.",
      image: "/lamsa2.png",
      actionText: "Voir les options",
    },
  },
  "identite-visuelle": {
    sections: [
      {
        title: "Création de Marque",
        items: [
          { name: "Création de Logo Unique", subSlug: "creation-logo" },
          { name: "Charte Graphique Complète", subSlug: "charte-graphique" },
          { name: "Guide de Marque & Normes", subSlug: "guide-marque" },
        ],
      },
      {
        title: "Supports Corporate",
        items: [
          { name: "Papier en-tête & Enveloppes", subSlug: "charte-graphique" },
          { name: "Pochettes à rabat d'entreprise", subSlug: "charte-graphique" },
          { name: "Signature mail & Templates", subSlug: "palette-typo" },
        ],
      },
      {
        title: "Univers Graphique",
        items: [
          { name: "Palette de couleurs calibrée", subSlug: "palette-typo" },
          { name: "Pack Typographies officielles", subSlug: "palette-typo" },
          { name: "Éléments visuels & Motifs", subSlug: "guide-marque" },
        ],
      },
    ],
    promo: {
      title: "Pack Identité Complète",
      subtitle: "Logo vectoriel, charte graphique et déclinaisons tous supports.",
      image: "/lamsa2.png",
      actionText: "Découvrir les offres",
    },
  },
  "impression-production": {
    sections: [
      {
        title: "Stickers & Découpes",
        items: [
          { name: "Stickers Vinyle Forme Libre", subSlug: "stickers", is3D: true },
          { name: "Stickers Holographiques & Dorés", subSlug: "stickers" },
          { name: "Planches d'autocollants", subSlug: "stickers" },
          { name: "Stickers vitrine & micro-perforé", subSlug: "stickers" },
        ],
      },
      {
        title: "Étiquettes & Packaging",
        items: [
          { name: "Étiquettes Produits en rouleau", subSlug: "etiquettes" },
          { name: "Boîtes & Packaging sur-mesure", subSlug: "packaging", is3D: true },
          { name: "Coffrets cadeaux luxe cartonnés", subSlug: "packaging" },
          { name: "Cartes de remerciement personnalisées", subSlug: "cartes-remerciement" },
        ],
      },
      {
        title: "Finitions Industrielles",
        items: [
          { name: "Résistant à l'eau & UV", subSlug: "stickers" },
          { name: "Pelliculage mat & brillant", subSlug: "etiquettes" },
          { name: "Finition Kraft & Écologique", subSlug: "packaging" },
        ],
      },
    ],
    promo: {
      title: "Packaging Luxe & Stickers",
      subtitle: "Sublimez vos produits avec nos boîtes rigides et autocollants pro.",
      image: "/lamsa2.png",
      actionText: "Configurer les options",
    },
  },
  "signaletique-led": {
    sections: [
      {
        title: "Néons Lumineux",
        items: [
          { name: "Néon LED Personnalisé", subSlug: "neon-led", is3D: true },
          { name: "Néon Logo d'Entreprise", subSlug: "neon-led" },
          { name: "Néon Décoratif Événements", subSlug: "decoration-murale" },
        ],
      },
      {
        title: "Enseignes & Caissons",
        items: [
          { name: "Enseignes Lumineuses Rétroéclairées", subSlug: "enseignes-lumineuses" },
          { name: "Caissons lumineux double face", subSlug: "enseignes-lumineuses" },
          { name: "Lettres découpées en relief 3D", subSlug: "enseignes-lumineuses" },
        ],
      },
      {
        title: "Signalétique Bâtiment",
        items: [
          { name: "Plaques professionnelles plexiglas", subSlug: "signaletique-interieure" },
          { name: "Panneaux directionnels intérieurs", subSlug: "signaletique-interieure" },
          { name: "Habillage mural décoratif", subSlug: "decoration-murale" },
        ],
      },
    ],
    promo: {
      title: "Signalétique & Néons LED",
      subtitle: "Donnez vie à votre espace avec nos enseignes lumineuses.",
      image: "/lamsa2.png",
      actionText: "Voir les réalisations",
    },
  },
  "textile-personnalise": {
    sections: [
      {
        title: "Vêtements Personnalisés",
        items: [
          { name: "T-Shirts Coton Bio 220g", subSlug: "tshirts-polos", is3D: true },
          { name: "Polos brodés d'entreprise", subSlug: "tshirts-polos" },
          { name: "Sweats & Hoodies personnalisés", subSlug: "tshirts-polos" },
        ],
      },
      {
        title: "Uniformes Professionnels",
        items: [
          { name: "Tabliers & Tenues restauration", subSlug: "uniformes" },
          { name: "Gilets de sécurité & Vêtements de travail", subSlug: "uniformes" },
          { name: "Uniformes médicaux & blouses", subSlug: "uniformes" },
        ],
      },
      {
        title: "Accessoires & Goodies",
        items: [
          { name: "Tote-Bags en coton naturel", subSlug: "accessoires-textiles" },
          { name: "Casquettes brodées", subSlug: "accessoires-textiles" },
          { name: "Packs textile événementiel", subSlug: "textile-evenementiel" },
        ],
      },
    ],
    promo: {
      title: "Textile & Sérigraphie DTF",
      subtitle: "Marquage haute définition résistant aux lavages fréquents.",
      image: "/lamsa2.png",
      actionText: "Personnaliser T-shirt 3D",
    },
  },
  "commandes-sur-mesure": {
    sections: [
      {
        title: "Packs Startup & Entreprise",
        items: [
          { name: "Pack Démarrage Startup", subSlug: "kits-communication" },
          { name: "Kit Événementiel & Salons", subSlug: "kits-communication" },
          { name: "Goodies & Coffrets VIP Entreprise", subSlug: "cadeaux-entreprise" },
        ],
      },
      {
        title: "Grandes Séries & B2B",
        items: [
          { name: "Commandes Grand Volume (Devis dégressif)", subSlug: "grandes-series" },
          { name: "Production multi-sites 58 Wilayas", subSlug: "grandes-series" },
          { name: "Accompagnement Graphiste Dédié", subSlug: "kits-communication" },
        ],
      },
    ],
    promo: {
      title: "Packs Sur Mesure Lamsa",
      subtitle: "Tout votre branding réuni dans une commande unique prête à l'emploi.",
      image: "/lamsa2.png",
      actionText: "Demander un devis",
    },
  },
};

export function ShopMegaNav() {
  const {
    categories,
    activeCategoryId,
    activeSubCategoryId,
    setActiveCategory,
    setActiveSubCategory,
  } = useCatalogStore();

  const [hoveredCategorySlug, setHoveredCategorySlug] = React.useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const navContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mega menu on mouse leave
  const handleMouseLeave = () => {
    setHoveredCategorySlug(null);
  };

  const handleSelectSub = (catId: string | null, subId?: string | null) => {
    setActiveCategory(catId);
    setActiveSubCategory(subId || null);
    setHoveredCategorySlug(null);
    setIsMobileDrawerOpen(false);
  };

  const currentHoveredCat = categories.find((c) => c.slug === hoveredCategorySlug);
  const megaData = hoveredCategorySlug ? CATEGORY_MEGA_DATA[hoveredCategorySlug] : null;
  const currentActiveCat = categories.find((c) => c.id === activeCategoryId);

  React.useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  return (
    <nav
      ref={navContainerRef}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full transition-colors duration-150 ${hoveredCategorySlug ? "bg-background" : ""} ${isMobileDrawerOpen ? "z-[999]" : "z-40"}`}
    >
      <Container as="div">
        {/* ── Desktop Category Navigation Strip ───────────────────────── */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {/* All Products Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory(null);
                setActiveSubCategory(null);
                setHoveredCategorySlug(null);
              }}
              className={`relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${activeCategoryId === null
                ? "bg-brand-charcoal text-white shadow-sm"
                : "text-brand-charcoal hover:bg-brand-soft-white"
                }`}
            >
              Tous les produits
            </button>

            {/* Category Tabs with hover mega-menu triggers */}
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              const isHovered = hoveredCategorySlug === cat.slug;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategorySlug(cat.slug)}
                  className="relative py-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setActiveSubCategory(null);
                      setHoveredCategorySlug(null);
                    }}
                    className={`flex items-center gap-1.5 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${isActive
                      ? "bg-brand-red text-white shadow-[0_4px_14px_-3px_rgba(227,6,19,0.5)]"
                      : isHovered
                        ? "bg-brand-soft-white text-brand-red"
                        : "text-brand-charcoal/80 hover:bg-brand-soft-white hover:text-brand-charcoal"
                      }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${isHovered ? "rotate-180 text-brand-red" : "text-brand-warm-gray"
                        }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile Category Navigation Bar (Clean Rayons Trigger) ────── */}
        <div className="py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-brand-light-gray/80 bg-white p-2 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 px-1 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft-white text-brand-red flex-shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-warm-gray">
                  Rayon sélectionné
                </span>
                <span className="text-xs font-black text-brand-charcoal truncate">
                  {currentActiveCat?.name || "Tous les produits"}
                </span>
              </div>
            </div>
          </button>
        </div>
      </Container>

      {/* ── Desktop Mega Menu Dropdown Panel (Vistaprint Style) ─────── */}
      <AnimatePresence>
        {hoveredCategorySlug && currentHoveredCat && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 hidden border-b border-brand-light-gray/80 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.06)] lg:block"
          >
            <Container as="div" className="py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Left columns: Sub-Categories & Organized Sections */}
                <div className="col-span-8 grid grid-cols-3 gap-6">
                  {megaData?.sections && megaData.sections.length > 0 ? (
                    megaData.sections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-brand-charcoal border-b border-brand-light-gray/60 pb-2">
                          {section.title}
                        </h4>
                        <ul className="space-y-1.5">
                          {section.items.map((item, iIdx) => {
                            const matchedSub = currentHoveredCat.subCategories.find(
                              (s) => s.slug === item.subSlug
                            );
                            return (
                              <li key={iIdx}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSelectSub(currentHoveredCat.id, matchedSub?.id)
                                  }
                                  className="group flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs font-medium text-brand-dark/75 transition-colors hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer"
                                >
                                  <span className="group-hover:text-brand-red transition-colors flex items-center gap-1.5">
                                    {item.name}
                                    {item.is3D && (
                                      <span className="rounded bg-brand-red/10 px-1 py-0.2 text-[9px] font-bold text-brand-red">
                                        3D
                                      </span>
                                    )}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                  ) : (
                    // Default fallback: direct list of subcategories
                    <div className="col-span-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-brand-charcoal border-b border-brand-light-gray/60 pb-2">
                        Sous-catégories {currentHoveredCat.name}
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {currentHoveredCat.subCategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectSub(currentHoveredCat.id, sub.id)}
                            className="rounded-lg p-2.5 text-left text-xs font-semibold text-brand-charcoal hover:bg-brand-soft-white hover:text-brand-red transition-colors"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column: Promotional Showcase Card */}
                {(() => {
                  const categoryMainImage =
                    currentHoveredCat.image ||
                    (currentHoveredCat.images && currentHoveredCat.images.length > 0
                      ? currentHoveredCat.images[0]
                      : null) ||
                    megaData?.promo.image ||
                    "/lamsa2.png";

                  return (
                    <div className="col-span-4 border-l border-brand-light-gray/60 pl-8">
                      <div className="relative overflow-hidden rounded-2xl border border-brand-light-gray/70 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-black text-brand-charcoal">
                          {currentHoveredCat.name || megaData?.promo.title}
                        </h3>
                        <p className="mt-1 text-xs text-brand-warm-gray leading-relaxed">
                          {currentHoveredCat.description || megaData?.promo.subtitle}
                        </p>

                        <div className="relative mt-4 h-32 w-full overflow-hidden rounded-xl bg-brand-soft-white/60 border border-brand-light-gray/50 p-2.5 flex items-center justify-center">
                          <img
                            src={categoryMainImage}
                            alt={currentHoveredCat.name || "Catégorie"}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectSub(currentHoveredCat.id)}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] cursor-pointer"
                        >
                          <span>{megaData?.promo.actionText || "Voir tous les modèles"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Accordion / Drawer (Rayons & Subcategories) Teleported to Body ─────── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isMobileDrawerOpen && (
              <div className="fixed inset-0 z-[9999] lg:hidden">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                />

                {/* Slide-over panel */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  className="fixed inset-y-0 left-0 flex w-[85vw] max-w-sm h-full flex-col bg-white shadow-2xl z-[10000]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-brand-light-gray px-5 py-4 bg-white flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft-white text-brand-red">
                        <Store className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-brand-charcoal">
                          Rayons & Catégories
                        </h3>
                        <p className="text-[10px] text-brand-warm-gray font-medium">
                          Boutique Lamsa Communication
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Category Tree */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                    {/* All products button */}
                    <button
                      type="button"
                      onClick={() => handleSelectSub(null, null)}
                      className={`flex w-full items-center justify-between rounded-xl p-3 text-xs font-bold transition-all cursor-pointer ${activeCategoryId === null
                        ? "bg-brand-charcoal text-white shadow-sm"
                        : "bg-brand-soft-white text-brand-charcoal hover:bg-brand-light-gray/50"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-brand-red" />
                        Tous les produits de la boutique
                      </span>
                      {activeCategoryId === null && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>

                    <div className="pt-2 pb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-warm-gray px-1">
                        Nos Rayons
                      </span>
                    </div>

                    {categories.map((cat) => {
                      const isExpanded = mobileExpandedCat === cat.id;
                      const isCatActive = activeCategoryId === cat.id;
                      const IconComp = CATEGORY_ICON_MAP[cat.icon] || Sparkles;

                      return (
                        <div
                          key={cat.id}
                          className={`rounded-2xl border transition-all overflow-hidden ${isCatActive
                            ? "border-brand-red/40 bg-brand-red/[0.02]"
                            : "border-brand-light-gray/80 bg-white"
                            }`}
                        >
                          {/* Main category row */}
                          <div className="flex items-center justify-between p-1.5">
                            <button
                              type="button"
                              onClick={() => handleSelectSub(cat.id, null)}
                              className="flex flex-1 items-center gap-2.5 text-left rounded-xl p-1.5 transition-colors hover:bg-brand-soft-white cursor-pointer"
                            >
                              <div
                                className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl transition-colors ${isCatActive
                                  ? "bg-brand-red text-white"
                                  : "bg-brand-soft-white text-brand-charcoal"
                                  }`}
                              >
                                {cat.image || (cat.images && cat.images.length > 0 ? cat.images[0] : null) ? (
                                  <img
                                    src={cat.image || (cat.images && cat.images[0]) || ""}
                                    alt={cat.name}
                                    className="h-full w-full object-contain p-1"
                                  />
                                ) : (
                                  <IconComp className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className={`text-xs font-bold ${isCatActive
                                    ? "text-brand-red font-black"
                                    : "text-brand-charcoal"
                                    }`}
                                >
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-brand-warm-gray">
                                  {cat.subCategories.length} sous-catégories
                                </span>
                              </div>
                            </button>

                            {cat.subCategories.length > 0 && (
                              <button
                                type="button"
                                aria-label={`Ouvrir ${cat.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMobileExpandedCat(isExpanded ? null : cat.id);
                                }}
                                className={`flex h-8 w-8 items-center justify-center rounded-xl text-brand-warm-gray transition-all hover:bg-brand-soft-white hover:text-brand-charcoal cursor-pointer ${isExpanded ? "bg-brand-soft-white text-brand-red" : ""
                                  }`}
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-brand-red" : ""
                                    }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Expandable sub-categories */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="border-t border-brand-light-gray/60 bg-[#f9f9f9]/80 p-2 space-y-1"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectSub(cat.id, null)}
                                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-brand-charcoal hover:bg-white hover:text-brand-red transition-colors cursor-pointer"
                                >
                                  <span>Voir toute la catégorie &rarr;</span>
                                  <ChevronRight className="h-3 w-3 text-brand-warm-gray" />
                                </button>

                                {cat.subCategories.map((sub) => {
                                  const isSubActive =
                                    activeCategoryId === cat.id &&
                                    activeSubCategoryId === sub.id;
                                  return (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => handleSelectSub(cat.id, sub.id)}
                                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${isSubActive
                                        ? "bg-brand-red text-white font-bold shadow-xs"
                                        : "text-brand-dark/80 hover:bg-white hover:text-brand-charcoal"
                                        }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <span
                                          className={`h-1.5 w-1.5 rounded-full ${isSubActive
                                            ? "bg-white"
                                            : "bg-brand-warm-gray/40"
                                            }`}
                                        />
                                        {sub.name}
                                      </span>
                                      {isSubActive && (
                                        <Check className="h-3.5 w-3.5 text-white" />
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-brand-light-gray p-4 bg-brand-soft-white/50 flex-shrink-0">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-brand-warm-gray">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Livraison express Yalidine dans 69 wilayas</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  );
}
