import React from "react";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function AddSubCategory({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Subcategory name is required";
    }

    if (!seats || Number(seats) <= 0) {
      newErrors.seats = "Seats must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    onAdd({
      name: name.trim(),
      seats: Number(seats),
    });

    setName("");
    setSeats("");
    setErrors({});
    setOpen(false);
  };

  return (
    <div className="ml-6 mt-3 border rounded-lg bg-gray-50">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2
                   text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <span>Add Subcategory</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Accordion Body */}
      {open && (
        <div className="px-4 pb-4 pt-2 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="space-y-3"
          >
            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Subcategory name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm
                  focus:outline-none focus:ring-2
                  ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-emerald-500"
                  }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Seats */}
            <div>
              <input
                type="number"
                min={1}
                placeholder="Seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm
                  focus:outline-none focus:ring-2
                  ${
                    errors.seats
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-emerald-500"
                  }`}
              />
              {errors.seats && (
                <p className="text-xs text-red-500 mt-1">{errors.seats}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 text-sm font-medium text-white
                           bg-emerald-500 rounded-md hover:bg-emerald-600"
              >
                Add Subcategory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddSubCategory;