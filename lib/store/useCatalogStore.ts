import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId: string;
}

export interface CategoryService {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string; // Lucide icon key
  image?: string; // Main single category image
  tags?: string[];
  images?: string[]; // Main category realization images displayed on /agence
  services?: CategoryService[]; // "Nos engagements & livrables" for /agence
  subCategories: SubCategory[];
}

export type Product3DModelType = "mug" | "tshirt" | "cap" | "none";

export interface Product {
  id: string;
  categoryId: string;
  subCategoryId?: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in DZD
  stock: number;
  images: string[];
  isActive: boolean;
  modelType: Product3DModelType;
  availableColors?: string[]; // When 3D is disabled, available colors for 2D details page
  dimensions?: string;
  minQuantity?: number;
  featured?: boolean;
  createdAt: string;
}

interface CatalogState {
  categories: Category[];
  products: Product[];
  activeCategoryId: string | null;
  activeSubCategoryId: string | null;
  searchQuery: string;
  sortBy: "popular" | "price_asc" | "price_desc" | "newest";
  
  // Actions
  setActiveCategory: (categoryId: string | null) => void;
  setActiveSubCategory: (subCategoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: "popular" | "price_asc" | "price_desc" | "newest") => void;
  
  // Admin CRUD
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubCategory: (categoryId: string, subCategory: Omit<SubCategory, "id" | "parentId">) => void;
  updateSubCategory: (categoryId: string, subCategoryId: string, updates: Partial<SubCategory>) => void;
  deleteSubCategory: (categoryId: string, subCategoryId: string) => void;
  addCategoryImage: (categoryId: string, imageUrl: string) => void;
  removeCategoryImage: (categoryId: string, imageIndex: number) => void;
  addCategoryService: (categoryId: string, service: Omit<CategoryService, "id">) => void;
  updateCategoryService: (categoryId: string, serviceId: string, updates: Partial<CategoryService>) => void;
  deleteCategoryService: (categoryId: string, serviceId: string) => void;
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "communication-visuelle",
    name: "Communication Visuelle",
    description: "Affiches, flyers, brochures et supports imprimés conçus pour marquer les esprits.",
    icon: "Pencil",
    tags: ["Affiches", "Flyers", "Brochures", "Cartes"],
    images: ["/donner_vie_vos_idees_hero.svg", "/lamsa2.png", "/logoFOOTER.avif"],
    services: [
      { id: "srv-1-1", name: "Affiches & Flyers", description: "Supports promotionnels percutants pour vos campagnes." },
      { id: "srv-1-2", name: "Brochures & Catalogues", description: "Documents de présentation élégants et professionnels." },
      { id: "srv-1-3", name: "Cartes de visite", description: "Premières impressions mémorables, finitions premium." },
      { id: "srv-1-4", name: "Supports Événementiels", description: "Roll-up, kakémonos et banderoles pour vos événements." },
    ],
    subCategories: [
      { id: "sub-1-1", slug: "affiches-flyers", name: "Affiches & Flyers", parentId: "cat-1" },
      { id: "sub-1-2", slug: "brochures", name: "Brochures & Catalogues", parentId: "cat-1" },
      { id: "sub-1-3", slug: "cartes-visite", name: "Cartes de Visite Premium", parentId: "cat-1" },
      { id: "sub-1-4", slug: "supports-evenementiels", name: "Supports Événementiels", parentId: "cat-1" },
    ]
  },
  {
    id: "cat-2",
    slug: "identite-visuelle",
    name: "Identité Visuelle",
    description: "Logo, charte graphique et univers de marque complet pour une présence inoubliable.",
    icon: "Palette",
    tags: ["Logo", "Branding", "Charte graphique"],
    images: ["/comprendre_votre_vision_hero.svg", "/lamsa2.png", "/logoFOOTER.avif"],
    services: [
      { id: "srv-2-1", name: "Création de Logo", description: "Logos uniques qui reflètent l'âme de votre marque." },
      { id: "srv-2-2", name: "Charte Graphique", description: "Guide complet pour une identité visuelle cohérente." },
      { id: "srv-2-3", name: "Palette & Typographies", description: "Couleurs et polices soigneusement choisies pour votre univers." },
      { id: "srv-2-4", name: "Guide de Marque", description: "Documentation pour assurer la cohérence sur tous vos supports." },
    ],
    subCategories: [
      { id: "sub-2-1", slug: "creation-logo", name: "Création de Logo", parentId: "cat-2" },
      { id: "sub-2-2", slug: "charte-graphique", name: "Charte Graphique", parentId: "cat-2" },
      { id: "sub-2-3", slug: "palette-typo", name: "Palette & Typographies", parentId: "cat-2" },
      { id: "sub-2-4", slug: "guide-marque", name: "Guide de Marque", parentId: "cat-2" },
    ]
  },
  {
    id: "cat-3",
    slug: "impression-production",
    name: "Impression & Packaging",
    description: "Stickers découpés, étiquettes en rouleau et packaging premium sur-mesure.",
    icon: "Printer",
    tags: ["Stickers", "Étiquettes", "Packaging"],
    images: ["/adhesive.svg", "/livrer_excellence_hero.svg", "/prodimag.svg"],
    services: [
      { id: "srv-3-1", name: "Stickers & Autocollants", description: "Découpés, formes libres, finitions mat ou brillant." },
      { id: "srv-3-2", name: "Étiquettes Personnalisées", description: "Étiquettes produits avec finitions professionnelles." },
      { id: "srv-3-3", name: "Packaging Créatif", description: "Emballages personnalisés qui valorisent vos produits." },
      { id: "srv-3-4", name: "Cartes de Remerciement", description: "Cartes sur mesure pour fidéliser vos clients." },
    ],
    subCategories: [
      { id: "sub-3-1", slug: "stickers", name: "Stickers & Autocollants", parentId: "cat-3" },
      { id: "sub-3-2", slug: "etiquettes", name: "Étiquettes Personnalisées", parentId: "cat-3" },
      { id: "sub-3-3", slug: "packaging", name: "Packaging & Boîtes", parentId: "cat-3" },
      { id: "sub-3-4", slug: "cartes-remerciement", name: "Cartes de Remerciement", parentId: "cat-3" },
    ]
  },
  {
    id: "cat-4",
    slug: "signaletique-led",
    name: "Signalétique & Neon LED",
    description: "Enseignes lumineuses et néons LED sur mesure pour sublimer vos espaces.",
    icon: "Zap",
    tags: ["Neon LED", "Enseignes", "Signalétique"],
    images: ["/realiser_avec_precision_hero.svg", "/lamsa2.png", "/vlux.svg"],
    services: [
      { id: "srv-4-1", name: "Neon LED", description: "Néons lumineux sur mesure pour intérieur et extérieur." },
      { id: "srv-4-2", name: "Enseignes Lumineuses", description: "Caissons lumineux et enseignes rétroéclairées." },
      { id: "srv-4-3", name: "Signalétique Intérieure", description: "Panneaux directionnels et signalétique pour vos locaux." },
      { id: "srv-4-4", name: "Décoration Murale", description: "Installations lumineuses décoratives pour votre espace." },
    ],
    subCategories: [
      { id: "sub-4-1", slug: "neon-led", name: "Néon LED Custom", parentId: "cat-4" },
      { id: "sub-4-2", slug: "enseignes-lumineuses", name: "Enseignes Rétroéclairées", parentId: "cat-4" },
      { id: "sub-4-3", slug: "signaletique-interieure", name: "Signalétique Intérieure", parentId: "cat-4" },
      { id: "sub-4-4", slug: "decoration-murale", name: "Décoration Lumineuse", parentId: "cat-4" },
    ]
  },
  {
    id: "cat-5",
    slug: "textile-personnalise",
    name: "Textile Personnalisé",
    description: "T-shirts, polos et uniformes brodés ou sérigraphiés haute qualité.",
    icon: "Shirt",
    tags: ["T-shirts", "Broderie", "Uniformes"],
    images: ["/comprendre_votre_vision_hero.svg", "/lamsa2.png", "/livrer_excellence_hero.svg"],
    services: [
      { id: "srv-5-1", name: "T-shirts & Polos", description: "Sérigraphie | DTF | Broderie | Flex découpe" },
      { id: "srv-5-2", name: "Uniformes Professionnels", description: "Tenues corporate cohérentes pour votre équipe." },
      { id: "srv-5-3", name: "Accessoires Textiles", description: "Casquettes, sacs, tabliers et articles dérivés." },
      { id: "srv-5-4", name: "Textile Événementiel", description: "Collections spéciales pour vos événements et promotions." },
    ],
    subCategories: [
      { id: "sub-5-1", slug: "tshirts-polos", name: "T-shirts & Polos DTF/Sérigraphie", parentId: "cat-5" },
      { id: "sub-5-2", slug: "uniformes", name: "Uniformes Professionnels", parentId: "cat-5" },
      { id: "sub-5-3", slug: "accessoires-textiles", name: "Tote Bags & Casquettes", parentId: "cat-5" },
      { id: "sub-5-4", slug: "textile-evenementiel", name: "Packs Événements", parentId: "cat-5" },
    ]
  },
  {
    id: "cat-6",
    slug: "commandes-sur-mesure",
    name: "Commandes Sur Mesure",
    description: "Kits de communication événementiels et réalisations créatives d'envergure.",
    icon: "Sparkles",
    tags: ["Sur Mesure", "Kits", "Événementiel"],
    images: ["/donner_vie_vos_idees_hero.svg", "/realiser_avec_precision_hero.svg", "/livrer_excellence_hero.svg"],
    services: [
      { id: "srv-6-1", name: "Projets Spéciaux", description: "Réalisations hors catalogue selon votre brief créatif." },
      { id: "srv-6-2", name: "Kits de Communication", description: "Ensembles complets de supports pour lancer votre marque." },
      { id: "srv-6-3", name: "Cadeaux d'Entreprise", description: "Articles promotionnels personnalisés pour vos clients." },
      { id: "srv-6-4", name: "Grandes Séries", description: "Production en volume avec tarifs dégressifs négociés." },
    ],
    subCategories: [
      { id: "sub-6-1", slug: "kits-communication", name: "Kits Communication Startup", parentId: "cat-6" },
      { id: "sub-6-2", slug: "cadeaux-entreprise", name: "Goodies & Cadeaux VIP", parentId: "cat-6" },
      { id: "sub-6-3", slug: "grandes-series", name: "Commandes Grand Volume", parentId: "cat-6" },
    ]
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    categoryId: "cat-1",
    subCategoryId: "sub-1-3",
    slug: "cartes-de-visite-premium-soft-touch",
    name: "Cartes de Visite Premium Soft-Touch",
    description: "Cartes de visite ultra-épaisses 350g avec pelliculage Soft-Touch velouté et vernis sélectif recto-verso. Idéal pour une première impression inoubliable.",
    price: 4500,
    stock: 500,
    images: ["/lamsa2.png"],
    isActive: true,
    modelType: "none",
    dimensions: "85 x 55 mm",
    minQuantity: 100,
    featured: true,
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "prod-2",
    categoryId: "cat-3",
    subCategoryId: "sub-3-1",
    slug: "stickers-vinyle-decoupe-forme-libre",
    name: "Stickers Vinyle Découpés Forme Libre",
    description: "Autocollants vinyle premium résistants à l'eau, aux UV et aux rayures. Découpe personnalisée à la forme exacte de votre logo ou illustration.",
    price: 3200,
    stock: 1200,
    images: ["/adhesive.svg"],
    isActive: true,
    modelType: "none",
    dimensions: "Format libre (5x5cm à 10x10cm)",
    minQuantity: 100,
    featured: true,
    createdAt: "2026-01-18T14:30:00Z"
  },
  {
    id: "prod-3",
    categoryId: "cat-6",
    subCategoryId: "sub-6-2",
    slug: "mug-personnalise-ceramique-hd",
    name: "Mug Céramique Personnalisé HD",
    description: "Tasse céramique blanche haute brillance 325ml avec impression sublimation 360° résistante au micro-ondes et lave-vaisselle.",
    price: 1200,
    stock: 350,
    images: ["/comprendre_votre_vision_hero.svg"],
    isActive: true,
    modelType: "mug",
    dimensions: "325 ml (11 oz)",
    minQuantity: 1,
    featured: true,
    createdAt: "2026-02-01T09:15:00Z"
  },
  {
    id: "prod-4",
    categoryId: "cat-5",
    subCategoryId: "sub-5-3",
    slug: "casquette-baseball-brodee-custom",
    name: "Casquette Baseball Brodée Personnalisée",
    description: "Casquette 6 panneaux coton sergé épais avec fermeture réglable et broderie 3D en relief haute précision.",
    price: 2400,
    stock: 180,
    images: ["/lamsa2.png"],
    isActive: true,
    modelType: "cap",
    dimensions: "Taille Unique Ajustable",
    minQuantity: 5,
    featured: true,
    createdAt: "2026-02-10T16:00:00Z"
  },
  {
    id: "prod-5",
    categoryId: "cat-5",
    subCategoryId: "sub-5-1",
    slug: "tshirt-coton-bio-serigraphie-dtf",
    name: "T-Shirt 100% Coton Bio Sérigraphie & DTF",
    description: "T-shirt épais 220g coupe moderne unisexe avec marquage DTF ultra-défini ou sérigraphie artisanale. Résistant aux lavages répétés.",
    price: 2800,
    stock: 350,
    images: ["/livrer_excellence_hero.svg"],
    isActive: true,
    modelType: "tshirt",
    dimensions: "Tailles S, M, L, XL, XXL",
    minQuantity: 10,
    featured: true,
    createdAt: "2026-02-14T11:20:00Z"
  },
  {
    id: "prod-6",
    categoryId: "cat-1",
    subCategoryId: "sub-1-4",
    slug: "roll-up-kakemono-evenementiel-luxe",
    name: "Roll-Up Kakemono Événementiel Premium",
    description: "Structure en aluminium robuste avec bâche anti-reflet indéchirable et sac de transport matelassé inclus. Montage instantané en 30 secondes.",
    price: 9500,
    stock: 120,
    images: ["/donner_vie_vos_idees_hero.svg"],
    isActive: true,
    modelType: "none",
    dimensions: "85 x 200 cm",
    minQuantity: 1,
    featured: false,
    createdAt: "2026-02-20T13:45:00Z"
  },
  {
    id: "prod-7",
    categoryId: "cat-3",
    subCategoryId: "sub-3-4",
    slug: "cartes-de-remerciement-dorees",
    name: "Cartes de Remerciement avec Dorure à Chaud",
    description: "Fidélisez votre clientèle avec des cartes de remerciement élégantes sur papier texturé 300g avec dorure or ou argent étincelante.",
    price: 3800,
    stock: 800,
    images: ["/lamsa2.png"],
    isActive: true,
    modelType: "none",
    dimensions: "105 x 148 mm (A6)",
    minQuantity: 100,
    featured: false,
    createdAt: "2026-02-22T08:00:00Z"
  },
  {
    id: "prod-8",
    categoryId: "cat-6",
    subCategoryId: "sub-6-1",
    slug: "kit-branding-startup-corporate",
    name: "Pack Lancement Startup — Kit Complet",
    description: "Pack tout-en-un comprenant 500 cartes de visite, 300 stickers découpés, 1 Roll-Up événementiel et 10 T-shirts brandés pour votre équipe.",
    price: 49000,
    stock: 30,
    images: ["/realiser_avec_precision_hero.svg"],
    isActive: true,
    modelType: "none",
    dimensions: "Pack Multi-produits",
    minQuantity: 1,
    featured: true,
    createdAt: "2026-02-25T15:10:00Z"
  }
];

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      activeCategoryId: null,
      activeSubCategoryId: null,
      searchQuery: "",
      sortBy: "popular",

      setActiveCategory: (categoryId) => set({ activeCategoryId: categoryId, activeSubCategoryId: null }),
      setActiveSubCategory: (subCategoryId) => set({ activeSubCategoryId: subCategoryId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sortBy) => set({ sortBy }),

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `prod-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id)
        }));
      },

      toggleProductStatus: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
          )
        }));
      },

      addCategory: (categoryData) => {
        const newCat: Category = {
          ...categoryData,
          id: `cat-${Date.now()}`
        };
        set((state) => ({ categories: [...state.categories, newCat] }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          products: state.products.filter((p) => p.categoryId !== id)
        }));
      },

      addSubCategory: (categoryId, subCategoryData) => {
        const newSub: SubCategory = {
          ...subCategoryData,
          id: `sub-${Date.now()}`,
          parentId: categoryId
        };
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? { ...c, subCategories: [...c.subCategories, newSub] }
              : c
          )
        }));
      },

      updateSubCategory: (categoryId, subCategoryId, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  subCategories: c.subCategories.map((s) =>
                    s.id === subCategoryId ? { ...s, ...updates } : s
                  )
                }
              : c
          )
        }));
      },

      deleteSubCategory: (categoryId, subCategoryId) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  subCategories: c.subCategories.filter((s) => s.id !== subCategoryId)
                }
              : c
          )
        }));
      },

      addCategoryImage: (categoryId, imageUrl) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  images: [...(c.images || []), imageUrl]
                }
              : c
          )
        }));
      },

      removeCategoryImage: (categoryId, imageIndex) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  images: (c.images || []).filter((_, idx) => idx !== imageIndex)
                }
              : c
          )
        }));
      },

      addCategoryService: (categoryId, serviceData) => {
        const newSrv: CategoryService = {
          ...serviceData,
          id: `srv-${Date.now()}`
        };
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? { ...c, services: [...(c.services || []), newSrv] }
              : c
          )
        }));
      },

      updateCategoryService: (categoryId, serviceId, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  services: (c.services || []).map((s) =>
                    s.id === serviceId ? { ...s, ...updates } : s
                  )
                }
              : c
          )
        }));
      },

      deleteCategoryService: (categoryId, serviceId) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  services: (c.services || []).filter((s) => s.id !== serviceId)
                }
              : c
          )
        }));
      }
    }),
    {
      name: "lamsa_catalog_store",
      partialize: (state) => ({
        categories: state.categories,
        products: state.products
      })
    }
  )
);
