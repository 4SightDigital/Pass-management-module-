import api from "./axios";

export const getDashboardCategories = (eventId) => {
    return api.get(`/events/${eventId}/categories`)
}