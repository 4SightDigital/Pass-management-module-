import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useVenueStore from "../store/useVenueStore";
import { useNavigate } from "react-router-dom";
import { toIso } from "../utils/fileUtils";
import SearchBar from "../components/search/SearchBar";

const Events = () => {
  const venues = useVenueStore((state) => state.venues);
  const events = useVenueStore((state) => state.events);
  const addEvent = useVenueStore((state) => state.addEvent);
  const fetchEvents = useVenueStore((state) => state.fetchEvents);
  const [eventName, setEventName] = useState("");
  const [venueIndex, setVenueIndex] = useState("");
  // const [eventStatus, setEventStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);

  const today = new Date().toISOString().split("T")[0];

  const resetEventData = () => {
    setEventName("");
    setVenueIndex("");
    // setEventStatus("");
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
    const backendFormatStarttime = toIso(startTime);
    const backendFormatEndtime = toIso(endTime);
    console.log("backendFormatStarttime", backendFormatStarttime);
    addEvent({
      name: eventName,
      venue: selectedVenue.id,
      // status: eventStatus,
      start_datetime: backendFormatStarttime,
      end_datetime: backendFormatEndtime,
    });

    resetEventData();
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Event Management
            </h1>
            <p className="text-gray-600">Create and manage your events</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl">
              <span className="text-sm font-medium text-gray-700">
                {venues.length} Venue{venues.length !== 1 ? "s" : ""} Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NO VENUES STATE */}
      {venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Venues Added Yet
            </h2>
            <p className="text-gray-600 mb-8">
              You need to add at least one venue before creating events. Venues
              provide the location and capacity for your events.
            </p>
            <Link
              to="/venues"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Your First Venue
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN — ADD EVENT FORM */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              {/* Card Header */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-4 mb-4">
                  <h2 className="text-xl font-bold text-white text-center">
                    Create New Event
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">
                  Fill in the event details below
                </p>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-5">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={eventName}
                      placeholder="Enter event name"
                      onChange={(e) => setEventName(e.target.value)}
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                    />
                    <div className="absolute left-3 top-3.5">
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
                </div>

                {/* Venue Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Venue *
                  </label>
                  <div className="relative">
                    <select
                      value={venueIndex}
                      onChange={(e) => setVenueIndex(e.target.value)}
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400 appearance-none bg-white"
                    >
                      <option value="" className="text-gray-400">
                        Select a venue
                      </option>
                      {venues.map((v, index) => (
                        <option
                          key={v.id}
                          value={index}
                          className="text-gray-800"
                        >
                          {v.name} • {v.total_capacity} seats
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-3.5">
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
                    <div className="absolute right-3 top-3.5 pointer-events-none">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Event Status */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Status
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      // value={eventStatus}
                      // onChange={(e) => setEventStatus(e.target.value)}
                      placeholder="e.g., Upcoming, Live, Completed"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                    />
                    <div className="absolute left-3 top-3.5">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div> */}

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={startTime}
                        min={today}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                      />
                      <div className="absolute left-3 top-3.5">
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
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={endTime}
                        min={startTime || today}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 hover:border-gray-400"
                      />
                      <div className="absolute left-3 top-3.5">
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
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={resetEventData}
                    className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-md hover:shadow-lg"
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg hover:shadow-xl"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN — EVENTS TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Table Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      All Events
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {events.length} event{events.length !== 1 ? "s" : ""}{" "}
                      created
                    </p>
                  </div>
                  {console.log("Sample event:", events[0])}

                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <SearchBar
                        data={events}
                        searchKeys={["name", "venue_name"]}
                        // placeholder="deep search"
                        onSearch={(results) => setFilteredEvents(results)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Events Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Venue
                      </th>
                      {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th> */}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date Range
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {console.log("eventsssssssssss", events)}
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                              <svg
                                className="w-8 h-8 text-emerald-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-gray-500 font-medium">
                              No events created yet
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              Create your first event using the form
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((event, index) => (
                        <tr
                          key={event.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          {console.log("event,event", event)}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mr-3">
                                <svg
                                  className="w-5 h-5 text-emerald-600"
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
                              <div>
                                <div className="font-medium text-gray-900">
                                  {event.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {event.venue_name}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              event.status?.toLowerCase() === 'completed' 
                                ? 'bg-red-100 text-red-800'
                                : event.status?.toLowerCase() === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {event.status || "Upcoming"}
                            </span>
                          </td> */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">
                                {event.start_datetime}
                              </div>
                              <div className="text-gray-500 text-xs">
                                to {event.end_datetime}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                navigate(`/events/${event.id}/book`)
                              }
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              Book Tickets
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination (Optional) */}
              {events.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{events.length}</span> of{" "}
                    <span className="font-medium">{events.length}</span> events
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
