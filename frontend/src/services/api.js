import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://ai-hub-project-production-32fa.up.railway.app/api",
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
  if (!config.url.startsWith("/")) {
    config.url = "/" + config.url;
  }
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