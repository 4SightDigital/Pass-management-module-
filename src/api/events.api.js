import api from "./axios";

export const getEvents = () => api.get("events/");

export const createEvent = (data) => api.post("events/", data);
