// src/context/AuthContext.jsx
// ------------------------------------------------------------------
// React Context lets us share "who is logged in?" state with every
// component in the app without passing props down manually through
// every level (this is called "prop drilling", and Context avoids it).
// ------------------------------------------------------------------

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

// 1. Create the context object (starts empty; filled in by the Provider)
const AuthContext = createContext(null);

// 2. The Provider component wraps our whole app (see main.jsx) and
//    supplies the actual state + functions to every child component.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check localStorage

  // On first load, check if a user/token was saved from a previous
  // session (localStorage persists across page refreshes).
  useEffect(() => {
    const savedUser = localStorage.getItem("fc_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Called by the Login page after a successful API call.
  const login = (userData) => {
    // userData looks like: { _id, name, email, role, token }
    localStorage.setItem("fc_token", userData.token);
    localStorage.setItem("fc_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("fc_token");
    localStorage.removeItem("fc_user");
    setUser(null);
  };

  // Refreshes profile info (e.g. after favorites change) from the API.
  const refreshProfile = async () => {
    const { data } = await api.get("/auth/profile");
    const updated = { ...user, ...data };
    localStorage.setItem("fc_user", JSON.stringify(updated));
    setUser(updated);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Custom hook so components can just call useAuth() instead of
//    importing useContext + AuthContext everywhere.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
