import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product3DModelType } from "./useCatalogStore";
import { TextureTransform } from "@/components/customizer/models/types";

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
  frontTransform?: TextureTransform;
  backTransform?: TextureTransform;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  productSlug: string;
  name: string;
  price: number; // in DZD
  quantity: number;
  image: string;
  hasFreeShipping?: boolean;
  customization?: CartCustomization;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  
  // Checkout selections
  selectedWilayaCode: string;
  selectedWilayaName: string;
  selectedCommune: string;
  isStopDesk: boolean;
  shippingFee: number;
  
  // Actions
  addItem: (item: Omit<CartItem, "id">, autoOpenDrawer?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  setSelectedWilaya: (wilayaCode: string, wilayaName: string) => void;
  setSelectedCommune: (commune: string) => void;
  setIsStopDesk: (isStopDesk: boolean) => void;
  setShippingFee: (fee: number) => void;
  
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      selectedWilayaCode: "16", // Default: Alger
      selectedWilayaName: "Alger",
      selectedCommune: "Alger Centre",
      isStopDesk: false,
      shippingFee: 500,

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

      setSelectedWilaya: (wilayaCode, wilayaName) => {
        set({
          selectedWilayaCode: wilayaCode,
          selectedWilayaName: wilayaName,
          selectedCommune: "" // Reset commune when wilaya changes
        });
      },

      setSelectedCommune: (commune) => set({ selectedCommune: commune }),
      setIsStopDesk: (isStopDesk) => set({ isStopDesk }),
      setShippingFee: (fee) => set({ shippingFee: fee }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getShippingFee: () => {
        const { items, shippingFee } = get();
        if (items.length === 0) return 0;
        const hasFree = items.some((item) => item.hasFreeShipping);
        return hasFree ? 0 : shippingFee;
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
        selectedWilayaName: state.selectedWilayaName,
        selectedCommune: state.selectedCommune,
        isStopDesk: state.isStopDesk,
        shippingFee: state.shippingFee
      })
    }
  )
);
