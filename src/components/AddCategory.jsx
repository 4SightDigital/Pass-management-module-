import React from "react";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function AddCategory({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!totalSeats || Number(totalSeats) <= 0) {
      newErrors.totalSeats = "Seats must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    onAdd(name.trim(), Number(totalSeats));

    setName("");
    setTotalSeats("");
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
        <div className="px-4 pb-4 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="space-y-3"
          >
            {/* Category Name */}
            <div>
              <input
                type="text"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm
                  focus:outline-none focus:ring-2
                  ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-blue-500"
                  }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Total Seats */}
            <div>
              <input
                type="number"
                min={1}
                placeholder="Total seats"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md text-sm
                  focus:outline-none focus:ring-2
                  ${
                    errors.totalSeats
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-blue-500"
                  }`}
              />
              {errors.totalSeats && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.totalSeats}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white
                           bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddCategory;