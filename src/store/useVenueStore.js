import { create } from "zustand";
import { createVenue, deleteVenue, updateVenue } from "../api/venues.api";
import { getVenueHierarchy, saveVenueHierarchy } from "../api/category.api";

const useVenueStore = create((set) => ({
  venues: [],
  loading: false,
  error: null,

  fetchVenues: async () => {
    try {
      set({ loading: true });
      const res = await getVenues();
      set({
        venues: res.data.map((v) => ({ ...v, seating: [] })),
        loading: false,
      });
    } catch {
      set({ error: "Failed to load venues", loading: false });
    }
  },

  addVenue: async (venueData) => {
    try {
      set({ loading: true, error: null });

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

  updateVenue: async (id, data) => {
    const res = await updateVenue(id, data);
    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === id ? { ...v, ...res.data } : v
      ),
    }));
  },

  // categories of venues

  fetchVenueHierarchy: async (venueId) => {
    try {
      set({ loading: true });

      const res = await getVenueHierarchy(venueId);

      set((state) => ({
        venues: state.venues.map((v) =>
          v.id === venueId
            ? {
                ...v,
                seating: res.data.seating || [],
              }
            : v
        ),
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({
        error: "Failed to load seating hierarchy",
        loading: false,
      });
    }
  },

  saveVenueHierarchyToBackend: async (venueId) => {
    try {
      set({ loading: true });

      const venue = useVenueStore
        .getState()
        .venues.find((v) => v.id === venueId);

      if (!venue) return;

      await saveVenueHierarchy(venueId, {
        seating: venue.seating,
      });

      set({ loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: "Failed to save seating hierarchy",
        loading: false,
      });
      throw err;
    }
  },

  addCategoryToVenue: (venueId, categoryName, categoryTotalSeats) => {
    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === venueId
          ? {
              ...v,
              seating: [
                ...v.seating,
                {
                  id: crypto.randomUUID(),
                  categoryName,
                  categoryTotalSeats,
                  subCategories: [],
                },
              ],
            }
          : v
      ),
    }));
  },

  // sub categories of categories
  addSubCategoryToCategory: (venueId, categoryId, subCategory) => {
    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === venueId
          ? {
              ...v,
              seating: v.seating.map((c) =>
                c.id === categoryId
                  ? {
                      ...c,
                      subCategories: [
                        ...c.subCategories,
                        {
                          id: crypto.randomUUID(),
                          name: subCategory.name,
                          seats: subCategory.seats,
                        },
                      ],
                    }
                  : c
              ),
            }
          : v
      ),
    }));
  },

  // EVENTS    slice begins hereee=============================================

  events: [],

  addEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          id: crypto.randomUUID(),
          name: event.name,
          venueId: event.venueId,
          venueName: event.venueName, // optional, for UI
          status: event.status,
          startTime: event.startTime,
          endTime: event.endTime,
        },
      ],
    })),
}));

export default useVenueStore;
