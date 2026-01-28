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

export default api;
