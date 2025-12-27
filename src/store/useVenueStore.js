import { create } from "zustand";

const useVenueStore = create((set) => ({
  venues: [],

  addVenue: (venue) =>
    set((state) => ({
      venues: [
        ...state.venues,
        {
          ...venue,
          id: crypto.randomUUID(), // 👈 unique ID created here
        },
      ],
    })),

  deleteVenue: (id) =>
    set((state) => ({
      venues: state.venues.filter((v) => v.id !== id),
    })),

  updateVenue: (id, updatedData) =>
    set((state) => ({
      venues: state.venues.map((v) =>
        v.id === id ? { ...v, ...updatedData } : v
      ),
    })),
}));

export default useVenueStore;
