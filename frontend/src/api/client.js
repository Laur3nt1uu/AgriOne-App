import axios from "axios";
import { authStore } from "../auth/auth.store";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_BASE = rawBase.replace(/\/?api\/?$/i, "");

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  // Check if session is expired before making requests
  if (authStore.isExpired()) {
    authStore.logout();
    if (!window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(new Error("Session expired"));
  }

  const token = authStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Track whether a token refresh is currently in-flight
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

// Response interceptor: attempt silent token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401 errors on non-auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh") &&
      !originalRequest.url?.includes("/api/auth/login") &&
      authStore.isAuthed()
    ) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Attempt to get a new access token using the refresh token
        const refreshToken = authStore.getRefreshToken?.() || null;
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken });
        const newToken = data.accessToken || data.token;
        const newRefresh = data.refreshToken;

        if (!newToken) throw new Error("No token in refresh response");

        // Update stored tokens
        authStore.updateTokens?.({ token: newToken, refreshToken: newRefresh });
        processQueue(null, newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed - logout and redirect
        authStore.logout();
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For non-401 errors or already retried, just reject
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;
      if (code === "AUTH_INVALID_TOKEN" || code === "AUTH_MISSING_TOKEN") {
        authStore.logout();
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);