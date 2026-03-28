import { apiClient } from "./client";

export const pick = (obj, keys, fallback = undefined) => {
  if (!obj || !Array.isArray(keys)) return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
};

export const getErrorMessage = (err, fallback = "A apărut o eroare.") => {
  if (!err) return fallback;
  const status = err?.response?.status;
  const serverMsg = err?.response?.data?.message ?? err?.response?.data?.error;
  const msg = typeof serverMsg === "string" ? serverMsg : "";
  const code = err?.response?.data?.code;
  const details = err?.response?.data?.details;

  // Zod flatten() shape: { formErrors: [], fieldErrors: { field: [messages...] } }
  if (status === 400 && details?.fieldErrors && typeof details.fieldErrors === "object") {
    for (const key of Object.keys(details.fieldErrors)) {
      const arr = details.fieldErrors?.[key];
      if (Array.isArray(arr) && arr.length && typeof arr[0] === "string") return arr[0];
    }
    if (Array.isArray(details.formErrors) && details.formErrors.length) return details.formErrors[0];
  }

  if (status === 409) {
    if (code === "AUTH_EMAIL_ALREADY_REGISTERED" || /email/i.test(msg)) return "Acest email este deja înregistrat.";
    if (code === "AUTH_USERNAME_TAKEN" || /username/i.test(msg)) return "Acest username este deja folosit.";
    if (code === "SENSOR_CODE_EXISTS" || /sensor code already exists/i.test(msg)) return "Acest cod de senzor este deja folosit.";
    if (code === "BOARD_CODE_EXISTS" || /board code already owned/i.test(msg)) return "Acest cod de Arduino este deja folosit.";
    return "Există deja o înregistrare cu aceste date.";
  }
  if (status === 401) {
    if (code === "AUTH_USER_NOT_FOUND" || /user not found/i.test(msg)) return "Nu există utilizator cu acest email.";
    if (code === "AUTH_INCORRECT_PASSWORD" || /incorrect password/i.test(msg)) return "Parola introdusă este greșită.";
    if (code === "AUTH_INVALID_CREDENTIALS" || /invalid credentials/i.test(msg)) return "Email sau parolă greșită.";
    if (code === "AUTH_MISSING_TOKEN" || /missing access token/i.test(msg))
      return "Nu ești autentificat. Te rugăm să te conectezi.";
    if (code === "AUTH_INVALID_TOKEN" || /invalid\/expired access token/i.test(msg))
      return "Sesiunea a expirat. Te rugăm să te conectezi din nou.";

    if (/user not found/i.test(msg)) return "Nu există utilizator cu acest email.";
    if (/incorrect password/i.test(msg)) return "Parola introdusă este greșită.";
    if (/invalid credentials/i.test(msg)) return "Email sau parolă greșită.";

    if (/missing access token/i.test(msg) || /invalid\/expired access token/i.test(msg)) {
      return "Sesiunea a expirat sau nu ești autentificat.";
    }

    return msg || "Neautorizat.";
  }
  if (status === 403) {
    if (code === "PLAN_LAND_LIMIT" || code === "PLAN_SENSOR_LIMIT") return msg || "Ai atins limita planului tău. Fă upgrade pentru mai mult.";
    return "Nu ai permisiune pentru această acțiune.";
  }
  if (status === 404) {
    if (code === "LAND_NOT_FOUND") return "Terenul nu a fost găsit.";
    if (code === "ALERT_NOT_FOUND") return "Alerta nu a fost găsită.";
    if (code === "SENSOR_NOT_FOUND") return "Senzorul nu a fost găsit.";
    if (code === "SENSOR_NOT_REGISTERED") return "Senzorul nu este înregistrat.";
    if (code === "BOARD_NOT_FOUND") return "Placa Arduino nu a fost găsită.";
    if (code === "TRANSACTION_NOT_FOUND") return "Tranzacția nu a fost găsită.";
    if (code === "USER_NOT_FOUND") return "Utilizatorul nu a fost găsit.";
    return "Resursa nu a fost găsită.";
  }
  if (status === 503 && code === "ECONOMICS_UNAVAILABLE") return "Economia nu este disponibilă momentan.";
  if (status === 400 && code === "ADMIN_INVALID_ROLE") return "Rol invalid.";
  if (status === 400 && code === "ADMIN_CANNOT_DELETE_SELF") return "Nu îți poți șterge propriul cont.";
  if (status === 400 || status === 422) return "Date invalide. Verifică câmpurile și încearcă din nou.";
  if (status === 429) return "Prea multe cereri. Încearcă mai târziu.";

  if (msg) return msg;
  if (err?.message?.toLowerCase?.().includes("network")) return "Server indisponibil. Încearcă mai târziu.";
  return fallback;
};

