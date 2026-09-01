import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALGERIA_WILAYAS, Wilaya } from "@/lib/data/algeria-wilayas";
import { Product3DModelType } from "./useCatalogStore";

export interface CartCustomization {
  clientLogoPath?: string;
  designRectoPath?: string;
  designVersoPath?: string;
  preview3DPath?: string;
  clientVerified: boolean;
  customText?: string;
  designNotes?: string;
  selectedColor?: string;
  modelType: Product3DModelType;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  productSlug: string;
  name: string;
  price: number; // in DZD
  quantity: number;
  image: string;
  customization?: CartCustomization;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  
  // Checkout selections
  selectedWilayaCode: string;
  selectedCommune: string;
  isStopDesk: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "id">, autoOpenDrawer?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  setSelectedWilaya: (wilayaCode: string) => void;
  setSelectedCommune: (commune: string) => void;
  setIsStopDesk: (isStopDesk: boolean) => void;
  
  // Computed getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
  getSelectedWilaya: () => Wilaya | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      selectedWilayaCode: "16", // Default: Alger
      selectedCommune: "Alger Centre",
      isStopDesk: false,

      addItem: (itemData, autoOpen = true) => {
        const newItem: CartItem = {
          ...itemData,
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        };
        set((state) => ({
          items: [...state.items, newItem],
          ...(autoOpen ? { isDrawerOpen: true } : { isDrawerOpen: false })
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      setSelectedWilaya: (wilayaCode) => {
        const wilaya = ALGERIA_WILAYAS.find((w) => w.code === wilayaCode);
        set({
          selectedWilayaCode: wilayaCode,
          selectedCommune: wilaya ? wilaya.communes[0] : ""
        });
      },

      setSelectedCommune: (commune) => set({ selectedCommune: commune }),
      setIsStopDesk: (isStopDesk) => set({ isStopDesk }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getSelectedWilaya: () => {
        const { selectedWilayaCode } = get();
        return ALGERIA_WILAYAS.find((w) => w.code === selectedWilayaCode);
      },

      getShippingFee: () => {
        const { items, isStopDesk } = get();
        if (items.length === 0) return 0;
        const wilaya = get().getSelectedWilaya();
        if (!wilaya) return 500;
        return isStopDesk ? wilaya.stopDeskFee : wilaya.homeDeliveryFee;
      },

      getTotalAmount: () => {
        return get().getSubtotal() + get().getShippingFee();
      }
    }),
    {
      name: "lamsa_cart_store",
      partialize: (state) => ({
        items: state.items,
        selectedWilayaCode: state.selectedWilayaCode,
        selectedCommune: state.selectedCommune,
        isStopDesk: state.isStopDesk
      })
    }
  )
);
