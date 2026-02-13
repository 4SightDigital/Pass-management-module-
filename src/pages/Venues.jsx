import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import useVenueStore from "../store/useVenueStore";
import AddCategory from "../components/AddCategory";
import AddSubCategory from "../components/AddSubCategory";
import { convertFileToBase64, getVenueImage } from "../utils/fileUtils";
import SearchBar from "../components/search/SearchBar";

function Venues() {
  const {
    venues,
    addVenue,
    deleteVenue,
    updateVenue,
    fetchVenues,
    loading,
    error,
  } = useVenueStore();
  // console.log("i am venues", venues);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [venueType, setVenueType] = useState("");
  const [totalSeats, setTotalSeats] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editError, setEditError] = useState("");

  const [venueImg, setVenueImg] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState(venues);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef(null);
  const [editVenueImg, setEditVenueImg] = useState(null);

  // const filteredVenues = venues.filter()

  const handleAddVenue = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("venue_type", venueType);
      formData.append("total_capacity", totalSeats);

      if (venueImg) {
        formData.append("image", venueImg);
      }

      await addVenue(formData);

      resetForm();
      alert("Venue added successfully");
    } catch (error) {
      console.log("error", error?.response?.data || error);
      alert("Failed to add venue");
    }
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const base64 = await convertFileToBase64(file);
  //   setVenueImg(base64);
  //   console.log("imgggg", base64);
  // };

  const startEdit = (venue) => {
    setEditingId(venue.id);
    setEditData({
      name: venue.name,
      location: venue.location,
      venue_type: venue.venue_type,
      total_capacity: venue.total_capacity,
    });
  };

  const saveEdit = async (id) => {
    if (!editData.name?.trim()) {
      setEditError("Venue name is required");
      return;
    }

    if (!editData.location?.trim()) {
      setEditError("Location is required");
      return;
    }

    if (!editData.venue_type?.trim()) {
      setEditError("Venue Type is required");
      return;
    }

    if (
      editData.total_capacity === null ||
      editData.total_capacity === undefined ||
      editData.total_capacity <= 0
    ) {
      setEditError("Total capacity must be greater than 0");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("location", editData.location);
      formData.append("venue_type", editData.venue_type);
      formData.append("total_capacity", editData.total_capacity);
      if (editVenueImg) formData.append("image", editVenueImg);

      await updateVenue(id, formData); // Make sure your backend accepts multipart/form-data for update
      setEditingId(null);
      setEditData({});
      setEditVenueImg(null);
      setEditError("");
    } catch (err) {
      console.error(err);
      setEditError("Failed to update venue");
    }
    // updateVenue(id, editData);
    // setEditingId(null);
    // console.log(editData);
    // setEditData({});
    // setEditError("");
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setTotalSeats("");
    setVenueType("");
    setVenueImg(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // useEffect(() => {
  //   fetchVenues();
  //   console.log("fetched venues");
  // }, [fetchVenues]);

  return (
    <div className="min-h-fit bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Venue Management
        </h1>
        {/* <p className="text-gray-600">Add, edit, and manage your venues below</p> */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            {/* Form Header */}
            <div className="mb-6">
              <div className="text-white text-center w-full px-4 py-3 rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 mb-4">
                <h2 className="text-lg font-semibold">Add New Venue</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Fill in the details to create a new venue
              </p>
            </div>

            <form onSubmit={handleAddVenue} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter venue name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                  />
                  <div className="absolute right-3 top-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter venue location"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                  />
                  <div className="absolute right-3 top-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                  </div>
                </div>
              </div>

              {/* Total Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Seats *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={totalSeats}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // allow only digits
                        setTotalSeats(value);
                      }
                    }}
                    // type="number"
                    // value={totalSeats}
                    required
                    // onChange={(e) => setTotalSeats(e.target.value)}
                    placeholder="Enter total capacity"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <div className="absolute right-3 top-3.5">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                </div>
              </div>

              {/* Venue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Type *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={venueType}
                    required
                    onChange={(e) => setVenueType(e.target.value)}
                    placeholder="e.g., Conference Hall"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald500 outline-none transition-all duration-300 hover:border-gray-400"
                  />
                  <div className="absolute right-3 top-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                </div>
              </div>

              {/* image Upload */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Venue Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    className="text-gray-400 w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 cursor-pointer bg-white file:mr-4 file:py-0 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setVenueImg(file); // store File object
                      }
                    }}
                  />

                  <div className="absolute right-4 top-3.5 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Optional: File name display */}
                {venueImg && (
                  <p className="mt-1 text-xs text-emerald-600 truncate">
                    {venueImg.name}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-md hover:shadow-lg"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
                >
                  Add Venue
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Table Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Saved Venues
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {venues.length} venue{venues.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <SearchBar
                    data={venues}
                    searchKeys={["name", "location"]}
                    // placeholder="deep search"
                    onSearch={(results) => setFilteredVenues(results)}
                  />
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Venue Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Venue Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVenues.map((venue, index) => (
                    <tr
                      key={venue.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {index + 1}
                      </td>

                      {editingId === venue.id ? (
                        // Edit Mode
                        <>
                          {/* Name field */}
                          <td className="px-4 py-3">
                            <input
                              className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                              value={editData.name || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Venue name"
                            />
                          </td>

                          {/* Location field */}
                          <td className="px-4 py-3">
                            <input
                              className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                              value={editData.location || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  location: e.target.value,
                                })
                              }
                              placeholder="Location"
                            />
                          </td>

                          {/* Venue type field */}
                          <td className="px-4 py-3">
                            <input
                              className="w-36 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                              value={editData.venue_type || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  venue_type: e.target.value,
                                })
                              }
                              placeholder="Venue type"
                            />
                          </td>

                          {/* Image upload field */}
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <label className="relative cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) setEditVenueImg(file);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                  <svg
                                    className="w-4 h-4 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-600">
                                    Choose image
                                  </span>
                                </div>
                              </label>
                              {editVenueImg && (
                                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                                  {editVenueImg.name}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Capacity field */}
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                              value={editData.total_capacity || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  total_capacity: e.target.value,
                                })
                              }
                              placeholder="Capacity"
                              min="0"
                            />
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveEdit(venue.id)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-md"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Save
                              </button>

                              <button
                                onClick={() => setEditingId(null)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-medium rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 hover:shadow-md"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg
                                  className="w-4 h-4 text-emerald-600"
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
                              <span className="font-medium text-gray-900">
                                {venue.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {venue.location}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {venue.venue_type || "Not specified"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {venue.image ? (
                              <img
                                src={getVenueImage(venue.image)} // Make sure backend returns full URL or use a static path
                                alt={venue.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">
                                No image
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="text-lg font-semibold text-gray-900">
                                {venue.total_capacity}
                              </span>
                              <span className="ml-1 text-sm text-gray-500">
                                seats
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => startEdit(venue)}
                                className="group p-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 hover:shadow-md"
                                title="Edit venue"
                              >
                                <svg
                                  className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this venue?",
                                    )
                                  ) {
                                    deleteVenue(venue.id);
                                  }
                                }}
                                className="group p-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 hover:shadow-md"
                                title="Delete venue"
                              >
                                <svg
                                  className="w-5 h-5 group-hover:scale-110 transition-transform"
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
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {venues.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="text-gray-500">No venues added yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add your first venue using the form
                  </p>
                </div>
              )}
            </div>

            {editError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{editError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Venues;
