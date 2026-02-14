import React, { useEffect, useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Venues from "./pages/Venues";
import Events from "./pages/Events";
import ManageSeating from "./pages/ManageSeating";
import BookTickets from "./pages/BookTickets";
import useVenueStore from "./store/useVenueStore";
import Navbar from "./components/Navbar";
import BookingReports from "./pages/BookingReports";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./components/AuthContext";
import NotFoundPage from "./components/NotFoundPage";
import { AuthProvider } from "./components/AuthContext";
import PublicRoute from "./components/PublicRoute";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetchVenues, fetchEvents } = useVenueStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const { isAuthenticated } = useAuth();

  const { isAuthenticated, loading } = useAuth();
  const hideLayout = !isAuthenticated;

  useEffect(() => {
    if (isAuthenticated) {
      fetchVenues();
      fetchEvents();
    }
  }, [isAuthenticated]);

  // const location = useLocation();
  // const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#C8FECC] to-[#A6C1F5]">
      {!hideLayout && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onCollapse={setIsCollapsed}
        />
      )}

      <div
        className={`flex flex-col flex-1 transition-all duration-300
          ${!hideLayout ? (isCollapsed ? "md:ml-20" : "md:ml-64") : ""}
          pt-16
        `}
      >
        {!hideLayout && (
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isSidebarCollapsed={isCollapsed}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/booking" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* <Route path="/login" element={<LoginPage />} /> */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <BookTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/venues"
                element={
                  <ProtectedRoute>
                    <Venues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route path="/manageSeats" element={<ProtectedRoute>
                    <ManageSeating />
                  </ProtectedRoute>} />
              <Route path="/events/:eventId/book" element={<ProtectedRoute>
                    <BookTickets />
                  </ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute>
                    <BookingReports />
                  </ProtectedRoute>} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
