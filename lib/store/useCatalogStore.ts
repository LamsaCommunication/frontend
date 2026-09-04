import { create } from "zustand";
import { persist } from "zustand/middleware";
import { catalogApi } from "../api/lamsa-api";

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
  allowLogoUpload?: boolean; // When false, hides the file upload section on the product page
  createdAt: string;
}

interface CatalogState {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  activeCategoryId: string | null;
  activeSubCategoryId: string | null;
  searchQuery: string;
  sortBy: "popular" | "price_asc" | "price_desc" | "newest";
  
  // Hydration from backend
  fetchCatalog: () => Promise<void>;
  
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

const INITIAL_CATEGORIES: Category[] = [];

const INITIAL_PRODUCTS: Product[] = [];

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      categories: [],
      products: [],
      isLoading: false,
      activeCategoryId: null,
      activeSubCategoryId: null,
      searchQuery: "",
      sortBy: "popular",

      fetchCatalog: async () => {
        if (get().isLoading) return;
        set({ isLoading: true });
        try {
          const [categories, catalogResult] = await Promise.all([
            catalogApi.getCategories(),
            catalogApi.getProducts({ limit: 200 })
          ]);
          set({ categories, products: catalogResult.products, isLoading: false });
        } catch {
          // Silently fail — components will show empty states
          set({ isLoading: false });
        }
      },

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
      // Only persist lightweight metadata — never persist image arrays (base64 blobs
      // from admin uploads easily exceed the ~5 MB localStorage quota).
      partialize: (state) => ({
        categories: state.categories.map((c) => ({
          ...c,
          // Strip image arrays — they are always reloaded from the DB via fetchCatalog
          image: undefined,
          images: undefined,
        })),
        products: state.products.map((p) => ({
          ...p,
          images: [],
        })),
      }),
      // Wrap storage access so a full quota never crashes the app
      storage: {
        getItem: (name: string) => {
          try {
            const val = localStorage.getItem(name);
            return val ? JSON.parse(val) : null;
          } catch {
            return null;
          }
        },
        setItem: (name: string, value: unknown) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // Quota exceeded — silently ignore, data will be re-fetched from server
          }
        },
        removeItem: (name: string) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // ignore
          }
        },
      },
    }
  )
);
