import React, { useState } from "react";
import useVenueStore from "../store/useVenueStore";
import AddCategory from "../components/AddCategory";
import AddSubCategory from "../components/AddSubCategory";

const ManageSeating = () => {
  const {
    venues,
    addCategoryToVenue,
    addSubCategoryToCategory,
    fetchVenueHierarchy,
    saveVenueHierarchyToBackend,
  } = useVenueStore();

  const [openVenueId, setOpenVenueId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle category expansion
  const toggleCategory = (venueId, categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [`${venueId}-${categoryId}`]: !prev[`${venueId}-${categoryId}`],
    }));
  };

  // Calculate total seats per venue
  const getVenueTotalSeats = (venue) => {
    return (
      venue.seating?.reduce((total, cat) => total + (cat.seats || 0), 0) || 0
    );
  };

  // Calculate total subcategory seats per category
  const getCategoryUsedSeats = (subCategories) => {
    return subCategories.reduce((total, sub) => total + (sub.seats || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Manage Seating Layout
            </h1>
            <p className="text-gray-600">
              Organize seating categories and subcategories for each venue
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl">
              <span className="text-sm font-medium text-gray-700">
                {venues.length} Venue{venues.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Venues</p>
                <p className="text-2xl font-bold text-gray-800">
                  {venues.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6A8.5 8.5 0 0012 3.5 8.5 8.5 0 003.5 12v6.5h17V12z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Configured Seats</p>
                <p className="text-2xl font-bold text-gray-800">
                  {venues.reduce(
                    (total, venue) => total + getVenueTotalSeats(venue),
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-800">
                  {venues.reduce(
                    (total, venue) => total + (venue.seating?.length || 0),
                    0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Venues Accordion */}
      <div className="space-y-4">
        {venues.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Venues Added
            </h3>
            <p className="text-gray-600 mb-6">
              Add venues first to configure their seating layout
            </p>
          </div>
        ) : (
          venues.map((venue, index) => {
            const isOpen = openVenueId === venue.id;
            const venueTotalSeats = getVenueTotalSeats(venue);
            const venueCapacity = venue.total_capacity || 0;
            console.log("venuesss111", venue);
            return (
              <div
                key={venue.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl"
              >
                {/* Venue Accordion Header */}
                <button
                  onClick={() => {
                    const next = isOpen ? null : venue.id;
                    setOpenVenueId(next);
                    if (!isOpen && venue.seating.length === 0) {
                      fetchVenueHierarchy(venue.id);
                    }
                  }}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {venue.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          {venue.location}
                        </span>
                        <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">
                          {venue.venue_type || "No type specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Seat Statistics */}
                    <div className="text-right hidden md:block">
                      <div className="text-sm text-gray-500">
                        Seat Configuration
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {venueTotalSeats} / {venueCapacity}
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                          style={{
                            width: `${venueCapacity ? (venueTotalSeats / venueCapacity) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Accordion Icon */}
                    <div
                      className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <svg
                        className="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Venue Accordion Body */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                    {/* Venue Summary */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">
                            Venue Capacity Overview
                          </h4>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600">
                                Configured: {venueTotalSeats} seats
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600">
                                Total Capacity: {venueCapacity} seats
                              </span>
                            </div>
                          </div>
                        </div>
                        {venueCapacity > 0 && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                              {Math.round(
                                (venueTotalSeats / venueCapacity) * 100,
                              )}
                              %
                            </div>
                            <div className="text-sm text-gray-500">
                              Capacity Utilized
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Category Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Seating Categories
                        </h4>
                        <span className="text-sm text-gray-500">
                          {venue.seating?.length || 0} categorie
                          {venue.seating?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <AddCategory
                        onAdd={(name, seats) => {
                          addCategoryToVenue(venue.id, name, seats);
                          saveVenueHierarchyToBackend(venue.id);
                        }}
                      />
                    </div>

                    {/* Categories List */}
                    <div className="space-y-4">
                      {venue.seating?.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <svg
                            className="w-12 h-12 text-gray-400 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <p className="text-gray-500">
                            No categories added yet
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Add your first category above
                          </p>
                        </div>
                      ) : (
                        venue.seating?.map((cat, catIndex) => {
                          const isCategoryExpanded =
                            expandedCategories[`${venue.id}-${cat.id}`];
                          const usedSeats = getCategoryUsedSeats(cat.children);
                          const availableSeats = cat.seats - usedSeats;

                          return (
                            <div
                              key={cat.id}
                              className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors duration-200"
                            >
                              {/* Category Header */}
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg text-white font-medium">
                                    {catIndex + 1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-800">
                                      {cat.name}
                                    </h5>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-sm text-gray-600">
                                        Total: {cat.seats} seats
                                      </span>
                                      <span
                                        className={`text-sm px-2 py-1 rounded-md ${
                                          availableSeats >= 0
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {availableSeats >= 0
                                          ? `${availableSeats} available`
                                          : `${-availableSeats} overflow`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    toggleCategory(venue.id, cat.id)
                                  }
                                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <svg
                                    className={`w-5 h-5 text-gray-500 transition-transform ${isCategoryExpanded ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Category Progress Bar */}
                              {cat.seats > 0 && (
                                <div className="mb-4">
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Subcategory seats: {usedSeats}</span>
                                    <span>Available: {availableSeats}</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                                      style={{
                                        width: `${(usedSeats / cat.seats) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Add Subcategory */}
                              <div className="mb-4">
                                <AddSubCategory
                                  maxSeats={availableSeats}
                                  onAdd={(sub) => {
                                    addSubCategoryToCategory(
                                      venue.id,
                                      catIndex,
                                      sub,
                                    );

                                    saveVenueHierarchyToBackend(venue.id);
                                  }}
                                />
                              </div>

                              {/* Subcategory List */}
                              {isCategoryExpanded &&
                                cat.children.length > 0 && (
                                  <div className="mt-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h6 className="font-medium text-gray-700">
                                        Subcategories
                                      </h6>
                                      <span className="text-sm text-gray-500">
                                        {cat.children.length} subcategorie
                                        {cat.children.length !== 1 ? "s" : ""}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {cat.children.map((s, subIndex) => (
                                        <div
                                          key={s.id}
                                          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors duration-200"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3">
                                              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-lg text-gray-700 font-medium text-sm">
                                                {subIndex + 1}
                                              </div>
                                              <div>
                                                <div className="font-medium text-gray-800">
                                                  {s.name}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                  Price: ${s.price || "0"} •
                                                  Seats: {s.seats}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-lg font-bold text-emerald-600">
                                                {s.seats}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                seats
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageSeating;
