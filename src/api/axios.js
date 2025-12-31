import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // If using JWT, uncomment the following line
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default api;
