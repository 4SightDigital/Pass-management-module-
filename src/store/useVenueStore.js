import { create } from "zustand";
import { createVenue, deleteVenue, getVenues, updateVenue } from "../api/venues.api";
import { getVenueHierarchy, saveVenueHierarchy } from "../api/category.api";
import { createEvent } from "../api/events.api";

const useVenueStore = create((set) => ({
  venues: [],events: [],
  loading: false,
  error: null,

  fetchVenues: async () => {
    try {
      set({ loading: true });
      const res = await getVenues();
      console.log("venues data from the api",res.data)
      set({
        venues: res.data.map((v) => ({ ...v, seating: [] })),
        loading: false,
      });
    } catch(err) {
      console.log("error", err)
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
  addEvent: async (event) => {
    try {
      set({ loading: true, error: null });

      const res = await createEvent(event);

      set((state) => ({
        events: [...state.events,{...res.data},
        ],
      }));
    } catch (error) {}
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

  
}));

export default useVenueStore;
