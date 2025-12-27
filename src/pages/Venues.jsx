import axios from "axios";
import React, { useState } from "react";
import useVenueStore from "../store/useVenueStore";

function Venues() {
  const { venues, addVenue, deleteVenue, updateVenue } = useVenueStore();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [venueType, setVenueType] = useState("");
  const [totalSeats, setTotalSeats] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editError, setEditError] = useState("");
  const handleAddVenue = async (e) => {
    e.preventDefault();
    addVenue({
      name,
      location,
      venueType,
      totalSeats: Number(totalSeats),
    });
    resetForm();
    alert("Venue added");

    try {
      // chamnge the below api with the backend
      // await axios.post("http://localhost:8000/venues", newVenue)
    } catch (error) {
      console.error(error);
      alert("failed to add venue");
    }
  };

  const startEdit = (venue) => {
    setEditingId(venue.id);
    setEditData({
      name: venue.name,
      location: venue.location,
      venueType: venue.venueType,
      totalSeats: venue.totalSeats,
    });
  };
  const saveEdit = (id) => {
    if (!editData.name?.trim()) {
      setEditError("Venue name is required");
      return; // ⛔ stop saving
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

  return (
    <>
      <div>
        <h2 className="text-xl font-bold text-black mb-2 ml-6">
          Add New Venue
        </h2>
        <p className="text-gray-1000 mb-6 ml-6">
          Fill the form below to add a new venue
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/*
      left side card begins here 
      */}

        <div
          className="
    bg-white
    w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4
    mx-auto lg:ml-6 lg:mr-0
    rounded-xl
    p-6
    mt-6
    shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]
  "
        >
          {/* Header */}
          <div
            className="
      text-white
      text-center
      w-full
      px-4 py-3
      rounded-lg
      shadow-[0_4px_4px_#8EB4F3]
      bg-gradient-to-r from-[#C8FECC] to-[#799EBE]
      mb-4
    "
          >
            Add New Venue
          </div>

          <form onSubmit={handleAddVenue} className="space-y-3">
            {/* Name */}
            <div>
              <label
                htmlFor="nameOfVenue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name Of Venue
              </label>
              <input
                id="nameOfVenue"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add a new venue"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="locationVenue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location Of Venue
              </label>
              <input
                id="locationVenue"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add a location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Total Seats */}
            <div>
              <label
                htmlFor="totalSeats"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Seats Of Venue
              </label>
              <input
                id="totalSeats"
                type="number"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="Add total seats"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Venue Type */}
            <div>
              <label
                htmlFor="typeVenue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type Of Venue
              </label>
              <input
                id="typeVenue"
                type="text"
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                placeholder="Type of venue"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <button
                type="button"
                onClick={resetForm}
                className="
          w-full sm:w-[48%]
          bg-red-500/80 hover:bg-red-500
          text-white font-medium
          py-3 px-4 rounded-xl
          shadow-[0_3px_6px_rgba(0,0,0,0.18)]
          hover:shadow-[0_6px_12px_rgba(0,0,0,0.22)]
          transition-all duration-300
          transform hover:-translate-y-0.5
        "
              >
                Clear
              </button>

              <button
                type="submit"
                className="
          w-full sm:w-[48%]
          bg-emerald-500/80 hover:bg-emerald-600
          text-white font-medium
          py-3 px-4 rounded-xl
          shadow-[0_3px_6px_rgba(0,0,0,0.18)]
          hover:shadow-[0_6px_12px_rgba(0,0,0,0.22)]
          transition-all duration-300
          transform hover:-translate-y-0.5
        "
              >
                Add Venue
              </button>
            </div>
          </form>
        </div>

        {/*
      left side card ends here 
      */}

        {/*
      right side section begins from below
      */}

        <div className="mt-6 lg:mt-0 lg:ml-8 mr-8 flex-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Saved Venues
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Sr No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    Seats
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {venues.map((v, index) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    {editingId === v.id ? (
                      <>
                        {/* Editable Row */}
                        <td className="px-4 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-md"
                            value={editData.name || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-md"
                            value={editData.location || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                location: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            className="w-full px-2 py-1 border rounded-md"
                            value={editData.venueType ?? ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                venueType: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded-md"
                            value={editData.totalSeats ?? ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                totalSeats: e.target.value,
                              })
                            }
                          />
                        </td>

                        <td className="px-4 py-2 text-center space-x-2">
                          <button
                            onClick={() => saveEdit(v.id)}
                            className="px-3 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Normal Row */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {v.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {v.location}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {v.venueType}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {v.totalSeats}
                        </td>
                        <td className="px-4 py-3 text-center space-x-2">
                          <button
                            onClick={() => startEdit(v)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteVenue(v.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editError && (
            <p className="text-red-500 text-sm mt-2">{editError}</p>
          )}
        </div>
      </div>
      {/*
      right side section ends here
      */}
    </>
  );
}

export default Venues;
