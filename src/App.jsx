import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Venues from "./pages/Venues";
import Events from "./pages/Events";
import ManageSeating from "./pages/ManageSeating";
import BookTickets from "./pages/BookTickets";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-b from-[#C8FECC] to-[#799EBE] p-6">
          {/* Mobile Header */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-3 py-2 bg-white rounded-md shadow"
            >
              ☰
            </button>
          </div>

          <Routes>
            <Route path="/venues" element={<Venues />} />
            <Route path="/events" element={<Events />} />
            <Route path="/manageSeats" element={<ManageSeating />} />
            <Route path="/events/:eventId/book" element={<BookTickets />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
