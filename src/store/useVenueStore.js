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
          seating: [],
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


    // categories of venues
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
                          seats: subCategory.seats
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
}));

export default useVenueStore;
