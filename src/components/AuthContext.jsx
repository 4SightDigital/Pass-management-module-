import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../api/auth.api";

export const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials, redirectTo = "/booking") => {
    setError("");
    try {
      await loginUser(credentials);
      

      await new Promise((res) => setTimeout(res, 50));

      
      const res = await getCurrentUser();
      setUser(res.data);
      navigate(redirectTo);
    } catch (err) {
      console.log("eeeeeeeeorrrrr", err)
      setError("Invalid credentials");
      setUser(null);
    }
  };

  const logout = async (redirectTo = "/login") => {
    setUser(null);
    navigate(redirectTo);
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
