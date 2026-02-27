import api from "../api/axios";

const venueHierarchySlice = (set, get) => ({
  /* ==========================
     STATE
  ========================== */
  venueHierarchies: {},
  // { [venueId]: CategoryNode[] }
  /* ==========================
     ADD ROOT CATEGORY
  ========================== */
  addRootCategory: (venueId, category) => {
    set((state) => ({
      venueHierarchies: {
        ...state.venueHierarchies,
        [venueId]: [
          ...(state.venueHierarchies[venueId] || []),
          {
            id: null,
            name: category.name,
            // type: category.category_type,
            seats: category.seats,
            // price: category.price || 0,
            children: [],
          },
        ],
      },
    }));
  },

  /* ==========================
     ADD CHILD CATEGORY
  ========================== */
  addChildCategory: (venueId, parentPath, category) => {
    const addAtPath = (nodes, path, depth = 0) => {
      return nodes.map((node, index) => {
        if (index === path[depth]) {
          if (depth === path.length - 1) {
            return {
              ...node,
              children: [
                ...node.children,
                {
                  name: category.name,
                  // category_type: category.category_type,
                  seats: category.seats,
                  price: category.price || 0,
                  children: [],
                },
              ],
            };
          }
          return {
            ...node,
            children: addAtPath(node.children, path, depth + 1),
          };
        }
        return node;
      });
    };

    set((state) => ({
      venueHierarchies: {
        ...state.venueHierarchies,
        [venueId]: addAtPath(state.venueHierarchies[venueId] || [], parentPath),
      },
    }));
  },

  editSubCategory: (venueId, catIndex, subIndex, updatedData) =>
    set((state) => {
      const venueHierarchy = [...(state.venueHierarchies[venueId] || [])];

      venueHierarchy[catIndex] = {
        ...venueHierarchy[catIndex],
        children: venueHierarchy[catIndex].children.map((sub, i) =>
          i === subIndex ? { ...sub, ...updatedData } : sub,
        ),
      };

      return {
        venueHierarchies: {
          ...state.venueHierarchies,
          [venueId]: venueHierarchy,
        },
      };
    }),

  /* ==========================
     SAVE TO BACKEND
  ========================== */
  saveHierarchyToBackend: async (venueId) => {
    const draft = get().venueHierarchies[venueId];
    // if (!draft?.length) {
    //   return {
    //     success: false,
    //     message: "No hierarchy data to save",
    //   };
    // }

    try {
      const res = await api.post(`/venues/${venueId}/hierarchy`, {
        hierarchy: draft,
      });

      set((state) => ({
        venueHierarchies: {
          ...state.venueHierarchies,
          [venueId]: res.data.hierarchy,
        },
      }));
      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Save failed",
      };
    }
  },

  /* ==========================
     RESET (OPTIONAL)
  ========================== */
  clearHierarchy: (venueId) => {
    set((state) => ({
      venueHierarchies: {
        ...state.venueHierarchies,
        [venueId]: [],
      },
    }));
  },
  // Delete a root category (mark as deleted)
  // Delete a root category completely
  deleteRootCategory: (venueId, catIndex) => {
    set((state) => {
      const hierarchy = state.venueHierarchies[venueId] || [];
      hierarchy.splice(catIndex, 1); // remove the category
      return {
        venueHierarchies: { ...state.venueHierarchies, [venueId]: hierarchy },
      };
    });
  },

  // Delete a subcategory completely
  deleteSubCategory: (venueId, catIndex, subIndex) => {
    set((state) => {
      const hierarchy = state.venueHierarchies[venueId] || [];
      const category = hierarchy[catIndex];
      if (category && category.children) {
        category.children.splice(subIndex, 1); // remove the subcategory
      }
      return {
        venueHierarchies: { ...state.venueHierarchies, [venueId]: hierarchy },
      };
    });
  },
});

export default venueHierarchySlice;
