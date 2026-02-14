import React, { useState, useEffect } from "react";
import useVenueStore from "../store/useVenueStore";
import AddCategory from "../components/AddCategory";
import AddSubCategory from "../components/AddSubCategory";

const ManageSeating = () => {
  // Store hooks
  const {
    venues,
    venueHierarchies,
    fetchVenueHierarchy,
    addRootCategory,
    addChildCategory,
    saveHierarchyToBackend,
    deleteRootCategory,
    deleteSubCategory,
    editSubCategory,
  } = useVenueStore();

  // State management
  const [openVenueId, setOpenVenueId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({});
  const [editingSub, setEditingSub] = useState(null);
  const [loadingHierarchies, setLoadingHierarchies] = useState({});

  // Helper functions
  const toggleCategory = (venueId, index) => {
    const key = `${venueId}-${index}`;
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getCategoryUsedSeats = (children = []) =>
    children.reduce((sum, c) => sum + (c.seats || 0), 0);

  const getRemainingSeats = (cat) => {
    const usedSeats = getCategoryUsedSeats(cat.children);
    return cat.seats - usedSeats;
  };

  const getVenueRemainingSeats = (venueId) => {
    const hierarchy = venueHierarchies[venueId] || [];
    const venue = venues.find((v) => v.id === venueId);
    if (!venue) return 0;
    const usedSeats = hierarchy.reduce((sum, cat) => sum + cat.seats, 0);
    return venue.total_capacity - usedSeats;
  };

  const isCategoryNameUnique = (venueId, categoryName, excludeIndex = null) => {
    const hierarchy = venueHierarchies[venueId] || [];
    return !hierarchy.some(
      (cat, index) =>
        index !== excludeIndex &&
        cat.name.toLowerCase() === categoryName.toLowerCase(),
    );
  };

  const isSubcategoryNameUnique = (
    venueId,
    catIndex,
    subcategoryName,
    excludeSubIndex = null,
  ) => {
    const hierarchy = venueHierarchies[venueId] || [];
    const category = hierarchy[catIndex];
    if (!category || !category.children) return true;

    return !category.children.some(
      (sub, index) =>
        index !== excludeSubIndex &&
        sub.name.toLowerCase() === subcategoryName.toLowerCase(),
    );
  };

  const validateVenueHierarchy = (venueId) => {
    const hierarchy = venueHierarchies[venueId] || [];
    const venue = venues.find((v) => v.id === venueId);
    const errors = {};

    if (!venue) return errors;

    hierarchy.forEach((cat, catIndex) => {
      const usedSeats = getCategoryUsedSeats(cat.children);

      if (usedSeats > cat.seats) {
        errors[`${venueId}-${catIndex}-seats`] = {
          message: `Subcategories exceed parent seats by ${usedSeats - cat.seats}`,
          overflow: usedSeats - cat.seats,
        };
      }

      if (!isCategoryNameUnique(venueId, cat.name, catIndex)) {
        errors[`${venueId}-${catIndex}-name`] = {
          message: `Category name "${cat.name}" is already used in this venue`,
          duplicate: true,
        };
      }

      cat.children.forEach((sub, subIndex) => {
        if (!isSubcategoryNameUnique(venueId, catIndex, sub.name, subIndex)) {
          errors[`${venueId}-${catIndex}-${subIndex}-name`] = {
            message: `Subcategory name "${sub.name}" is already used in this category`,
            duplicate: true,
          };
        }

        if (sub.seats > cat.seats) {
          errors[`${venueId}-${catIndex}-${subIndex}-seats`] = {
            message: `Subcategory seats exceed parent category seats`,
            overflow: true,
          };
        }
      });
    });

    const totalSeats = hierarchy.reduce(
      (sum, cat) => sum + (cat.seats || 0),
      0,
    );
    if (totalSeats > venue.total_capacity) {
      errors[`${venueId}-total-seats`] = {
        message: `Total category seats exceed venue capacity by ${totalSeats - venue.total_capacity}`,
        overflow: totalSeats - venue.total_capacity,
      };
    }

    return errors;
  };

  const venueHasErrors = (venueId) => {
    const errors = validateVenueHierarchy(venueId);
    return Object.keys(errors).length > 0;
  };

  const handleSaveHierarchy = async (venueId) => {
    setSaveStatus((prev) => ({ ...prev, [venueId]: null }));

    const errors = validateVenueHierarchy(venueId);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setValidationErrors({});

    try {
      setIsSaving(true);
      const result = await saveHierarchyToBackend(venueId);

      if (result.success) {
        setSaveStatus((prev) => ({
          ...prev,
          [venueId]: {
            type: "success",
            message: "Seating layout saved successfully!",
          },
        }));

        setTimeout(() => {
          setOpenVenueId(null);
        }, 1500);

        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [venueId]: null }));
        }, 5000);
      } else {
        setSaveStatus((prev) => ({
          ...prev,
          [venueId]: {
            type: "error",
            message:
              result.message ||
              "Failed to save seating layout. Please try again.",
          },
        }));
      }
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus((prev) => ({
        ...prev,
        [venueId]: {
          type: "error",
          message:
            error.message || "An unexpected error occurred. Please try again.",
        },
      }));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setValidationErrors({});
  }, [venueHierarchies]);

  useEffect(() => {
    if (!openVenueId && saveStatus[openVenueId]) {
      setSaveStatus((prev) => ({ ...prev, [openVenueId]: null }));
    }
  }, [openVenueId, saveStatus]);

  useEffect(() => {
    venues.forEach((v) => {
      if (!venueHierarchies[v.id]) {
        fetchVenueHierarchy(v.id);
      }
    });
  }, [venues, fetchVenueHierarchy, venueHierarchies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Manage Seating Layout
              </h1>
              <p className="text-gray-600 max-w-3xl">
                Create and organize hierarchical seating categories for your
                venues. Follow the step-by-step process to allocate seats
                efficiently.
              </p>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex items-center justify-center">
                1
              </div>
              <span className="text-sm font-medium text-gray-700">
                Select Venue
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex items-center justify-center">
                2
              </div>
              <span className="text-sm font-medium text-gray-700">
                Add Categories
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex items-center justify-center">
                3
              </div>
              <span className="text-sm font-medium text-gray-700">
                Add Subcategories
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex items-center justify-center">
                4
              </div>
              <span className="text-sm font-medium text-gray-700">
                Validate & Save
              </span>
            </div>
          </div>
        </header>

        {venues.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto border border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-3xl flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Venues Added
            </h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Start by adding venues to create your seating layouts. Each venue
              can have multiple categories and subcategories.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>
        ) : (
          // Venues List
          <div className="space-y-6">
            {venues.map((venue, index) => {
              const hierarchy = venueHierarchies[venue.id] || [];
              const isOpen = openVenueId === venue.id;
              const hasErrors = venueHasErrors(venue.id);
              const venueSaveStatus = saveStatus[venue.id];
              const venueRemainingSeats = getVenueRemainingSeats(venue.id);
              const usedSeats = venue.total_capacity - venueRemainingSeats;

              return (
                <div
                  key={venue.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Venue Header - Clickable */}
                  <button
                    className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 group"
                    onClick={() => {
                      const next = isOpen ? null : venue.id;
                      setOpenVenueId(next);
                      if (!isOpen && !venueHierarchies[venue.id]) {
                        setLoadingHierarchies((prev) => ({
                          ...prev,
                          [venue.id]: true,
                        }));
                        fetchVenueHierarchy(venue.id).finally(() => {
                          setLoadingHierarchies((prev) => ({
                            ...prev,
                            [venue.id]: false,
                          }));
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-5">
                      {/* Venue Number Badge */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {index + 1}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">
                            {hierarchy.length}
                          </span>
                        </div>
                      </div>

                      {/* Venue Info */}
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-bold text-gray-900 text-xl">
                            {venue.name}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              hasErrors
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {hasErrors ? "Needs Fixing" : "Ready"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="text-gray-600 flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {venue.location}
                          </span>
                          <span className="text-gray-400">•</span>

                          {/* Capacity Progress */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-gray-700">
                                {usedSeats}/{venue.total_capacity}
                              </span>
                              <span className="text-gray-600">
                                seats allocated
                              </span>
                            </div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                                style={{
                                  width: `${(usedSeats / venue.total_capacity) * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          {venueRemainingSeats > 0 && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                {venueRemainingSeats} seats available
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                      {/* Save Status */}
                      {venueSaveStatus && (
                        <div
                          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                            venueSaveStatus.type === "success"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {venueSaveStatus.type === "success" ? (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Saved
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Failed
                            </>
                          )}
                        </div>
                      )}

                      {/* Expand Icon */}
                      <span
                        className={`transform transition-transform duration-300 text-gray-400 group-hover:text-gray-600 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-6 h-6"
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
                      </span>
                    </div>
                  </button>

                  {/* Venue Content (Expanded) */}
                  {isOpen && (
                    <div className="p-6 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                      {/* Save Status Banner */}
                      {venueSaveStatus && (
                        <div
                          className={`mb-6 p-4 rounded-xl border ${
                            venueSaveStatus.type === "success"
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-red-50 border-red-200"
                          } animate-fade-in`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                venueSaveStatus.type === "success"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {venueSaveStatus.type === "success" ? "✓" : "✗"}
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-semibold ${
                                  venueSaveStatus.type === "success"
                                    ? "text-emerald-800"
                                    : "text-red-800"
                                } mb-1`}
                              >
                                {venueSaveStatus.type === "success"
                                  ? "Success!"
                                  : "Save Failed"}
                              </h4>
                              <p
                                className={`text-sm ${
                                  venueSaveStatus.type === "success"
                                    ? "text-emerald-700"
                                    : "text-red-700"
                                }`}
                              >
                                {venueSaveStatus.message}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                setSaveStatus((prev) => ({
                                  ...prev,
                                  [venue.id]: null,
                                }))
                              }
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 1: Add Main Category */}
                      <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  1
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Add Main Category
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 ml-11">
                              Create primary seating sections (e.g., VIP,
                              General Admission, Balcony). Each category can
                              have multiple subcategories.
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                            Required
                          </span>
                        </div>

                        {/* Capacity Usage Overview */}
                        <div className="ml-11 mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>
                              Venue capacity:{" "}
                              <strong>{venue.total_capacity}</strong> seats
                            </span>
                            <span>
                              Available:{" "}
                              <strong className="text-emerald-600">
                                {venueRemainingSeats}
                              </strong>{" "}
                              seats
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                              style={{
                                width: `${((venue.total_capacity - venueRemainingSeats) / venue.total_capacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="ml-11">
                          <AddCategory
                            existingCategories={hierarchy.map(
                              (cat) => cat.name,
                            )}
                            onAdd={(cat) => {
                              const usedSeats = hierarchy.reduce(
                                (sum, c) => sum + (c.seats || 0),
                                0,
                              );
                              const remainingSeats =
                                venue.total_capacity - usedSeats;

                              if (cat.seats > remainingSeats) {
                                alert(
                                  `Cannot add category: Only ${remainingSeats} seats remaining in venue`,
                                );
                                return;
                              }

                              if (!isCategoryNameUnique(venue.id, cat.name)) {
                                alert(
                                  `Category name "${cat.name}" is already used. Please choose a different name.`,
                                );
                                return;
                              }

                              addRootCategory(venue.id, { ...cat });
                            }}
                          />
                        </div>
                      </div>

                      {/* Loading State */}
                      {loadingHierarchies[venue.id] ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                            </div>
                          ))}
                        </div>
                      ) : hierarchy.length === 0 ? (
                        // Empty Categories State
                        <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-white/50 mb-8">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">
                            No Categories Yet
                          </h4>
                          <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Start by adding your first main category above.
                            Categories help organize your seating into logical
                            sections.
                          </p>
                          <div className="w-48 h-1 bg-gradient-to-r from-gray-300 to-gray-200 mx-auto rounded-full"></div>
                        </div>
                      ) : (
                        // Categories List
                        <div className="space-y-6 mb-8">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  2
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900">
                                Categories & Subcategories
                              </h3>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                {hierarchy.length} main categories
                              </span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                Step 2
                              </span>
                            </div>
                          </div>

                          {hierarchy.map((cat, catIndex) => {
                            const key = `${venue.id}-${catIndex}`;
                            const expanded = expandedCategories[key];
                            const usedSeats = getCategoryUsedSeats(
                              cat.children,
                            );
                            const availableSeats = cat.seats - usedSeats;
                            const seatError =
                              validationErrors[`${venue.id}-${catIndex}-seats`];
                            const nameError =
                              validationErrors[`${venue.id}-${catIndex}-name`];
                            const isOverflow = usedSeats > cat.seats;

                            return (
                              <div
                                key={catIndex}
                                data-error={`${venue.id}-${catIndex}`}
                                className={`bg-white rounded-xl border-2 ${seatError || nameError ? "border-red-300 bg-red-50/30" : "border-gray-200 hover:border-blue-200"} p-5 shadow-sm transition-all duration-300`}
                              >
                                {/* Category Header */}
                                <div className="flex justify-between items-start mb-5">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-4 mb-4">
                                      {/* Category Number */}
                                      <div className="relative">
                                        <div
                                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                            seatError || nameError
                                              ? "bg-gradient-to-r from-red-100 to-red-200"
                                              : "bg-gradient-to-r from-blue-50 to-emerald-50"
                                          }`}
                                        >
                                          <span
                                            className={`font-bold text-lg ${
                                              seatError || nameError
                                                ? "text-red-700"
                                                : "text-blue-700"
                                            }`}
                                          >
                                            {catIndex + 1}
                                          </span>
                                        </div>
                                        {cat.children.length > 0 && (
                                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-xs font-bold text-gray-700">
                                              {cat.children.length}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Category Info */}
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <h4 className="font-bold text-gray-900 text-lg">
                                            {cat.name}
                                          </h4>
                                          {nameError && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                              <svg
                                                className="w-3 h-3"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                              Duplicate Name
                                            </span>
                                          )}
                                        </div>

                                        {/* Category Stats */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                          <span className="flex items-center gap-1">
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.0"
                                              />
                                            </svg>
                                            {cat.seats} total seats
                                          </span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                              />
                                            </svg>
                                            {cat.children.length} subcategor
                                            {cat.children.length === 1
                                              ? "y"
                                              : "ies"}
                                          </span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span
                                            className={`flex items-center gap-1 font-medium ${
                                              availableSeats > 0
                                                ? "text-emerald-600"
                                                : "text-amber-600"
                                            }`}
                                          >
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                              />
                                            </svg>
                                            {availableSeats} seats available
                                          </span>
                                        </div>

                                        {/* Seat Allocation Progress */}
                                        <div className="mb-4">
                                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span className="font-medium">
                                              Seat Allocation
                                            </span>
                                            <span>
                                              {usedSeats} of {cat.seats} seats
                                              used
                                            </span>
                                          </div>
                                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                              className={`h-full transition-all duration-700 ${
                                                isOverflow
                                                  ? "bg-gradient-to-r from-red-500 to-red-600"
                                                  : "bg-gradient-to-r from-emerald-400 to-blue-500"
                                              }`}
                                              style={{
                                                width: `${Math.min((usedSeats / cat.seats) * 100, 100)}%`,
                                              }}
                                            />
                                          </div>
                                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>0</span>
                                            <span>
                                              {Math.round(cat.seats / 2)}
                                            </span>
                                            <span>{cat.seats}</span>
                                          </div>
                                        </div>

                                        {/* Error Messages */}
                                        {(seatError || nameError) && (
                                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <svg
                                                  className="w-5 h-5 text-red-600"
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium text-red-800 mb-1">
                                                  {seatError
                                                    ? seatError.message
                                                    : nameError.message}
                                                </p>
                                                <p className="text-xs text-red-600">
                                                  {seatError
                                                    ? "Reduce subcategory seats or increase category seats"
                                                    : "Use a unique name for this category"}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Category Actions */}
                                  <div className="flex items-center gap-2">
                                    {cat.children.length > 0 && (
                                      <button
                                        onClick={() =>
                                          toggleCategory(venue.id, catIndex)
                                        }
                                        className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-300"
                                      >
                                        <span className="text-sm font-medium">
                                          {expanded ? "Hide" : "Show"}{" "}
                                          Subcategories
                                        </span>
                                        <svg
                                          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
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
                                    )}
                                    <button
                                      onClick={() => {
                                        if (
                                          window.confirm(`Are you sure you want to remove ${cat.name} category? 
This change will be applied only after saving the layout.`)
                                        ) {
                                          deleteRootCategory(
                                            venue.id,
                                            catIndex,
                                          );
                                        }
                                      }}
                                      className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                      title="Delete Category"
                                    >
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>

                                {/* Add Subcategory Section */}
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                  <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-7 h-7 rounded-md bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">
                                          +
                                        </span>
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-gray-900">
                                          Add Subcategory
                                        </h5>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {availableSeats > 0
                                            ? `Allocate seats from the ${availableSeats} available in this category`
                                            : "This category is fully allocated"}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                                      Step 3
                                    </span>
                                  </div>

                                  {availableSeats <= 0 ? (
                                    <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                                      <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                          <svg
                                            className="w-5 h-5 text-amber-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-amber-800">
                                            Category at Full Capacity
                                          </p>
                                          <p className="text-sm text-amber-700 mt-1">
                                            All {cat.seats} seats have been
                                            allocated to subcategories.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <AddSubCategory
                                      parentSeats={cat.seats}
                                      usedSeats={usedSeats}
                                      maxSeats={availableSeats}
                                      existingSubcategories={cat.children.map(
                                        (sub) => sub.name,
                                      )}
                                      onAdd={(sub) => {
                                        if (sub.seats > availableSeats) {
                                          alert(
                                            `Cannot add: Only ${availableSeats} seats available in this category`,
                                          );
                                          return;
                                        }

                                        if (
                                          !isSubcategoryNameUnique(
                                            venue.id,
                                            catIndex,
                                            sub.name,
                                          )
                                        ) {
                                          alert(
                                            `Name "${sub.name}" already exists in this category. Please choose a different name.`,
                                          );
                                          return;
                                        }

                                        addChildCategory(venue.id, [catIndex], {
                                          ...sub,
                                          category_type: "subsection",
                                          children: [],
                                        });
                                      }}
                                    />
                                  )}
                                </div>

                                {/* Subcategories List */}
                                {expanded && cat.children.length > 0 && (
                                  <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-5">
                                      <div className="flex items-center gap-3">
                                        <h5 className="font-bold text-gray-900 text-lg">
                                          Subcategories
                                        </h5>
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                          {cat.children.length} items
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Total allocated:{" "}
                                        <strong className="text-gray-700">
                                          {usedSeats}
                                        </strong>{" "}
                                        seats
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {cat.children.map((sub, subIndex) => {
                                        const errorId = `${venue.id}-${catIndex}-${subIndex}`;
                                        const seatError =
                                          validationErrors[`${errorId}-seats`];
                                        const nameError =
                                          validationErrors[`${errorId}-name`];
                                        const hasError = seatError || nameError;
                                        const isEditing =
                                          editingSub?.venueId === venue.id &&
                                          editingSub?.catIndex === catIndex &&
                                          editingSub?.subIndex === subIndex;

                                        return (
                                          <div
                                            key={subIndex}
                                            className={`bg-white border rounded-xl p-4 transition-all hover:shadow-md ${
                                              isEditing
                                                ? "border-blue-400 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-100"
                                                : hasError
                                                  ? "border-red-300 bg-red-50"
                                                  : "border-gray-200 hover:border-gray-300"
                                            }`}
                                          >
                                            {/* Subcategory Header */}
                                            <div className="flex justify-between items-start mb-3">
                                              <div className="flex items-center gap-2">
                                                <div
                                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    hasError
                                                      ? "bg-red-100"
                                                      : "bg-gradient-to-r from-gray-50 to-gray-100"
                                                  }`}
                                                >
                                                  <span
                                                    className={`font-bold text-sm ${
                                                      hasError
                                                        ? "text-red-700"
                                                        : "text-gray-700"
                                                    }`}
                                                  >
                                                    {subIndex + 1}
                                                  </span>
                                                </div>
                                                <div>
                                                  {isEditing ? (
                                                    <input
                                                      value={editingSub.name}
                                                      onChange={(e) =>
                                                        setEditingSub({
                                                          ...editingSub,
                                                          name: e.target.value,
                                                        })
                                                      }
                                                      className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm w-full bg-white"
                                                      placeholder="Subcategory name"
                                                      autoFocus
                                                    />
                                                  ) : (
                                                    <>
                                                      <h6 className="font-semibold text-gray-900">
                                                        {sub.name}
                                                      </h6>
                                                      {nameError && (
                                                        <span className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                                                          <svg
                                                            className="w-3 h-3"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                          >
                                                            <path
                                                              fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"
                                                            />
                                                          </svg>
                                                          Duplicate name
                                                        </span>
                                                      )}
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                              <button
                                                onClick={() => {
                                                  if (
                                                    window.confirm(`Are you sure you want to remove ${sub.name} Sub Category? 
This change will be applied only after saving the layout.`)
                                                  ) {
                                                    deleteSubCategory(
                                                      venue.id,
                                                      catIndex,
                                                      subIndex,
                                                    );
                                                  }
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Subcategory"
                                              >
                                                <svg
                                                  className="w-4 h-4"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                  />
                                                </svg>
                                              </button>
                                            </div>

                                            {/* Seat Count & Actions */}
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <div className="text-xs text-gray-500 mb-1">
                                                  Seats Allocated
                                                </div>
                                                {isEditing ? (
                                                  <input
                                                    type="number"
                                                    min="1"
                                                    max={
                                                      availableSeats + sub.seats
                                                    }
                                                    value={editingSub.seats}
                                                    onChange={(e) =>
                                                      setEditingSub({
                                                        ...editingSub,
                                                        seats: Math.max(
                                                          1,
                                                          Number(
                                                            e.target.value,
                                                          ) || 0,
                                                        ),
                                                      })
                                                    }
                                                    className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm w-24 bg-white"
                                                  />
                                                ) : (
                                                  <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                      {sub.seats}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                      seats
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex gap-2">
                                                {isEditing ? (
                                                  <>
                                                    <button
                                                      onClick={() => {
                                                        editSubCategory(
                                                          venue.id,
                                                          catIndex,
                                                          subIndex,
                                                          {
                                                            name: editingSub.name,
                                                            seats:
                                                              editingSub.seats,
                                                          },
                                                        );
                                                        setEditingSub(null);
                                                      }}
                                                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow"
                                                    >
                                                      Save
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        setEditingSub(null)
                                                      }
                                                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
                                                    >
                                                      Cancel
                                                    </button>
                                                  </>
                                                ) : (
                                                  <button
                                                    onClick={() =>
                                                      setEditingSub({
                                                        venueId: venue.id,
                                                        catIndex,
                                                        subIndex,
                                                        name: sub.name,
                                                        seats: sub.seats,
                                                      })
                                                    }
                                                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:text-blue-800 text-xs font-semibold rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all flex items-center gap-1 border border-blue-200"
                                                  >
                                                    <svg
                                                      className="w-3.5 h-3.5"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                      />
                                                    </svg>
                                                    Edit
                                                  </button>
                                                )}
                                              </div>
                                            </div>

                                            {/* Error Messages */}
                                            {hasError && !isEditing && (
                                              <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-start gap-2">
                                                  <svg
                                                    className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                  <span className="text-xs text-red-600 font-medium">
                                                    {seatError?.message ||
                                                      nameError?.message}
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Save Section */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div
                          className={`p-5 rounded-xl mb-6 ${
                            hasErrors
                              ? "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                              : "bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                hasErrors
                                  ? "bg-red-100 text-red-600"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {hasErrors ? "⚠️" : "✓"}
                            </div>
                            <div>
                              <h4
                                className={`font-bold text-lg mb-2 ${
                                  hasErrors
                                    ? "text-red-800"
                                    : "text-emerald-800"
                                }`}
                              >
                                {hasErrors
                                  ? "Validation Required"
                                  : "Ready to Save"}
                              </h4>
                              <p
                                className={`text-sm ${
                                  hasErrors
                                    ? "text-red-700"
                                    : "text-emerald-700"
                                }`}
                              >
                                {hasErrors
                                  ? "Please fix all validation errors before saving this seating layout."
                                  : "All categories are properly configured and ready to be saved."}
                              </p>
                              {!hasErrors && (
                                <p className="text-xs text-emerald-600 mt-2">
                                  Total seats allocated:{" "}
                                  {venue.total_capacity - venueRemainingSeats}{" "}
                                  of {venue.total_capacity}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-1">
                              Save Seating Layout
                            </h5>
                            <p className="text-sm text-gray-600">
                              This will update the seating configuration for{" "}
                              <strong>{venue.name}</strong>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Changes will be reflected immediately in event
                              creation
                            </p>
                          </div>
                          <button
                            onClick={() => handleSaveHierarchy(venue.id)}
                            disabled={isSaving || hasErrors}
                            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                              hasErrors || isSaving
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm"
                                : "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                            }`}
                          >
                            {isSaving ? (
                              <>
                                <svg
                                  className="w-5 h-5 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  ></path>
                                </svg>
                                Saving Configuration...
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Save Seating Layout
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSeating;
