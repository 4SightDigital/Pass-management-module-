import React from "react";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function AddSubCategory({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState("");
  const [errors, setErrors] = useState({});
  const [price, setPrice] = useState("");
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Subcategory name is required";
    }

    if (!seats || Number(seats) <= 0) {
      newErrors.seats = "Seats must be greater than 0";
    }
    if (!price || Number(price) < 0) {
      newErrors.price = "Price must be 0 or greater";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;

    onAdd({
      name: name.trim(),
      seats: Number(seats),
      price: Number(price),
    });

    setName("");
    setSeats("");
    setErrors({});
    setOpen(false);
    setPrice("");
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
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                Subcategory Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Subcategory Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${
            errors.name
              ? "border-red-300 focus:ring-red-400 bg-red-50"
              : "border-gray-200 focus:ring-emerald-400 hover:border-gray-300"
          }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Seats */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Seats"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${
            errors.seats
              ? "border-red-300 focus:ring-red-400 bg-red-50"
              : "border-gray-200 focus:ring-emerald-400 hover:border-gray-300"
          }`}
                  />
                  {errors.seats && (
                    <p className="text-xs text-red-500 mt-1">{errors.seats}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-400 text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${
              errors.price
                ? "border-red-300 focus:ring-red-400 bg-red-50"
                : "border-gray-200 focus:ring-emerald-400 hover:border-gray-300"
            }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>
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
