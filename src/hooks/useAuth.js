import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser, getCurrentUser } from "../api/auth.api";

export default function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is already logged in on page load
  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Login function
  const login = async (credentials, redirectTo = "/booking") => {
    setError("");
    try {
      await loginUser(credentials);
      const res = await getCurrentUser();
      setUser(res.data);
      navigate(redirectTo); // Redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setUser(null);
    }
  };

  // Logout function
  const logout = async (redirectTo = "/login") => {
    try {
      await logoutUser();
      setUser(null);
      navigate(redirectTo);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
}
