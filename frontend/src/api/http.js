import axios from "axios";
import { authStore } from "../auth/auth.store";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = rawBase.replace(/\/?api\/?$/i, "");

export const http = axios.create({
  baseURL,
  timeout: 20000,
});

http.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e?.response?.status === 401) authStore.logout();
    return Promise.reject(e);
  }
);