import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

          <nav className="space-y-2">
            <SidebarLink to="/venues" label="Venues" />
            <SidebarLink to="/events" label="Events" />
            <SidebarLink to="/manageSeats" label="Manage"/>
          </nav>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, label }) {
  return (
    <Link
      to={to}
      className="
        block px-4 py-2 rounded-md
        text-gray-700 font-medium
        transition-all duration-200
        hover:text-gray-900
        hover:bg-gradient-to-r
        hover:from-[#C8FECC]
        hover:to-[#799EBE]
      "
    >
      {label}
    </Link>
  );
}

export default Sidebar;
