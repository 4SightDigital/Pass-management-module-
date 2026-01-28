import api from "./axios";

// Fetch venue hierarchy (categories + subcategories)
export const getVenueHierarchy = (venueId) => {
  return api.get(`/venues/${venueId}/hierarchy`);
};

// Save or update venue hierarchy
export const saveVenueHierarchy = (venueId, hierarchyData) => {
  return api.post(`/venues/${venueId}/hierarchy`, hierarchyData);
};
