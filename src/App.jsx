import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import useVenueStore from "./store/useVenueStore";

function App() {
  const myStore = useVenueStore();
  // console.log(myStore);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#C8FECC] to-[#799EBE]">
      <BrowserRouter>
        {/* Navbar */}
        <nav className="flex gap-6 p-5">
          <Link
            to="/events"
            className="text-2xl font-semibold underline hover:text-gray-700"
          >
            Events
          </Link>

          <Link
            to="/venues"
            className="text-2xl font-semibold underline hover:text-gray-700"
          >
            Venue
          </Link>
        </nav>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          <Routes>
            <Route path="/events" element={<Events />} />
            <Route path="/venues" element={<Venues />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
