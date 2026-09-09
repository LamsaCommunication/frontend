/**
 * Lamsa API Service Layer
 * Typed wrappers around the NestJS backend API endpoints.
 * Used by Zustand stores and React components via useEffect hooks.
 */
import { apiClient } from "./api-client";
import type { Category, Product } from "@/lib/store/useCatalogStore";

// ── Catalog API ────────────────────────────────────────────────────────────

export const catalogApi = {
  /** Fetch all main categories with nested subcategories & services */
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get("/api/v1/categories");
    return res.data.data as Category[];
  },

  /** Fetch single category by slug */
  getCategory: async (slug: string): Promise<Category> => {
    const res = await apiClient.get(`/api/v1/categories/${slug}`);
    return res.data.data as Category;
  },

  /** Fetch all active products, optionally filtered */
  getProducts: async (params?: {
    categoryId?: string;
    subCategoryId?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; pagination: any }> => {
    const res = await apiClient.get("/api/v1/products", { params });
    return res.data.data;
  },

  /** Fetch single product by slug */
  getProduct: async (slug: string): Promise<Product> => {
    const res = await apiClient.get(`/api/v1/products/${slug}`);
    return res.data.data as Product;
  }
};

// ── Orders API ─────────────────────────────────────────────────────────────

export const ordersApi = {
  /** Guest checkout — create order in DB */
  checkout: async (payload: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    commune: string;
    address: string;
    isStopDesk?: boolean;
    subtotal: number;
    shippingFee?: number;
    totalAmount: number;
    items: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      clientLogoPath?: string;
      designRectoPath?: string;
      designVersoPath?: string;
      preview3DPath?: string;
      clientVerified?: boolean;
      customText?: string;
      designNotes?: string;
      frontTransform?: any;
      backTransform?: any;
    }[];
  }) => {
    const res = await apiClient.post("/api/v1/orders/checkout", payload);
    return res.data;
  },

  /** Admin: Get paginated orders */
  getOrders: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const cleanParams: Record<string, any> = {};
    if (params) {
      if (params.status && params.status !== "ALL") cleanParams.status = params.status;
      if (params.search && params.search.trim() !== "") cleanParams.search = params.search.trim();
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
    }
    const res = await apiClient.get("/api/v1/orders", { params: cleanParams });
    return res.data.data;
  },

  /** Admin: Get single order */
  getOrder: async (id: string) => {
    const res = await apiClient.get(`/api/v1/orders/${id}`);
    return res.data.data;
  },

  /** Admin: Update order status */
  updateStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/api/v1/orders/${id}/status`, { status });
    return res.data.data;
  },

  /** Admin: 1-click Yalidine waybill generation */
  dispatchYalidine: async (id: string) => {
    const res = await apiClient.post(`/api/v1/orders/${id}/dispatch-yalidine`);
    return res.data.data;
  },

  /** Admin: Hard-delete an order directly from DB */
  deleteOrder: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/orders/${id}`);
    return res.data;
  },

  /** Admin: Get dashboard stats */
  getAdminStats: async () => {
    const res = await apiClient.get("/api/v1/orders/admin/stats");
    return res.data.data;
  }
};

// ── Payments API ───────────────────────────────────────────────────────────

export const paymentsApi = {
  /** Initialize a Chargily checkout session for an order */
  createChargilySession: async (orderId: string): Promise<{ checkoutUrl: string }> => {
    const res = await apiClient.post(`/api/v1/payments/chargily/create/${orderId}`);
    return res.data.data;
  }
};

// ── Uploads API ────────────────────────────────────────────────────────────

