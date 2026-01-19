import axios from "axios";

// Use relative path for production (EXE)
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment
  ? "https://backend-pass-management.onrender.com/api"
  : "/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // 🔥 IMPORTANT
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

// API functions
export const getVenues = () => api.get("/venues/");
export const createVenue = (venueData) => api.post("/venues/", venueData);
export const deleteVenue = (id) => api.delete(`/venues/${id}`);

export default api;
