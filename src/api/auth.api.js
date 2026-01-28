import axios from "./axios";

export const loginUser = (data) =>
  axios.post("/login", data, {
    withCredentials: true,
  });
export const logoutUser = () => axios.post("/logout");
export const getCurrentUser = () => {
  return axios.get("/me", {
    withCredentials: true,
  });
};
