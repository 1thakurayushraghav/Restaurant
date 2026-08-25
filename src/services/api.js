import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sm_token");
      localStorage.removeItem("sm_user");
      // Only redirect if we're in an admin-protected area
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }
    const message = error.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject({ message, code: error.response?.data?.code, status: error.response?.status });
  }
);

export default api;
