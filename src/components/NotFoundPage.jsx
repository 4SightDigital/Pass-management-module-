import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>

      <div className="mt-6 flex gap-4">
        {isAuthenticated ? (
          <Link
            to="/booking"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            Go to Home
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFoundPage;
