import React, { useState } from "react";
import useVenueStore from "../store/useVenueStore";
import AddCategory from "../components/AddCategory";
import AddSubCategory from "../components/AddSubCategory";

const ManageSeating = () => {
  const { venues, addCategoryToVenue, addSubCategoryToCategory } =
    useVenueStore();

  const [openVenueId, setOpenVenueId] = useState(null);

  return (
    <div>
      {/* category of seats addition */}

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Manage Seating for Added Venues
      </h3>

      <div className="space-y-4">
        {venues.map((venue, index) => {
          const isOpen = openVenueId === venue.id;

          return (
            <div
              key={venue.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpenVenueId(isOpen ? null : venue.id)}
                className="w-full flex items-center justify-between
                     px-5 py-4 text-left
                     hover:bg-gray-50 rounded-lg"
              >
                <h4 className="flex items-center gap-3 text-lg font-semibold text-gray-700">
                  <span
                    className="flex items-center justify-center
               w-7 h-7 rounded-full
               bg-blue-100 text-blue-700 text-sm"
                  >
                    {index + 1}
                  </span>
                  {venue.name}
                </h4>

                <span className="text-gray-500 text-sm">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 space-y-4 border-t">
                  {/* Add Category */}
                  <AddCategory
                    onAdd={(name, seats) =>
                      addCategoryToVenue(venue.id, name, seats)
                    }
                  />

                  {/* Categories */}
                  <div className="space-y-4">
                    {venue.seating?.map((cat, catIndex) => (
                      <div
                        key={cat.id}
                        className="bg-gray-50 border border-gray-200
                             rounded-md p-4"
                      >
                        {/* Category Header */}
                        <div className="flex justify-between items-center mb-2">
                          <strong className="flex items-center gap-2 text-gray-800">
                            <span
                              className="flex items-center justify-center
                 w-6 h-6 rounded-full
                 bg-emerald-100 text-emerald-700 text-xs"
                            >
                              {catIndex + 1}
                            </span>
                            {cat.categoryName}
                          </strong>

                          <span className="text-sm text-gray-500">
                            {cat.categoryTotalSeats} seats
                          </span>
                        </div>

                        {/* Add Subcategory */}
                        <AddSubCategory
                          onAdd={(sub) =>
                            addSubCategoryToCategory(venue.id, cat.id, sub)
                          }
                        />

                        {/* Subcategory List */}
                        {cat.subCategories.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {cat.subCategories.map((s, subIndex) => (
                              <li
                                key={s.id}
                                className="flex justify-between items-center
             px-3 py-2 bg-white
             border rounded-md text-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className="flex items-center justify-center
                 w-5 h-5 rounded-full
                 bg-indigo-100 text-indigo-700 text-xs"
                                  >
                                    {catIndex + 1}.{subIndex + 1}
                                  </span>

                                  <span className="text-gray-700">
                                    {s.name}
                                  </span>
                                </div>

                                <span className="text-gray-500">
                                  {s.seats} seats
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ending of categories and sub categories */}
    </div>
  );
};

export default ManageSeating;
