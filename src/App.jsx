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
import BookingReports from "./pages/BookingReports";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetchVenues, fetchEvents } = useVenueStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchVenues();
    fetchEvents();
    console.log("fetched venues and events");
  }, [fetchVenues, fetchEvents]);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-[#C8FECC] to-[#A6C1F5]">
        {/* Fixed Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onCollapse={setIsCollapsed}
        />

        {/* Main Content Area */}

        <div
          className={`flex flex-col flex-1 transition-all duration-300
            ${isCollapsed ? "md:ml-20" : "md:ml-64"}
            pt-16
          `}
        >
          {/* Fixed Navbar */}

          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isSidebarCollapsed={isCollapsed}
          />

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={BookTickets()} />
                <Route path="/venues" element={<Venues />} />
                <Route path="/events" element={<Events />} />
                <Route path="/manageSeats" element={<ManageSeating />} />
                <Route path="/events/:eventId/book" element={<BookTickets />} />
                <Route path ="/reports" element={<BookingReports />}/>
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
