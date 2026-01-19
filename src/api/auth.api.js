import axios from "./axios";

export const loginUser = (data) => axios.post("/login", data);
export const logoutUser = () => axios.post("/logout");
export const getCurrentUser = () => axios.get("/me");
