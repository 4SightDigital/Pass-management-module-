import api from "./axios";

export const getEvents = () => api.get("events/");

export const createEvent = (data) => api.post("events/", data);

export const deleteEvent = (id) => api.delete(`events/${id}/`);

export const updateEvent = (id, data) => api.put(`events/${id}/`, data);
