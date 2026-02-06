import React, { useState, useEffect } from "react";
import useVenueStore from "../store/useVenueStore";
import AddCategory from "../components/AddCategory";
import AddSubCategory from "../components/AddSubCategory";

const ManageSeating = () => {
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

  const [openVenueId, setOpenVenueId] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({});
  const [editingSub, setEditingSub] = useState(null);
  // { venueId, catIndex, subIndex, name, seats }

  const toggleCategory = (venueId, index) => {
    const key = `${venueId}-${index}`;
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getCategoryUsedSeats = (children = []) =>
    children.reduce((sum, c) => sum + (c.seats || 0), 0);

  // Get remaining seats for a category
  const getRemainingSeats = (cat) => {
    const usedSeats = getCategoryUsedSeats(cat.children);
    return cat.seats - usedSeats;
  };

  // Check if category name is unique within venue
  const isCategoryNameUnique = (venueId, categoryName, excludeIndex = null) => {
    const hierarchy = venueHierarchies[venueId] || [];
    return !hierarchy.some(
      (cat, index) =>
        index !== excludeIndex &&
        cat.name.toLowerCase() === categoryName.toLowerCase(),
    );
  };

  // Check if subcategory name is unique within parent category
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

  // Validate all categories for a venue
  const validateVenueHierarchy = (venueId) => {
    const hierarchy = venueHierarchies[venueId] || [];
    const errors = {};

    // Check for duplicate category names
    hierarchy.forEach((cat, catIndex) => {
      const usedSeats = getCategoryUsedSeats(cat.children);

      // Check if total subcategory seats exceed parent seats
      if (usedSeats > cat.seats) {
        errors[`${venueId}-${catIndex}-seats`] = {
          message: `Subcategories exceed parent seats by ${usedSeats - cat.seats}`,
          overflow: usedSeats - cat.seats,
        };
      }

      // Check for duplicate category names
      const isUnique = isCategoryNameUnique(venueId, cat.name, catIndex);
      if (!isUnique) {
        errors[`${venueId}-${catIndex}-name`] = {
          message: `Category name "${cat.name}" is already used in this venue`,
          duplicate: true,
        };
      }

      // Check for duplicate subcategory names
      cat.children.forEach((sub, subIndex) => {
        const isSubUnique = isSubcategoryNameUnique(
          venueId,
          catIndex,
          sub.name,
          subIndex,
        );
        if (!isSubUnique) {
          errors[`${venueId}-${catIndex}-${subIndex}-name`] = {
            message: `Subcategory name "${sub.name}" is already used in this category`,
            duplicate: true,
          };
        }

        // Check if subcategory seats exceed parent seats
        if (sub.seats > cat.seats) {
          errors[`${venueId}-${catIndex}-${subIndex}-seats`] = {
            message: `Subcategory seats exceed parent category seats`,
            overflow: true,
          };
        }
      });
    });

    return errors;
  };

  // Check if venue has validation errors
  const venueHasErrors = (venueId) => {
    const errors = validateVenueHierarchy(venueId);
    return Object.keys(errors).length > 0;
  };

  // Enhanced save function with validation and status handling
  const handleSaveHierarchy = async (venueId) => {
    // Clear previous save status
    setSaveStatus((prev) => ({ ...prev, [venueId]: null }));

    const errors = validateVenueHierarchy(venueId);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      return;
    }

    // Clear any previous errors
    setValidationErrors({});

    try {
      setIsSaving(true);
      const result = await saveHierarchyToBackend(venueId);

      if (result.success) {
        // Set success status
        setSaveStatus((prev) => ({
          ...prev,
          [venueId]: {
            type: "success",
            message: "Seating layout saved successfully!",
          },
        }));

        // Close the venue accordion after successful save
        setTimeout(() => {
          setOpenVenueId(null);
        }, 1500);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, [venueId]: null }));
        }, 5000);
      } else {
        // Set error status
        setSaveStatus((prev) => ({
          ...prev,
          [venueId]: {
            type: "error",
            message:
              result.message ||
              "Failed to save seating layout. Please try again.",
          },
        }));

        // Keep accordion open to show errors
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

  // Clear errors when hierarchy changes
  useEffect(() => {
    setValidationErrors({});
  }, [venueHierarchies]);

  // Clear save status when accordion is closed
  useEffect(() => {
    if (!openVenueId && saveStatus[openVenueId]) {
      setSaveStatus((prev) => ({ ...prev, [openVenueId]: null }));
    }
  }, [openVenueId, saveStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Seating Layout
          </h1>
          <p className="text-gray-600">
            Create and organize seating categories for your venues
          </p>
        </div>

        {venues.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Venues Added
            </h3>
            <p className="text-gray-500">
              Add venues to start creating seating layouts
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {venues.map((venue, index) => {
              const hierarchy = venueHierarchies[venue.id] || [];
              const isOpen = openVenueId === venue.id;
              const hasErrors = venueHasErrors(venue.id);
              const venueSaveStatus = saveStatus[venue.id];

              return (
                <div
                  key={venue.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Venue Header */}
                  <button
                    className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      const next = isOpen ? null : venue.id;
                      setOpenVenueId(next);

                      if (!isOpen && !venueHierarchies[venue.id]) {
                        fetchVenueHierarchy(venue.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="flex justify-between">
                          <h2 className="font-bold text-gray-900 text-lg">
                            {venue.name}
                          </h2>
                          <div className="text-gray-600">
                            Total Capacity:{" "}
                            <span className="font-bold text-gray-900 text-lg">
                              {venue.total_capacity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600">
                            {hierarchy.length} categor
                            {hierarchy.length === 1 ? "y" : "ies"}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span
                            className={`text-sm font-medium px-2 py-1 rounded-full ${hasErrors ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}
                          >
                            {hasErrors ? "Validation issues" : "Ready to save"}
                          </span>
                          {venueSaveStatus && (
                            <span
                              className={`text-sm font-medium px-2 py-1 rounded-full ${
                                venueSaveStatus.type === "success"
                                  ? "bg-emerald-100 text-emerald-800 animate-pulse"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {venueSaveStatus.type === "success"
                                ? "✓ Saved"
                                : "✗ Failed"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {isOpen ? "Collapse" : "Expand"}
                      </span>
                      <span
                        className={`text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                    </div>
                  </button>

                  {/* Venue Body */}
                  {isOpen && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                      {/* Save Status Message */}
                      {venueSaveStatus && (
                        <div
                          className={`mb-6 p-4 rounded-xl ${
                            venueSaveStatus.type === "success"
                              ? "bg-emerald-50 border border-emerald-200"
                              : "bg-red-50 border border-red-200"
                          } animate-fade-in`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                venueSaveStatus.type === "success"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {venueSaveStatus.type === "success" ? "✓" : "✗"}
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-medium ${
                                  venueSaveStatus.type === "success"
                                    ? "text-emerald-800"
                                    : "text-red-800"
                                } mb-1`}
                              >
                                {venueSaveStatus.type === "success"
                                  ? "Success!"
                                  : "Error"}
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
                              {venueSaveStatus.type === "success" && (
                                <p className="text-xs text-emerald-600 mt-2">
                                  This panel will close automatically in a
                                  moment...
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setSaveStatus((prev) => ({
                                  ...prev,
                                  [venue.id]: null,
                                }))
                              }
                              className="text-gray-400 hover:text-gray-600"
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
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Add Root Category Section */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              Add Main Category
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Create primary seating sections (e.g., VIP,
                              General)
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            Step 1
                          </span>
                        </div>
                        <AddCategory
                          existingCategories={hierarchy.map((cat) => cat.name)}
                          onAdd={(cat) => {
                            // Check if category name is unique
                            if (!isCategoryNameUnique(venue.id, cat.name)) {
                              alert(
                                `Category name "${cat.name}" is already used in this venue. Please choose a different name.`,
                              );
                              return;
                            }

                            addRootCategory(venue.id, {
                              ...cat,
                            });
                          }}
                        />
                      </div>

                      {/* Categories List */}
                      {hierarchy.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-white/50">
                          <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                            <svg
                              className="w-full h-full"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              ></path>
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium">
                            No categories yet
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Add your first category above
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              Categories
                            </h3>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                              {hierarchy.length} total
                            </span>
                          </div>
                          {console.log("hierarchysdsd", hierarchy)}
                          {(hierarchy || []).map((cat, catIndex) => {
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
                            const remainingSeats = getRemainingSeats(cat);

                            return (
                              <div
                                key={catIndex}
                                data-error={`${venue.id}-${catIndex}`}
                                className={`bg-white rounded-xl border ${seatError || nameError ? "border-red-300 bg-red-50/30" : "border-gray-200"} p-5 shadow-sm transition-all duration-200`}
                              >
                                {/* Category Header */}
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                        <span className="text-blue-700 font-bold">
                                          C{catIndex + 1}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-semibold text-gray-900">
                                            {cat.name}
                                          </h4>
                                          {nameError && (
                                            <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-0.5 rounded-full">
                                              Duplicate
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="text-sm text-gray-600">
                                            {cat.children.length} subcategor
                                            {cat.children.length === 1
                                              ? "y"
                                              : "ies"}
                                          </span>
                                          <span className="text-gray-400">
                                            •
                                          </span>
                                          <span className="text-sm font-medium text-gray-700">
                                            {cat.seats} total seats
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Seat Status */}
                                    <div className="flex flex-wrap gap-4 mt-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span className="text-sm text-gray-700">
                                          {Math.max(availableSeats, 0)}{" "}
                                          available
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <span className="text-sm text-gray-700">
                                          {usedSeats} used
                                        </span>
                                      </div>
                                      {isOverflow && (
                                        <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                          <span className="text-sm font-medium text-red-600">
                                            {usedSeats - cat.seats} overflow
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Error Messages */}
                                    {(seatError || nameError) && (
                                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-700">
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
                                          <span className="text-sm font-medium">
                                            {seatError
                                              ? seatError.message
                                              : nameError.message}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {cat.children.length > 0 && (
                                    <button
                                      onClick={() =>
                                        toggleCategory(venue.id, catIndex)
                                      }
                                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                                    >
                                      <span className="text-sm font-medium">
                                        {expanded ? "Hide" : "Show"}{" "}
                                        Subcategories
                                      </span>
                                      <span
                                        className={`transform transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                                      >
                                        ▼
                                      </span>
                                    </button>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete category "${cat.name}"?`,
                                      )
                                    ) {
                                      deleteRootCategory(venue.id, catIndex);
                                    }
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                  Delete
                                </button>
                                {/* Add Subcategory */}
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <h5 className="font-medium text-gray-900">
                                        Add Subcategory
                                      </h5>
                                      <p className="text-sm text-gray-500 mt-1">
                                        {remainingSeats > 0
                                          ? `${remainingSeats} seats available for subcategories`
                                          : "No seats available for new subcategories"}
                                      </p>
                                    </div>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                      Step 2
                                    </span>
                                  </div>

                                  {remainingSeats <= 0 ? (
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                      <div className="flex items-center gap-3 text-amber-800">
                                        <svg
                                          className="w-5 h-5"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <div>
                                          <p className="font-medium">
                                            Category Filled
                                          </p>
                                          <p className="text-sm mt-1">
                                            All seats have been allocated to
                                            existing subcategories.
                                          </p>
                                          {/* <p className="text-sm mt-1">
                                            Increase parent seats to {cat.seats + 1} or reduce existing subcategory seats.
                                          </p> */}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <AddSubCategory
                                      parentSeats={cat.seats}
                                      usedSeats={usedSeats}
                                      maxSeats={remainingSeats}
                                      existingSubcategories={cat.children.map(
                                        (sub) => sub.name,
                                      )}
                                      onAdd={(sub) => {
                                        // Prevent adding if it would exceed parent seats
                                        if (sub.seats > remainingSeats) {
                                          alert(
                                            `Cannot add subcategory: Only ${remainingSeats} seats available`,
                                          );
                                          return;
                                        }

                                        // Check if subcategory name is unique
                                        if (
                                          !isSubcategoryNameUnique(
                                            venue.id,
                                            catIndex,
                                            sub.name,
                                          )
                                        ) {
                                          alert(
                                            `Subcategory name "${sub.name}" is already used in this category. Please choose a different name.`,
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

                                  {isOverflow && (
                                    <p className="text-sm text-red-600 mt-2 font-medium">
                                      ⚠️ Reduce subcategory seats or increase
                                      parent seats to fix overflow
                                    </p>
                                  )}
                                </div>

                                {/* Subcategories List */}
                                {expanded && cat.children.length > 0 && (
                                  <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-semibold text-gray-900">
                                          Subcategories
                                        </h5>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                          {cat.children.length} item
                                          {cat.children.length !== 1 ? "s" : ""}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                                            className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                                              isEditing
                                                ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100"
                                                : hasError
                                                  ? "border-red-300 bg-red-50/80"
                                                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                            }`}
                                          >
                                            {/* Edit Mode Overlay */}
                                            {isEditing && (
                                              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/10 rounded-xl pointer-events-none"></div>
                                            )}

                                            {/* Header Section */}
                                            <div className="flex items-center justify-between mb-3 relative z-10">
                                              <div className="flex items-center gap-2.5">
                                                {/* ID Badge */}
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shadow-sm">
                                                  <span className="text-gray-800 font-bold text-xs">
                                                    {catIndex + 1}.
                                                    {subIndex + 1}
                                                  </span>
                                                </div>

                                                {/* Name Field */}
                                                <div className="min-w-0">
                                                  {isEditing ? (
                                                    <input
                                                      value={editingSub.name}
                                                      onChange={(e) =>
                                                        setEditingSub({
                                                          ...editingSub,
                                                          name: e.target.value,
                                                        })
                                                      }
                                                      className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm w-full max-w-[140px] bg-white"
                                                      placeholder="Subcategory name"
                                                      autoFocus
                                                    />
                                                  ) : (
                                                    <div className="flex items-center gap-1.5">
                                                      <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                                                        {sub.name}
                                                      </span>
                                                      {nameError && (
                                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                          Duplicate
                                                        </span>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Delete Button */}
                                              <button
                                                onClick={() => {
                                                  if (
                                                    window.confirm(
                                                      `Delete "${sub.name}"?`,
                                                    )
                                                  ) {
                                                    deleteSubCategory(
                                                      venue.id,
                                                      catIndex,
                                                      subIndex,
                                                    );
                                                  }
                                                }}
                                                className={`p-1.5 rounded-lg transition-all ${
                                                  isEditing
                                                    ? "text-red-400 hover:text-red-600 hover:bg-red-100"
                                                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                }`}
                                                title="Delete subcategory"
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

                                            {/* Seats Section */}
                                            <div className="flex items-center justify-between mb-3 relative z-10 pl-4">
                                              <div className="flex items-center gap-3">
                                                {/* Seats Icon */}

                                                {/* Seats Input/Display */}
                                                <div>
                                                  <div className="text-xs text-gray-500 mb-1">
                                                    Total Seats
                                                  </div>
                                                  {isEditing ? (
                                                    <input
                                                      type="number"
                                                      min="1"
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
                                                      className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm w-20 bg-white"
                                                    />
                                                  ) : (
                                                    <div className="text-xl font-bold text-gray-900">
                                                      {sub.seats}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Action Buttons */}
                                              <div className="flex gap-1">
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
                                                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm hover:shadow transition-all"
                                                    >
                                                      Save
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        setEditingSub(null)
                                                      }
                                                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded-lg transition-colors"
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
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group-hover:opacity-100 opacity-70"
                                                    title="Edit"
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
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                      />
                                                    </svg>
                                                  </button>
                                                )}
                                              </div>
                                            </div>

                                            {/* Error Message */}
                                            {hasError && !isEditing && (
                                              <div className="mt-3 pt-3 border-t border-gray-100 relative z-10">
                                                <div className="flex items-start gap-2 text-xs">
                                                  <svg
                                                    className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                  <span className="text-red-600 font-medium leading-tight">
                                                    {seatError?.message ||
                                                      nameError?.message}
                                                  </span>
                                                </div>
                                              </div>
                                            )}

                                            {/* Edit Mode Tips */}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Empty State for Subcategories */}
                                    {cat.children.length === 0 && (
                                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-6 h-6 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                          </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium mb-2">
                                          No subcategories yet
                                        </p>
                                        <p className="text-gray-400 text-sm mb-4">
                                          Add subcategories to organize seats
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Save Button Section */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div
                          className={`p-4 rounded-xl ${hasErrors ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"} mb-6`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${hasErrors ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
                            >
                              {hasErrors ? "⚠️" : "✓"}
                            </div>
                            <div>
                              <h4
                                className={`font-medium ${hasErrors ? "text-red-800" : "text-emerald-800"} mb-1`}
                              >
                                {hasErrors
                                  ? "Validation Required"
                                  : "Ready to Save"}
                              </h4>
                              <p
                                className={`text-sm ${hasErrors ? "text-red-700" : "text-emerald-700"}`}
                              >
                                {hasErrors
                                  ? "Please fix the validation issues before saving. Check for duplicate names and seat allocation problems."
                                  : "All categories are properly configured. You can save the seating layout."}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              Save this venue's seating configuration
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              This will update the seating layout for{" "}
                              {venue.name}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSaveHierarchy(venue.id)}
                            disabled={isSaving || hasErrors}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                              hasErrors || isSaving
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow"
                            }`}
                          >
                            {isSaving ? (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 animate-spin"
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
                                Saving...
                              </span>
                            ) : (
                              "Save Seating Layout"
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
