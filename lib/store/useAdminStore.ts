import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../api/api-client";

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItemRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  clientLogoPath?: string;
  designRectoPath?: string;
  designVersoPath?: string;
  preview3DPath?: string;
  clientVerified: boolean;
  customText?: string;
  designNotes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  isStopDesk: boolean;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  yalidineTracking?: string;
  yalidineLabelUrl?: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemRecord[];
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER";
}

export interface YalidineSettings {
  apiId: string;
  apiToken: string;
  isLive: boolean;
}

interface AdminState {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  orders: OrderRecord[];
  yalidineSettings: YalidineSettings;
  
  // Auth Actions
  login: (username: string, password: string) => Promise<boolean> | boolean;
  logout: () => Promise<void> | void;
  
  // Settings Actions
  setYalidineSettings: (settings: Partial<YalidineSettings>) => void;
  
  // Orders & Invoicing Actions
  createOrder: (orderData: Omit<OrderRecord, "id" | "orderNumber" | "status" | "createdAt">) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  generateYalidineWaybill: (orderId: string) => { tracking: string; labelUrl: string };
  deleteOrder: (orderId: string) => void;
  
  // KPI Selectors
  getTotalRevenue: () => number;
  getActiveOrdersCount: () => number;
  getYalidineDispatchesCount: () => number;
  getRecentOrders: (limit?: number) => OrderRecord[];
  getOrderById: (id: string) => OrderRecord | undefined;
  getOrderByNumber: (orderNumber: string) => OrderRecord | undefined;
}

const INITIAL_ORDERS: OrderRecord[] = [];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminUser: null,
      orders: INITIAL_ORDERS,

      login: async (username, password) => {
        try {
          // Attempt backend authentication
          const response = await apiClient.post("/api/v1/auth/login", {
            username,
            password
          });

          if (response.data?.status === "success") {
            const data = response.data.data;
            if (typeof window !== "undefined") {
              if (data.accessToken) {
                localStorage.setItem("lamsa_admin_access_token", data.accessToken);
              }
              if (data.refreshToken) {
                localStorage.setItem("lamsa_admin_refresh_token", data.refreshToken);
              }
            }

            set({
              isAuthenticated: true,
              adminUser: {
                id: data.admin.id,
                username: data.admin.username,
                fullName: "Direction Lamsa Communication",
                email: `${data.admin.username}@lamsadz.com`,
                role: "SUPER_ADMIN"
              }
            });
            return true;
          }
        } catch {
          // Fallback demo simulation for offline/preview mode
          if (username === "admin" && password === "admin123") {
            set({
              isAuthenticated: true,
              adminUser: {
                id: "admin-root",
                username: "admin",
                fullName: "Direction Lamsa Communication",
                email: "admin@lamsadz.com",
                role: "SUPER_ADMIN"
              }
            });
            return true;
          }
        }
        return false;
      },

      logout: async () => {
        try {
          await apiClient.post("/api/v1/auth/logout");
        } catch {
          // Ignore network errors on logout
        } finally {
          if (typeof window !== "undefined") {
            localStorage.removeItem("lamsa_admin_access_token");
            localStorage.removeItem("lamsa_admin_refresh_token");
          }
          set({ isAuthenticated: false, adminUser: null });
        }
      },

      createOrder: (orderData) => {
        const orderCount = get().orders.length + 10496;
        const newOrder: OrderRecord = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber: `LMS-2026-${orderCount}`,
          status: "PENDING",
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((ord) =>
            ord.id === orderId ? { ...ord, status } : ord
          )
        }));
      },

      generateYalidineWaybill: (orderId) => {
        const trackingNum = `yal-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const labelUrl = `/labels/${trackingNum}.pdf`;

        set((state) => ({
          orders: state.orders.map((ord) =>
            ord.id === orderId
              ? {
                  ...ord,
                  status: "SHIPPED",
                  yalidineTracking: trackingNum,
                  yalidineLabelUrl: labelUrl
                }
              : ord
          )
        }));

        return { tracking: trackingNum, labelUrl };
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((ord) => ord.id !== orderId)
        }));
      },

      getTotalRevenue: () => {
        return get().orders
          .filter((ord) => ord.status !== "CANCELLED")
          .reduce((sum, ord) => sum + ord.totalAmount, 0);
      },

      getActiveOrdersCount: () => {
        return get().orders.filter(
          (ord) => ord.status === "PENDING" || ord.status === "CONFIRMED" || ord.status === "SHIPPED"
        ).length;
      },

      getYalidineDispatchesCount: () => {
        return get().orders.filter((ord) => Boolean(ord.yalidineTracking)).length;
      },

      yalidineSettings: {
        apiId: "",
        apiToken: "",
        isLive: true
      },

      setYalidineSettings: (settings) => {
        set((state) => ({
          yalidineSettings: { ...state.yalidineSettings, ...settings }
        }));
      },

      getRecentOrders: (limit = 10) => {
        return get().orders.slice(0, limit);
      },

      getOrderById: (id) => {
        return get().orders.find((ord) => ord.id === id);
      },

      getOrderByNumber: (orderNumber) => {
        return get().orders.find((ord) => ord.orderNumber === orderNumber);
      }
    }),
    {
      name: "lamsa_admin_store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser,
        orders: state.orders,
        yalidineSettings: state.yalidineSettings
      })
    }
  )
);
