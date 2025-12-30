import React, { useState } from "react";
import { Link } from "react-router-dom";
import useVenueStore from "../store/useVenueStore";

const Events = () => {
  const venues = useVenueStore((state) => state.venues);
  const events = useVenueStore((state) => state.events);
  const addEvent = useVenueStore((state) => state.addEvent);

  const [eventName, setEventName] = useState("");
  const [venueIndex, setVenueIndex] = useState("");
  const [eventStatus, setEventStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const resetEventData = () => {
    setEventName("");
    setVenueIndex("");
    setEventStatus("");
    setStartTime("");
    setEndTime("");
  };

  const handleAddEvent = (e) => {
    e.preventDefault();

    if (startTime < today) {
      alert("Start date cannot be in the past");
      return;
    }

    if (endTime < startTime) {
      alert("End date cannot be before start date");
      return;
    }

    const selectedVenue = venues[venueIndex];

    addEvent({
      id: crypto.randomUUID(),
      name: eventName,
      venueName: selectedVenue.name,
      status: eventStatus,
      startTime,
      endTime,
    });

    resetEventData();
  };

  return (
    <>
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-black mb-2 ml-6">
          Add New Event
        </h2>
        <p className="text-gray-700 mb-6 ml-6">
          Fill the form below to add a new event
        </p>
      </div>

      {/* NO VENUES STATE */}
      {venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No venues added
          </h2>

          <p className="text-gray-600 mb-6">
            Please add a venue before creating an event
          </p>

          <Link
            to="/venues"
            className="
              px-6 py-3 rounded-xl
              text-white font-medium
              bg-gradient-to-r from-[#C8FECC] to-[#799EBE]
              shadow-[0_4px_8px_rgba(0,0,0,0.2)]
              hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)]
              transition-all duration-300
            "
          >
            ➕ Add Venue
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT CARD — ADD EVENT */}
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
            {/* Card Header */}
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
              Add New Event
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  placeholder="Enter name of Event"
                  onChange={(e) => setEventName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                  shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Venue
                </label>
                <select
                  value={venueIndex}
                  onChange={(e) => setVenueIndex(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                  shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]"
                >
                  <option value="">Select venue</option>
                  {venues.map((v, index) => (
                    <option key={v.id} value={index}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Status
                </label>
                <input
                  type="text"
                  value={eventStatus}
                  onChange={(e) => setEventStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                  shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startTime}
                  min={today}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                  shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endTime}
                  min={startTime || today}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                  shadow-[0_4px_8px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
                <button
                  type="button"
                  onClick={resetEventData}
                  className="
                    w-full sm:w-[48%]
                    bg-red-500/80 hover:bg-red-500
                    text-white font-medium
                    py-3 px-4 rounded-xl
                    shadow-[0_3px_6px_rgba(0,0,0,0.18)]
                    hover:shadow-[0_6px_12px_rgba(0,0,0,0.22)]
                    transition-all duration-300
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
                  "
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT TABLE — EVENTS */}
          <div className="mt-6 lg:mt-0 lg:ml-8 mx-auto w-full flex-1 px-4 lg:px-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center lg:text-left">
              Saved Events
            </h2>

            <div className="mx-auto max-w-5xl overflow-x-auto bg-white rounded-md shadow-[0_4px_8px_rgba(0,0,0,0.12)]">
              <table className="min-w-full border-collapse table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-16 px-2 py-3 text-left text-sm font-medium text-gray-600">
                      Sr No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Venue
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Start
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      End
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {events.map((e, index) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition">
                      <td className="px-2 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{e.name}</td>
                      <td className="px-4 py-3 text-sm">{e.venueName}</td>
                      <td className="px-4 py-3 text-sm">{e.status}</td>
                      <td className="px-4 py-3 text-sm">{e.startTime}</td>
                      <td className="px-4 py-3 text-sm">{e.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
