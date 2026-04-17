import axios from "axios";
import toast from "react-hot-toast";
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ✅ Handle session expiry globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config.url;

    // ❌ Skip for auth APIs
    if (
      err.response?.status === 401 &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register")
    ) {
      localStorage.removeItem("token");

      toast.error("Session expired. Please login again");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }

    return Promise.reject(err);
  }
);

export default API;