import axios from "./axios";

export const getVenues = () => axios.get("/venues");
export const createVenue = (formData) => axios.post("/venues", formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
       withCredentials: true,
    });
export const deleteVenue = (id) => axios.delete(`/venues/${id}`);
export const updateVenue = (id, formData) => axios.put(`/venues/${id}`, formData,
  {
      headers: {
        "Content-Type": "multipart/form-data",
      },
       withCredentials: true,
    }
);
