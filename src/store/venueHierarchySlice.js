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

  /* ==========================
     SAVE TO BACKEND
  ========================== */
  saveHierarchyToBackend: async (venueId) => {
    const draft = get().venueHierarchies[venueId];
    if (!draft?.length) {
      return {
        success: false,
        message: "No hierarchy data to save",
      };
    }

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
});

export default venueHierarchySlice;
