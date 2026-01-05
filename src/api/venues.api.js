import axios from "./axios";

export const getVenues = () => axios.get("/venues/");
export const createVenue = (data) => axios.post("/venues/", data);
export const deleteVenue = (id) => axios.delete(`/venues/${id}/`);
export const updateVenue = (id, data) => axios.put(`/venues/${id}/`, data);
