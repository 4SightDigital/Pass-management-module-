import React from "react";
import { useState, useEffect } from "react";
import useVenueStore from "../store/useVenueStore";
import CategoryCard from "../components/CategoryCard";

function BookTickets() {
  const events = useVenueStore((state) => state.events);
  const venues = useVenueStore((state) => state.venues);
  const addBooking = useVenueStore((state) => state.addBooking);
  const updateEventSeats = useVenueStore((state) => state.updateEventSeats);

  // Form state
  const [selectedEvent, setSelectedEvent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [refName, setRefName] = useState("");
  const [refAge, setRefAge] = useState("");
  const [refGender, setRefGender] = useState("");
  const [refContact, setRefContact] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [errors, setErrors] = useState({});

  // Get selected event and venue data
  const event = events.find((e) => e.id === selectedEvent);
  const venue = event ? venues.find((v) => v.id === event.venueId) : null;
  const selectedCategory = venue?.hierarchy?.find((c) => c.id === categoryId);
  const selectedSubCategory = selectedCategory?.subCategories?.find(
    (sc) => sc.id === subCategoryId
  );

  const departments = {
    Security: ["Internal", "External"],
    Protocol: ["State", "Central"],
    Management: ["Board", "Executive"],
  };

  // Calculate available seats and price
  const availableSeats = selectedSubCategory
    ? selectedSubCategory.capacity - (selectedSubCategory.booked || 0)
    : 0;
  const totalPrice = selectedSubCategory
    ? seatsRequested * selectedSubCategory.price
    : 0;

  // Reset form when event changes
  useEffect(() => {
    setCategoryId("");
    setSubCategoryId("");
    setSeatsRequested(1);
  }, [selectedEvent]);

  // Reset subCategory when category changes
  useEffect(() => {
    setSubCategoryId("");
    setSeatsRequested(1);
  }, [categoryId]);

  // Reset subDepartment when department changes
  useEffect(() => {
    setSubDepartment("");
  }, [department]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!selectedEvent) newErrors.selectedEvent = "Event is required";
    if (!guestName.trim()) newErrors.guestName = "Guest name is required";
    if (!categoryId) newErrors.categoryId = "Category is required";
    if (!subCategoryId) newErrors.subCategoryId = "Sub-category is required";
    if (seatsRequested < 1)
      newErrors.seatsRequested = "At least 1 seat required";
    if (seatsRequested > availableSeats)
      newErrors.seatsRequested = `Only ${availableSeats} seats available`;
    if (!department) newErrors.department = "Department is required";
    if (!subDepartment) newErrors.subDepartment = "Sub-department is required";
    if (!refName.trim()) newErrors.refName = "Reference name is required";
    if (!refContact.trim()) newErrors.refContact = "Contact number is required";
    if (!refGender) newErrors.refGender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedSubCategory) {
      setBookingStatus("error: Invalid seat selection");
      return;
    }

    if (seatsRequested > availableSeats) {
      setBookingStatus(`error: Only ${availableSeats} seats available`);
      return;
    }

    try {
      // Create booking object
      const booking = {
        id: Date.now().toString(),
        eventId: selectedEvent,
        eventName: event?.name,
        venueId: venue?.id,
        venueName: venue?.name,
        guestName,
        seats: seatsRequested,
        category: selectedCategory.categoryName,
        subCategory: selectedSubCategory.subCategoryName,
        department,
        subDepartment,
        reference: {
          name: refName,
          age: refAge,
          gender: refGender,
          contact: refContact,
        },
        totalPrice,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
      };

      // Update store
      addBooking(booking);

      // Update seat count
      updateEventSeats(
        selectedEvent,
        categoryId,
        subCategoryId,
        seatsRequested
      );

      // Success message
      setBookingStatus("success: Tickets booked successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setBookingStatus(""), 3000);
    } catch (error) {
      setBookingStatus(`error: ${error.message}`);
    }
  };

  const handleClear = () => {
    setSelectedEvent("");
    setGuestName("");
    setSeatsRequested(1);
    setCategoryId("");
    setSubCategoryId("");
    setDepartment("");
    setSubDepartment("");
    setRefName("");
    setRefAge("");
    setRefGender("");
    setRefContact("");
    setErrors({});
    setBookingStatus("");
  };

  const categoriesData = [
    {
      id: 1,
      name: "VIP",
      totalSeats: 6500,
      availableSeats: 5300,
      bookedSeats: 1200,
      tableHeaders: {
        subCategory: "Sub Category",
        available: "Available",
        booked: "Booked",
        total: "Total",
      },
      subCategories: [
        { name: "BLOCK A", available: 100, booked: 50 },
        { name: "BLOCK drg", available: 100, booked: 50 },
        { name: "Premium A", available: 100, booked: 50 },
        { name: "BLOCK gfhfgh", available: 100, booked: 50 },
        { name: "BLOCK fghfgh", available: 100, booked: 50 },
        { name: "cat A", available: 100, booked: 50 },
        { name: "BLOCKsdcvsd A", available: 100, booked: 50 },
        { name: "Executive", available: 80, booked: 70 },
        { name: "Diamond", available: 120, booked: 30 },
      ],
    },
    {
      id: 2,
      name: "Premium",
      totalSeats: 4000,
      availableSeats: 3200,
      bookedSeats: 800,
      
      subCategories: [
        { name: "Section A", available: 200, booked: 100 },
        { name: "Section B", available: 180, booked: 120 },
        { name: "Section C", available: 150, booked: 150 },
        { name: "Front Row", available: 80, booked: 70 },
        { name: "Middle Row", available: 120, booked: 80 },
        { name: "Back Row", available: 100, booked: 60 },
      ],
    },
    {
      id: 3,
      name: "Economy",
      totalSeats: 8000,
      availableSeats: 5500,
      bookedSeats: 2500,
      
      subCategories: [
        { name: "North Stand", available: 500, booked: 500 },
        { name: "South Stand", available: 400, booked: 600 },
        { name: "East Stand", available: 350, booked: 650 },
        { name: "West Stand", available: 300, booked: 700 },
        { name: "General", available: 450, booked: 550 },
      ],
    },
    {
      id: 4,
      name: "Student",
      totalSeats: 2000,
      availableSeats: 1400,
      bookedSeats: 600,
      subCategories: [
        { name: "Block S1", available: 150, booked: 50 },
        { name: "Block S2", available: 120, booked: 80 },
        { name: "Block S3", available: 100, booked: 100 },
        { name: "Block S4", available: 80, booked: 120 },
        { name: "Block S5", available: 60, booked: 140 },
      ],
    },
    {
      id: 5,
      name: "Corporate",
      totalSeats: 1500,
      availableSeats: 1000,
      bookedSeats: 500,
      subCategories: [
        { name: "Executive Suite", available: 100, booked: 50 },
        { name: "Premium Box", available: 80, booked: 70 },
        { name: "Business Class", available: 120, booked: 30 },
        { name: "Gold Lounge", available: 60, booked: 90 },
        { name: "Silver Section", available: 90, booked: 60 },
      ],
    },
    {
      id: 6,
      name: "Family",
      totalSeats: 1000,
      availableSeats: 700,
      bookedSeats: 300,
      subCategories: [
        { name: "Family Zone A", available: 80, booked: 40 },
        { name: "Family Zone B", available: 70, booked: 50 },
        { name: "Kids Section", available: 90, booked: 30 },
        { name: "Parent-Child", available: 60, booked: 60 },
        { name: "Group Seating", available: 50, booked: 70 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">
            Create your bookings for Created Events
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Form (1 column on left) */}

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Form Header */}
              <div className="mb-6">
                <div className="text-white text-center w-full px-4 py-3 rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 mb-4">
                  <h2 className="text-lg font-semibold">
                    Book Complimentary Pass
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">
                  Fill in the details to book Complimentary Passes
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Guest Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guest Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter guest full name"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 ${
                        errors.guestName ? "border-red-300" : "border-gray-300"
                      }`}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.guestName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.guestName}
                    </p>
                  )}
                </div>
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department of Guest*
                  </label>
                  <div className="relative">
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none ${
                        errors.department ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select department</option>
                      {Object.keys(departments).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-3 pointer-events-none">
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
                  {errors.department && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Sub-Department */}
                {department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Department of Guest *
                    </label>
                    <div className="relative">
                      <select
                        value={subDepartment}
                        onChange={(e) => setSubDepartment(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none ${
                          errors.subDepartment
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select sub-department</option>
                        {departments[department].map((subDept) => (
                          <option key={subDept} value={subDept}>
                            {subDept}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-3 pointer-events-none">
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.subDepartment && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.subDepartment}
                      </p>
                    )}
                  </div>
                )}

                {/* Event Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Event *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none ${
                        errors.selectedEvent
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Choose an event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-3 pointer-events-none">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.selectedEvent && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.selectedEvent}
                    </p>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Category *
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={!selectedEvent}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none ${
                        errors.categoryId ? "border-red-300" : "border-gray-300"
                      } ${
                        !selectedEvent ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">Select seat category</option>
                      {venue?.hierarchy?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-3 pointer-events-none">
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
                  {errors.categoryId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                {/* Sub-Category Selection */}
                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seating Sub-Category *
                    </label>
                    <div className="relative">
                      <select
                        value={subCategoryId}
                        onChange={(e) => setSubCategoryId(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none ${
                          errors.subCategoryId
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Sub-category of seats</option>
                        {selectedCategory.subCategories?.map((subCat) => (
                          <option key={subCat.id} value={subCat.id}>
                            {subCat.subCategoryName} (${subCat.price})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-3 pointer-events-none">
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.subCategoryId && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.subCategoryId}
                      </p>
                    )}
                  </div>
                )}

                {/* Number of Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={availableSeats}
                      value={seatsRequested}
                      onChange={(e) =>
                        setSeatsRequested(parseInt(e.target.value) || 1)
                      }
                      disabled={!subCategoryId}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                        errors.seatsRequested
                          ? "border-red-300"
                          : "border-gray-300"
                      } ${
                        !subCategoryId ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
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
                  {selectedSubCategory && (
                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                      <p>Available: {availableSeats} seats</p>
                      <p>
                        Price per seat:{" "}
                        <span className="font-semibold">
                          ${selectedSubCategory.price}
                        </span>
                      </p>
                    </div>
                  )}
                  {errors.seatsRequested && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.seatsRequested}
                    </p>
                  )}
                </div>

                {/* Reference Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Person Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={refName}
                      onChange={(e) => setRefName(e.target.value)}
                      placeholder="Enter reference person name"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 ${
                        errors.refName ? "border-red-300" : "border-gray-300"
                      }`}
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.refName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.refName}
                    </p>
                  )}
                </div>

                {/* Reference Age & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age*
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={refAge}
                        onChange={(e) => setRefAge(e.target.value)}
                        placeholder="Age"
                        min="1"
                        max="120"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <div className="absolute right-3 top-3.5">
                        <svg
                          className="w-4 h-4 text-gray-400"
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
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender*
                    </label>
                    <div className="relative">
                      <select
                        value={refGender}
                        onChange={(e) => setRefGender(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none ${
                          errors.refGender
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-4 top-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.refGender && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.refGender}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={refContact}
                      onChange={(e) => setRefContact(e.target.value)}
                      placeholder="Enter contact number"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 ${
                        errors.refContact ? "border-red-300" : "border-gray-300"
                      }`}
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.refContact && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.refContact}
                    </p>
                  )}
                </div>

                {/* Status Message */}
                {bookingStatus && (
                  <div
                    className={`p-3 rounded-lg border ${
                      bookingStatus.startsWith("success")
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        className={`w-4 h-4 mr-2 ${
                          bookingStatus.startsWith("success")
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {bookingStatus.startsWith("success") ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                      <span className="text-sm font-medium">
                        {bookingStatus.replace(/^(success|error):\s*/, "")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-md hover:shadow-lg"
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
                  >
                    Book Tickets
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Information (2 columns on right) */}

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="text-white text-center w-full px-4 py-2 rounded-lg shadow bg-gradient-to-r from-emerald-500 to-blue-500 mb-3">
                  <h2 className="text-base font-semibold">Seat Availability</h2>
                </div>
                <p className="text-gray-600 text-xs">
                  Real-time seat booking status by category
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesData.map((category) => (
                  <CategoryCard
                    key={category.id}
                    categoryName={category.name}
                    totalSeats={category.totalSeats}
                    availableSeats={category.availableSeats}
                    bookedSeats={category.bookedSeats}
                    subCategories={category.subCategories}
                    // tableHeaders={category.tableHeaders}
                  />
                ))}
              </div>

              {/* Summary Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      22,000
                    </div>
                    <div className="text-xs text-gray-600">Total Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      16,100
                    </div>
                    <div className="text-xs text-gray-600">Available Seats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">5,900</div>
                    <div className="text-xs text-gray-600">Booked Seats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      26.8%
                    </div>
                    <div className="text-xs text-gray-600">
                      Overall Occupancy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookTickets;
