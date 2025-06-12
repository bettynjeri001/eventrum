import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // Login: set user and persist to localStorage
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  // Logout: clear user and localStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
  };

  // Register: implement as needed
  const register = async (userData) => {
    // Registration logic here
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}