export const api = {
  auth: {
    login: (data) => apiClient.post("/api/auth/login", data).then(r => r.data),
    googleLogin: (data) => apiClient.post("/api/auth/google", data).then(r => r.data),
    register: (data) => apiClient.post("/api/auth/register", data).then(r => r.data),
    me: () => apiClient.get("/api/auth/me").then(r => r.data),
    getPreferences: () => apiClient.get("/api/auth/preferences").then((r) => r.data?.preferences || r.data),
    updatePreferences: (data) => apiClient.put("/api/auth/preferences", data).then((r) => r.data?.preferences || r.data),
    changePassword: (data) => apiClient.put("/api/auth/password", data).then((r) => r.data),
    changePlan: (data) => apiClient.put("/api/auth/plan", data).then((r) => r.data),
    forgotPassword: (data) => apiClient.post("/api/auth/forgot-password", data).then(r => r.data),
    resetPassword: (data) => apiClient.post("/api/auth/reset-password", data).then(r => r.data),
  },

  lands: {
    list: () => apiClient.get("/api/lands").then(r => r.data?.lands || r.data?.items || r.data),
    create: (data) => apiClient.post("/api/lands", data).then(r => r.data?.land || r.data),
    get: (id) => apiClient.get(`/api/lands/${id}`).then(r => r.data?.land || r.data),
    update: (id, data) => apiClient.put(`/api/lands/${id}`, data).then(r => r.data?.land || r.data),
    remove: (id) => apiClient.delete(`/api/lands/${id}`).then(() => true),
  },

  sensors: {
    list: () => apiClient.get("/api/sensors").then(r => r.data?.sensors || r.data?.items || r.data),
    // pairing: sensorCode + landId
    pair: (data) => apiClient.post("/api/sensors/pair", data).then(r => r.data?.sensor || r.data),
    unpair: (data) => apiClient.post("/api/sensors/unpair", data).then(r => r.data?.sensor || r.data),
    calibrate: (sensorCode, data) =>
      apiClient.put(`/api/sensors/${encodeURIComponent(sensorCode)}/calibration`, data).then(r => r.data?.sensor || r.data),
  },

  iot: {
    // pairing: boardCode + landId (Arduino Uno)
    pairBoard: (data) => apiClient.post("/api/iot/pair", data).then((r) => r.data?.board || r.data),
    unpairBoard: (data) => apiClient.post("/api/iot/unpair", data).then((r) => r.data?.board || r.data),
  },

  readings: {
    byLand: (landId, range = "24h") =>
      apiClient.get(`/api/readings/land/${landId}`, { params: { range } }).then(r => r.data),
  },

  economics: {
  list: (params) => apiClient.get("/api/economics/transactions", { params }).then(r=>r.data?.transactions || r.data?.items || r.data),
  create: (data) => apiClient.post("/api/economics/transactions", data).then(r=>r.data?.transaction || r.data),
  remove: (id) => apiClient.delete(`/api/economics/transactions/${id}`).then(r=>r.data),
  summary: (params) => apiClient.get("/api/economics/summary", { params }).then(r=>r.data?.summary || r.data),
  },

  analytics: {
  overview: () => apiClient.get("/api/analytics/overview").then(r=>r.data),
  health: () => apiClient.get("/api/analytics/health").then(r=>r.data),
  },

  alerts: {
    list: (params) => apiClient.get("/api/alerts", { params }).then(r => r.data?.alerts || r.data?.items || r.data),
    remove: (id) => apiClient.delete(`/api/alerts/${id}`).then(() => true),
    // Alert rules management
    getRules: (landId) => apiClient.get("/api/alerts/rules", { params: landId ? { landId } : undefined }).then(r => r.data?.rules || r.data),
    upsertRule: (data) => apiClient.post("/api/alerts/rules", data).then(r => r.data?.rule || r.data),
  },

  exports: {
    landReport: (landId, params = undefined) =>
      apiClient.get(`/api/exports/land/${landId}/pdf`, { params, responseType: "blob" }).then(r => r.data),
    economicsReport: (params = undefined) =>
      apiClient.get("/api/exports/economics/pdf", { params, responseType: "blob" }).then((r) => r.data),
    // CSV exports
    readingsCsv: (landId, params = undefined) =>
      apiClient.get(`/api/exports/land/${landId}/readings.csv`, { params, responseType: "blob" }).then(r => r.data),
  },

  weather: {
    byCoords: (lat, lng) =>
      apiClient.get("/api/weather/by-coords", { params: { lat, lng } }).then(r => r.data?.weather || r.data),
    reverseGeocode: (lat, lng) =>
      apiClient.get("/api/weather/reverse", { params: { lat, lng } }).then((r) => r.data?.location || r.data),
  },

  recommendations: {
    today: (lat, lng) =>
      apiClient
        .get("/api/recommendations/today", {
          params:
            lat != null && lng != null
              ? { lat, lng }
              : undefined,
        })
        .then((r) => r.data),
    byLand: (landId) => apiClient.get(`/api/recommendations/land/${landId}`).then(r => r.data),
  },
  
  admin: {
    listUsers: () => apiClient.get("/api/admin/users").then(r => r.data?.users || r.data),
    updateUser: (id, data) => apiClient.put(`/api/admin/users/${id}`, data).then(r => r.data),
    deleteUser: (id) => apiClient.delete(`/api/admin/users/${id}`).then(r => r.data),
    getStats: () => apiClient.get("/api/admin/stats").then(r => r.data),
    backup: () => apiClient.get("/api/admin/backup", { responseType: "blob" }).then(r => r.data),
  },
  
  dev: {
  seedReadings: (landId, body) =>
    apiClient.post(`/api/dev/seed-readings/${landId}`, body, {
      headers: { "x-dev-key": import.meta.env.VITE_DEV_KEY },
    }).then(r => r.data),
  },

  apia: {
    listParcels: () => apiClient.get("/api/apia/parcels").then(r => r.data?.parcels || r.data),
    getParcel: (landId) => apiClient.get(`/api/apia/parcels/${landId}`).then(r => r.data?.parcel || r.data),
    createParcel: (data) => apiClient.post("/api/apia/parcels", data).then(r => r.data?.parcel || r.data),
    updateParcel: (id, data) => apiClient.put(`/api/apia/parcels/${id}`, data).then(r => r.data?.parcel || r.data),
    deleteParcel: (id) => apiClient.delete(`/api/apia/parcels/${id}`).then(() => true),
    calendar: (year) => apiClient.get("/api/apia/calendar", { params: { year } }).then(r => r.data),
    rates: () => apiClient.get("/api/apia/rates").then(r => r.data?.rates || r.data),
    calculate: (landId) => apiClient.get("/api/apia/calculate", { params: { landId } }).then(r => r.data),
    exportPdf: () => apiClient.get("/api/apia/export/pdf", { responseType: "blob" }).then(r => r.data),
  },

  payments: {
    createSession: (data) => apiClient.post("/api/payments/create-session", data).then(r => r.data),
    verify: (data) => apiClient.post("/api/payments/verify", data).then(r => r.data),
    simulate: (data) => apiClient.post("/api/payments/simulate", data).then(r => r.data),
  },

  ai: {
    chat: (data) => apiClient.post("/api/ai/chat", data).then(r => r.data),
    analyzeImage: (data) => apiClient.post("/api/ai/analyze-image", data).then(r => r.data),
    listConversations: (page = 1, limit = 20) =>
      apiClient.get("/api/ai/conversations", { params: { page, limit } }).then(r => r.data),
    getConversation: (id) => apiClient.get(`/api/ai/conversations/${id}`).then(r => r.data),
    deleteConversation: (id) => apiClient.delete(`/api/ai/conversations/${id}`).then(r => r.data),
    getUsage: () => apiClient.get("/api/ai/usage").then(r => r.data),
    getQuickActions: () => apiClient.get("/api/ai/quick-actions").then(r => r.data),
  },

};