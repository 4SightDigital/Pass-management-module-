import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
          MyLogo
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/venues"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Venues
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Tickets
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
