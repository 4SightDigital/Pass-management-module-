import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Venues from "./pages/Venues";
import Events from "./pages/Events";
import ManageSeating from "./pages/ManageSeating";
import BookTickets from "./pages/BookTickets";
import logo from "../src/assets/company-logo.webp";
import useVenueStore from "./store/useVenueStore";
import Navbar from "./components/Navbar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {fetchVenues, fetchEvents} = useVenueStore()

  useEffect(()=> {
    fetchVenues()
    fetchEvents()
    console.log("fetched venues and evenets")
  },[fetchVenues,fetchEvents])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-[#C8FECC] to-[#A6C1F5]">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 md:hidden bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Logo for mobile */}
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="company logo"
                  className="h-12 w-auto object-contain"
                /> 
              </div>

              {/* Placeholder for future mobile actions */}
              <div className="w-10"></div>
            </div>
          </header>
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
  
                <Route path="/" element={BookTickets()}/>
                <Route path="/venues" element={<Venues />} />
                <Route path="/events" element={<Events />} />
                <Route path="/manageSeats" element={<ManageSeating />} />
                <Route path="/events/:eventId/book" element={<BookTickets />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
