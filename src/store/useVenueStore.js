import { create } from "zustand";
import {
  createVenue,
  deleteVenue,
  getVenues,
  updateVenue,
} from "../api/venues.api";
import { getVenueHierarchy, saveVenueHierarchy } from "../api/category.api";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../api/events.api";

const useVenueStore = create((set) => ({
  venues: [],
  events: [],
  loading: false,
  error: null,

  fetchVenues: async () => {
    try {
      set({ loading: true });
      const res = await getVenues();
      console.log("venues data from the api", res.data);
      set({
        venues: res.data.map((v) => ({ ...v })),
        loading: false,
      });
    } catch (err) {
      console.log("error", err);
      set({ error: "Failed to load venues", loading: false });
    }
  },
  addVenue: async (venueData) => {
    try {
      set({ loading: true, error: null });
      console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

      const res = await createVenue(venueData);

      // backend response becomes source of truth
      set((state) => ({
        venues: [...state.venues, { ...res.data, seating: [] }],
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({
        error: "Failed to add venue",
        loading: false,
      });
      throw err; // important so UI can react
    }
  },
  deleteVenue: async (id) => {
    await deleteVenue(id);
    set((state) => ({
      venues: state.venues.filter((v) => v.id !== id),
    }));
  },

  addEvent: async (event) => {
    try {
      set({ loading: true, error: null });

      const res = await createEvent(event);

      set((state) => ({
        events: [...state.events, { ...res.data }],
      }));
    } catch (error) {
      console.log("error in adding event", error);
    }
  },
  fetchEvents: async () => {
    try {
      set({ loading: true });
      const res = await getEvents();
      console.log("events data", res.data);
      set({
        events: res.data.map((e) => ({ ...e })),
      });
    } catch (error) {
      console.log("error in fetching events", error);
    }
  },
  updateVenue: async (id, data) => {
    const res = await updateVenue(id, data);
    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === id ? { ...v, ...res.data } : v,
      ),
    }));
  },
  updateEvent: async (id, data) => {
    const res = await updateEvent(id, data);
    set((state) => ({
      events: state.events.map((eve) =>
        eve.id === id ? { ...eve, ...res.data } : eve,
      ),
    }));
  },
  deleteEvent: async (id) => {
    await deleteEvent(id);
    set((state) => ({
      events: state.events.filter((eve) => eve.id !== id),
    }));
  },
  // categories of venues
  fetchVenueHierarchy: async (venueId) => {
    try {
      const response = await getVenueHierarchy(venueId);
      set((state) => ({
        venues: state.venues.map((v) =>
          v.id === venueId
            ? { ...v, seating: response.data.categories || [] }
            : v,
        ),
      }));
    } catch (err) {
      console.error("Failed to fetch venue hierarchy:", err);
    }
  },

  // Add category to venue
  addCategoryToVenue: (venueId, name, seats) => {
    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === venueId
          ? {
              ...v,
              seating: [
                ...(v.seating || []),
                {
                  id: crypto.randomUUID(),
                  name,
                  type: "category",
                  seats,
                  children: [],
                },
              ],
            }
          : v,
      ),
    }));
  },

  // Add subcategory to a category
  addSubCategoryToCategory: (venueId, categoryId, sub) => {
    set((state) => ({
      venues: state.venues.map((v) => {
        if (v.id !== venueId) return v;
        return {
          ...v,
          seating: v.seating.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  children: [
                    ...cat.children,
                    {
                      id: crypto.randomUUID(),
                      name: sub.name,
                      type: "subcategory",
                      seats: sub.seats,
                      price: sub.price || 0,
                      children: [],
                    },
                  ],
                }
              : cat,
          ),
        };
      }),
    }));
  },

  // Save hierarchy to backend
  saveVenueHierarchyToBackend: async (venueId) => {
    try {
      const venue = get().venues.find((v) => v.id === venueId);
      if (!venue) return;
      await saveVenueHierarchy(venueId, { categories: venue.seating });
      console.log("Venue hierarchy saved successfully!");
    } catch (err) {
      console.error("Failed to save venue hierarchy:", err);
    }
  },

  // EVENTS    slice begins hereee=============================================
}));

export default useVenueStore;
