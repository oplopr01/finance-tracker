import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // ✅ prevent hanging requests
});

// ✅ Prevent multiple logout triggers
let isLoggingOut = false;

// ✅ Request interceptor (token attach)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ✅ Response interceptor (optimized)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    const isAuthRoute =
      url.includes("/auth/login") || url.includes("/auth/register");

    // 🔐 Handle session expiry
    if (status === 401 && !isAuthRoute && !isLoggingOut) {
      isLoggingOut = true;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.error("Session expired. Please login again");

      // ✅ SPA redirect (no reload)
      setTimeout(() => {
        window.history.pushState({}, "", "/login");
        window.dispatchEvent(new PopStateEvent("popstate"));
        isLoggingOut = false;
      }, 1000);
    }

    // 🌐 Network error
    if (!err.response) {
      toast.error("Network error. Check your connection");
    }

    // ⚠️ Server errors
    if (status >= 500) {
      toast.error("Server error. Try again later");
    }

    return Promise.reject(err);
  }
);

export default API;