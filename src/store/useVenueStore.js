import { create } from "zustand";
import axios from "axios";
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
// import { frontendToBackendHierarchy } from "../utils/mapper/hierachyMapper";
import api from "../api/axios"; // axios instance
import venueHierarchySlice from "./venueHierarchySlice";

const useVenueStore = create((set, get) => ({
  ...venueHierarchySlice(set, get),
  venues: [],
  events: [],
  loading: false,
  error: null,

  fetchVenues: async () => {
    try {
      set({ loading: true });
      const res = await getVenues();
      // console.log("venues data from the api", res.data);
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
        venues: [...state.venues, { ...res.data, hierarchy: [] }],
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
      alert("Event added Succesfully")
    } catch (error) {
      alert("Failed to Add Event")
      console.log("error in adding event", error);
    }
  },
  fetchEvents: async () => {
    try {
      set({ loading: true });
      const res = await getEvents();
      // console.log("events data", res.data);
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
    const res = await getVenueHierarchy(venueId);

    console.log("dataaaa for hierarchy", res.data.hierarchy);

    // Backend already returns nested hierarchy
    const hierarchy = res.data.hierarchy;

    set((state) => ({
      venueHierarchies: {
        ...state.venueHierarchies,
        [venueId]: hierarchy,
      },
    }));
  },

  createBooking: async ({
    eventId,
    subCategoryId,
    seatsRequested,
    guestDetails,
    referenceDetails,
  }) => {
    try {
      const response = await api.post("/claims/book", {
        event_id: Number(eventId),
        category_id: Number(subCategoryId),
        quantity: Number(seatsRequested),

        guest_name: guestDetails.name,
        department: guestDetails.department,
        contact_number: guestDetails.contact,

        reference_person: referenceDetails?.name || null,
        age: referenceDetails?.age || null,
        gender: referenceDetails?.gender || null,
      });

      // Optional: refresh hierarchy to update availability
      // await get().fetchVenueHierarchyByEvent(eventId);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Booking failed");
    }
  },

  // -------------------- END CREATE BOOKING --------------------

  // Add subcategory to a category
  addSubCategoryToCategory: (venueId, parentId, sub) => {
    const addRecursive = (nodes) =>
      nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...(node.children || []),
              {
                name: sub.name,
                category_type: "subcategory",
                seats: sub.seats,
                children: [],
              },
            ],
          };
        }

        if (node.children?.length) {
          return {
            ...node,
            children: addRecursive(node.children),
          };
        }

        return node;
      });

    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === venueId
          ? { ...v, hierarchy: addRecursive(v.hierarchy || []) }
          : v,
      ),
    }));
  },

  // EVENTS    slice begins hereee=============================================
}));

export default useVenueStore;