export const uploadsApi = {
  /** Upload customizer files (logo, designs, 3D preview) */
  uploadCustomizerFiles: async (files: {
    clientLogo?: File;
    designRecto?: File;
    designVerso?: File;
    preview3D?: File;
  }): Promise<{
    clientLogoPath: string | null;
    designRectoPath: string | null;
    designVersoPath: string | null;
    preview3DPath: string | null;
  }> => {
    const formData = new FormData();
    if (files.clientLogo) formData.append("clientLogo", files.clientLogo);
    if (files.designRecto) formData.append("designRecto", files.designRecto);
    if (files.designVerso) formData.append("designVerso", files.designVerso);
    if (files.preview3D) formData.append("preview3D", files.preview3D);

    const res = await apiClient.post("/api/v1/uploads/customizer", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.data;
  },

  /** Admin: Upload catalog assets */
  uploadAdminAssets: async (files: File[]): Promise<{ paths: string[] }> => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const res = await apiClient.post("/api/v1/uploads/admin", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.data;
  },

  /** Admin: Download a file securely via API (authenticated) */
  downloadSecureFile: async (pathUrl: string, filename: string) => {
    // pathUrl should be the relative path like "/api/v1/uploads/download/customizer/123.webp"
    const res = await apiClient.get(pathUrl, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

// ── Products Admin API ─────────────────────────────────────────────────────

export const productsApi = {
  /** Admin: Create product */
  create: async (data: object) => {
    const res = await apiClient.post("/api/v1/products", data);
    return res.data.data;
  },

  /** Admin: Update product */
  update: async (id: string, data: object) => {
    const res = await apiClient.patch(`/api/v1/products/${id}`, data);
    return res.data.data;
  },

  /** Admin: Hard-delete product directly from DB */
  delete: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/products/${id}`);
    return res.data;
  },

  /** Admin: Toggle active status */
  toggleStatus: async (id: string, isActive: boolean) => {
    const res = await apiClient.patch(`/api/v1/products/${id}`, { isActive });
    return res.data.data;
  }
};

// ── Categories Admin API ───────────────────────────────────────────────────

export const categoriesApi = {
  /** Admin: Create category */
  create: async (data: object) => {
    const res = await apiClient.post("/api/v1/categories", data);
    return res.data.data;
  },

  /** Admin: Update category */
  update: async (id: string, data: object) => {
    const res = await apiClient.patch(`/api/v1/categories/${id}`, data);
    return res.data.data;
  },

  /** Admin: Hard-delete category directly from DB */
  delete: async (id: string) => {
    const res = await apiClient.delete(`/api/v1/categories/${id}`);
    return res.data;
  }
};

// ── Announcements API ───────────────────────────────────────────────────

export interface Announcement {
  id: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const announcementsApi = {
  /** Public: Get all active announcements */
  getActive: async (): Promise<Announcement[]> => {
    const res = await apiClient.get("/api/v1/announcements");
    return res.data.data;
  },

  /** Admin: Get all announcements */
  getAllAdmin: async (): Promise<Announcement[]> => {
    const res = await apiClient.get("/api/v1/announcements/admin");
    return res.data.data;
  },

  /** Admin: Create announcement */
  create: async (data: Partial<Announcement>): Promise<Announcement> => {
    const res = await apiClient.post("/api/v1/announcements", data);
    return res.data.data;
  },

  /** Admin: Update announcement */
  update: async (id: string, data: Partial<Announcement>): Promise<Announcement> => {
    const res = await apiClient.patch(`/api/v1/announcements/${id}`, data);
    return res.data.data;
  },

  /** Admin: Delete announcement */
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/api/v1/announcements/${id}`);
    return res.data;
  }
};

// ── Client Logos API ────────────────────────────────────────────────────────

export interface ClientLogo {
  id: string;
  image: string;
  name: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const clientLogosApi = {
  /** Public: Get all active client logos */
  getActive: async (): Promise<ClientLogo[]> => {
    const res = await apiClient.get("/api/v1/client-logos");
    return res.data.data;
  },

  /** Admin: Get all client logos */
  getAllAdmin: async (): Promise<ClientLogo[]> => {
    const res = await apiClient.get("/api/v1/client-logos/admin");
    return res.data.data;
  },

  /** Admin: Create client logo */
  create: async (data: Partial<ClientLogo>): Promise<ClientLogo> => {
    const res = await apiClient.post("/api/v1/client-logos", data);
    return res.data.data;
  },

  /** Admin: Update client logo */
  update: async (id: string, data: Partial<ClientLogo>): Promise<ClientLogo> => {
    const res = await apiClient.patch(`/api/v1/client-logos/${id}`, data);
    return res.data.data;
  },

  /** Admin: Delete client logo */
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete(`/api/v1/client-logos/${id}`);
    return res.data;
  }
};

