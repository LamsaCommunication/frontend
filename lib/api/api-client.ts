import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables sending and receiving HttpOnly cookies
  headers: {
    "Content-Type": "application/json"
  }
});

// Mutex lock and request queue to prevent multiple parallel refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ── 1. Request Interceptor: Attach Access Token ────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("lamsa_admin_access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── 2. Response Interceptor: Seamless Token Refresh & Synchronization ─────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 Unauthorized and not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Ignore 401s that occur on the login or refresh endpoints themselves
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue concurrent requests while token is refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("lamsa_admin_refresh_token")
            : null;

        // Perform token refresh call
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: storedRefreshToken
              ? { "X-Refresh-Token": storedRefreshToken }
              : {}
          }
        );

        const newAccessToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (newAccessToken) {
          // Synchronize token in localStorage and headers
          if (typeof window !== "undefined") {
            localStorage.setItem("lamsa_admin_access_token", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("lamsa_admin_refresh_token", newRefreshToken);
            }
          }

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Process queued requests
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error("Missing access token in refresh response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear invalid tokens on terminal refresh failure
        if (typeof window !== "undefined") {
          localStorage.removeItem("lamsa_admin_access_token");
          localStorage.removeItem("lamsa_admin_refresh_token");
          localStorage.removeItem("lamsa_admin_store");
          
          // Redirect gracefully to login if on an admin page
          if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/admin/login")) {
            window.location.href = "/admin/login?sessionExpired=true";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
