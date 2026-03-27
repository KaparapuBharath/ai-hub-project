import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-hub-project-production-32fa.up.railway.app";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true,
});

/* ================= ATTACH TOKEN ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= FIX WRONG URL (IMPORTANT) ================= */
api.interceptors.request.use((config) => {
  let url = config.url || "";

  // Ensure leading slash
  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  // 🔥 REMOVE duplicate /api
  url = url.replace(/^\/api\/api\/api/, "/api");
  url = url.replace(/^\/api\/api/, "/api");

  // 🔥 If baseURL already has /api, remove from url
  if (url.startsWith("/api")) {
    url = url.replace("/api", "");
  }

  config.url = url;

  return config;
});

/* ================= SMART LOGOUT ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      error.response?.status === 401 &&
      error.response?.data?.message === "Unauthorized"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;