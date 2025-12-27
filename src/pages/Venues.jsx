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
      <div>Add New Venue</div>
      <div>Fill Below Form to add a new Venue</div>

      <div>
        <form action="" onSubmit={handleAddVenue}>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Add a new venue"
              required={true}
            />
          </div>

          <div>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              placeholder="Add a Location"
            />
          </div>

          <div>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => {
                setTotalSeats(e.target.value);
              }}
              placeholder="Add totalSeats"
            />
          </div>

          <div>
            <input
              type="text"
              value={venueType}
              onChange={(e) => {
                setVenueType(e.target.value);
              }}
              placeholder="Type of venue"
            />
          </div>

          <button type="submit">Click to create Event</button>
        </form>
      </div>

      <div>
        <h2 className="text-red-300">Saved Venues</h2>

        <ul>
          {venues.map((v, index) => {
            return (
              <li key={v.id}>
                {editingId === v.id ? (
                  <>
                    {editError && (
                      <p style={{ color: "red", fontSize: "14px" }}>
                        {editError}
                      </p>
                    )}
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />

                    <input
                    type="text"
                      value={editData.location || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, location: e.target.value })
                      }
                    />

                    <input
                    type="text"
                      value={editData.venueType ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, venueType: e.target.value })
                      }
                    />

                    <input
                      type="number"
                      value={editData.totalSeats ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, totalSeats: e.target.value })
                      }
                    />

                    <button onClick={() => saveEdit(v.id)}>💾 Save</button>
                    <button onClick={() => setEditingId(null)}>
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{v.name}</strong> — {v.location} — {v.venueType} -
                    {v.totalSeats}
                    <button onClick={() => startEdit(v)}>✏️ Edit</button>
                    <button onClick={() => deleteVenue(v.id)}>🗑 Delete</button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Venues;
