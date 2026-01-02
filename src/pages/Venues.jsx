import axios from "axios";
import React, { useEffect, useState } from "react";
import useVenueStore from "../store/useVenueStore";
import AddCategory from "../components/AddCategory";
import AddSubCategory from "../components/AddSubCategory";

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

  const handleAddVenue = async (e) => {
    e.preventDefault();

    try {
      await addVenue({
        name,
        location,
        venue_type: venueType,
        total_capacity: Number(totalSeats),
      });

      resetForm();
      alert("Venue added successfully");
    } catch (error) {
      console.log("error", error?.response?.data || error);
      alert("Failed to add venue");
    }
  };

  const startEdit = (venue) => {
    setEditingId(venue.id);
    setEditData({
      name: venue.name,
      location: venue.location,
      venue_type: venue.venue_type,
      total_capacity: venue.total_capacity,
    });
  };

  const saveEdit = (id) => {
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

     if (!editData.total_capacity?.trim()) {
      setEditError("Total Seats is required");
      return;
    }

    updateVenue(id, editData);
    setEditingId(null);
    console.log(editData);
    setEditData({});
    setEditError("");
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setTotalSeats("");
    setVenueType("");
  };
  useEffect(()=>{
    fetchVenues()
    console.log("fetched venues")
  },[fetchVenues])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Venue Management</h1>
        <p className="text-gray-600">
          Add, edit, and manage your venues below
        </p>
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
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
                    type="number"
                    value={totalSeats}
                    required
                    onChange={(e) => setTotalSeats(e.target.value)}
                    placeholder="Enter total capacity"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                  />
                  <div className="absolute right-3 top-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6A8.5 8.5 0 0012 3.5 8.5 8.5 0 003.5 12v6.5h17V12z" />
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
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
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
                  <h2 className="text-xl font-bold text-gray-800">Saved Venues</h2>
                  <p className="text-gray-600 mt-1">
                    {venues.length} venue{venues.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search venues..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
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
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {venues.map((venue, index) => (
                    <tr key={venue.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {index + 1}
                      </td>

                      {editingId === venue.id ? (
                        // Edit Mode
                        <>
                          <td className="px-6 py-4">
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              value={editData.name || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              value={editData.location || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, location: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              value={editData.venue_type || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, venue_type: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              value={editData.total_capacity || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, total_capacity: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => saveEdit(venue.id)}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                              >
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
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-900">{venue.name}</span>
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
                            <div className="flex items-center">
                              <span className="text-lg font-semibold text-gray-900">{venue.total_capacity}</span>
                              <span className="ml-1 text-sm text-gray-500">seats</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => startEdit(venue)}
                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteVenue(venue.id)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                              >
                                Delete
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
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-gray-500">No venues added yet</p>
                  <p className="text-gray-400 text-sm mt-1">Add your first venue using the form</p>
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