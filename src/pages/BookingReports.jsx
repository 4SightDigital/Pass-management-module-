import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import SearchBar from "../components/search/SearchBar";
import api from "../api/axios";
import useVenueStore from "../store/useVenueStore";
import Modal from "../components/Modal";
import PersonDetail from "../components/PersonDetail";
import { downloadFile } from "../utils/downloadFile";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const emptyBookingData = {
  totalReferencePersons: 0,
  totalVIPPasses: 0,
  totalSeatsIssued: 0,
  referencePersons: [],
};

const BookingReports = () => {
  const { events, fetchEvents } = useVenueStore();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [bookingData, setBookingData] = useState(emptyBookingData);
  const [filtRefDetails, setFiltRefDetails] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personDetail, setPersonDetail] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventChange = async (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);

    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api(`/reports/person-wise/${eventId}`);
      console.log("resssss", res);
      const json = await res.data;

      if (!json.success) {
        throw new Error("Failed to load booking report");
      }

      setBookingData(json.data);
      setFiltRefDetails(json.data.referencePersons);
    } catch (err) {
      console.error(err);
      setError("Unable to load booking report");
      setBookingData(emptyBookingData);
      setFiltRefDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare doughnut chart data
  const chartData = {
    labels: bookingData.referencePersons.slice(0, 10).map((rp) => rp.name),
    datasets: [
      {
        label: "Seats Issued",
        data: bookingData.referencePersons
          .slice(0, 10)
          .map((rp) => rp.totalSeats),
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(244, 63, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
          "rgb(236, 72, 153)",
          "rgb(249, 115, 22)",
          "rgb(234, 179, 8)",
          "rgb(6, 182, 212)",
          "rgb(244, 63, 94)",
          "rgb(168, 85, 247)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 12,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage =
              bookingData.totalSeatsIssued > 0
                ? ((value / bookingData.totalSeatsIssued) * 100).toFixed(1)
                : 0;
            return `${label}: ${value} seats (${percentage}%)`;
          },
        },
      },
      beforeDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.save();

        const totalBooked = bookingData.totalSeatsIssued;
        const text = totalBooked.toString();
        const label = "Total Booked";

        // Calculate dynamic font sizes
        const numberFontSize = Math.min(height / 6, 28); // Larger for number
        const labelFontSize = Math.min(height / 10, 14); // Smaller for label

        // Draw number
        ctx.font = `bold ${numberFontSize}px sans-serif`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "#111827"; // dark gray
        ctx.fillText(text, width / 2, height / 2 - 12);

        // Draw label
        ctx.font = `${labelFontSize}px sans-serif`;
        ctx.fillStyle = "#6B7280"; // gray
        ctx.fillText(label, width / 2, height / 2 + 12);

        ctx.restore();
      },
    },
  };
  // const downloadExcel = async (type) => {
  //   if (!selectedEvent) return;

  //   try {
  //     const response = await api.get(
  //       `/reports/${type}/download/${selectedEvent}`,
  //       {
  //         responseType: "blob", // 🔑 IMPORTANT
  //       },
  //     );

  //     const blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const url = window.URL.createObjectURL(blob);

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download =
  //       type === "person-wise"
  //         ? `person_wise_report_${selectedEvent}.xlsx`
  //         : `category_wise_report_${selectedEvent}.xlsx`;

  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to download report");
  //   }
  // };

  const handleDownloadExcel = (type) => {
  if (!selectedEvent) return;

  downloadFile({
    url: `/reports/${type}/download/${selectedEvent}`,
    filename:
      type === "person-wise"
        ? `person_wise_report_${selectedEvent}.xlsx`
        : `category_wise_report_${selectedEvent}.xlsx`,
  });
};

  const handleViewRecord = async (referencePerson) => {
    try {
      setLoading(true);
      setOpen(true);
      const res = await api.get(
        `/reports/person/${selectedEvent}/${encodeURIComponent(referencePerson)}`,
      );
      console.log("Person detail:das", res.data);
      setPersonDetail(res.data);
      // Example:
      // setPersonDetail(res.data);
      // setShowModal(true);
    } catch (err) {
      console.error("Failed to load person record", err);
      setPersonDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const safeAvg = (total, count) =>
    count > 0 ? (total / count).toFixed(1) : "0.0";

  const hasChartData =
    bookingData.referencePersons &&
    bookingData.referencePersons.length > 0 &&
    bookingData.totalSeatsIssued > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Reports
          </h1>
          <p className="text-gray-600">
            View detailed booking reports for each event
          </p>
        </div>

        {/* Event Selection */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Select Event
                </h2>
                <p className="text-sm text-gray-600">
                  Choose an event to view its booking reports
                </p>
              </div>

              <div className="w-full md:w-64">
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={handleEventChange}
                    className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 appearance-none"
                  >
                    <option value="">Choose an event...</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
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
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
            </div>
          </div>
        </div>

        {!selectedEvent ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Event Selected
            </h3>
            <p className="text-gray-600">
              Please select an event from the dropdown above to view booking
              reports.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            {/* Top Two Sections - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Section 1: Summary Cards */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Booking Summary
                    </h2>
                    <p className="text-sm text-gray-600">
                      Passes and Seats Overview
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Total Reference Persons */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Total Reference Persons
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued passes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">
                        {bookingData.totalReferencePersons}
                      </div>
                      <div className="text-xs text-gray-500">Persons</div>
                    </div>
                  </div>

                  {/* Total VIP Passes Issued */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Total Passes Issued
                        </p>
                        <p className="text-xs text-gray-500">
                          Across all reference persons
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-700">
                        {bookingData.totalVIPPasses}
                      </div>
                      <div className="text-xs text-gray-500">Passes</div>
                    </div>
                  </div>

                  {/* Total Seats Issued */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="w-4 h-4 text-emerald-600"
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
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Total Seats Issued
                        </p>
                        <p className="text-xs text-gray-500">
                          To all reference persons
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-700">
                        {bookingData.totalSeatsIssued}
                      </div>
                      <div className="text-xs text-gray-500">Seats</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Doughnut Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Seat Distribution
                    </h2>
                    <p className="text-sm text-gray-600">
                      Top 10 Reference Persons
                    </p>
                  </div>
                </div>

                <div className="h-64 flex items-center justify-center">
                  {hasChartData ? (
                    <Doughnut data={chartData} options={chartOptions} />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-sm font-medium">
                        No seat data available
                      </p>
                      <p className="text-xs mt-1">
                        This event has no bookings yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Chart Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">
                      Avg. Seats per Person
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {safeAvg(
                        bookingData.totalSeatsIssued,
                        bookingData.totalReferencePersons,
                      )}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">
                      Avg. Passes per Person
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {safeAvg(
                        bookingData.totalVIPPasses,
                        bookingData.totalReferencePersons,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Reference Persons Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 text-left">
                        Reference Persons Details
                      </h2>
                      <p className="text-sm text-gray-600">
                        Complete list of all reference persons and their
                        allocations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className=" py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                        #
                      </th>
                      <th className=" py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Reference Person
                      </th>
                      <th className=" py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Passes Issued
                      </th>
                      <th className=" py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Total Seats Issued
                      </th>
                      <th className=" py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Seat Categories
                      </th>
                      <th className=" py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtRefDetails.map((person, index) => (
                      <tr
                        key={person.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        {/* Row Number */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">
                            {index + 1}
                          </div>
                        </td>

                        {/* Reference Person Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center pl-10">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-blue-600"
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
                            <div>
                              <div className="font-medium text-gray-900">
                                {person.name}
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5">
                                ID: REF-{person.id.toString().padStart(3, "0")}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* VIP Passes Issued */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                              {person.vipPasses}
                            </span>
                          </div>
                        </td>

                        {/* Total Seats Issued */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-lg font-bold text-emerald-700">
                                {person.totalSeats}
                              </div>
                              <div className="text-gray-500 text-xs">seats</div>
                            </div>
                          </div>
                        </td>

                        {/* Seat Categories */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg text-sm font-medium">
                              {person.seatCategories} categor
                              {person.seatCategories !== 1 ? "ies" : "y"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleViewRecord(person.name)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              <svg
                                className="w-4 h-4 group-hover:scale-110 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                View Record
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Modal
                  isOpen={open}
                  onClose={() => {
                    setOpen(false);
                    setPersonDetail(null);
                  }}
                  title={personDetail?.reference_name || "Person Detail"}
                >
                  {<PersonDetail data={personDetail} loading={loading} />}
                </Modal>
              </div>

              {/* Table Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {bookingData.referencePersons.length}
                    </span>{" "}
                    reference persons
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDownloadExcel("person-wise")}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                    >
                      Export Person Wise Report
                    </button>
                    <button
                      onClick={() => handleDownloadExcel("category-wise")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Export Category Wise Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingReports;
