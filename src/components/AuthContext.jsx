import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser, logoutUser } from "../api/auth.api";

export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials, redirectTo = "/booking") => {
    setError("");
    try {
      await loginUser(credentials);
      
      // Fetch user immediately after login
      await fetchUser();
      
      navigate(redirectTo);
    } catch (err) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials");
      setUser(null);
    }
  };

  const logout = async (redirectTo = "/login") => {
    try {
      // Call logout API if you have one
      await logoutUser();
      
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.clear(); // Clear any stored data
      navigate(redirectTo);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
