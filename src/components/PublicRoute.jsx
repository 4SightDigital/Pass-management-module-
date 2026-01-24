// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import React from "react";


const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or spinner

  if (isAuthenticated) {
    return <Navigate to="/booking" replace />;
  }

  return children;
};

export default PublicRoute;
