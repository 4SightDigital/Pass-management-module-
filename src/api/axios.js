import axios from "axios";

// Use relative path for production (EXE)
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment
  ? "http://localhost:5000/api"
  : "/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 IMPORTANT
});

// Add request interceptor to handle auth if needed
//commented to use flask session token

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

export default api;
