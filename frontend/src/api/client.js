import axios from "axios";
import { authStore } from "../auth/auth.store";

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_BASE = rawBase.replace(/\/?api\/?$/i, "");

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});