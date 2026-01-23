import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function AddCategory({ onAdd, parentSeats }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Category name is required";
    if (!seats || Number(seats) <= 0)
      newErrors.seats = "Seats must be greater than 0";

    // Optional: if parentSeats is provided, enforce max
    if (parentSeats && Number(seats) > parentSeats)
      newErrors.seats = `Cannot exceed parent category seats (${parentSeats})`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    // Return a tree node structure ready for backend
    onAdd({
      name: name.trim(),
      seats: Number(seats),
      children: [], // initially empty
    });

    setName("");
    setSeats("");
    setErrors({});
    setOpen(false);
  };

  const handleCancel = () => {
    setName("");
    setSeats("");
    setErrors({});
    setOpen(false);
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm mt-4">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3
                   text-left font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>Add Seating Category</span>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="px-4 pb-4 pt-2 space-y-3">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

          <input
            type="number"
            min={1}
            placeholder="Total seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              errors.seats
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-500"
            }`}
          />
          {errors.seats && <p className="text-xs text-red-500">{errors.seats}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
