import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Check if user is already logged in from the token
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setAuthState((prev) => ({ ...prev, isAuthenticated: true }));
    }
  }, []);

  const login = (user, token) => {
    Cookies.set("token", token, { expires: 5 }); // Store token in cookies (5 days)
    Cookies.set("user", JSON.stringify(user)); // Store user details in cookies
    setAuthState({ isAuthenticated: true, user }); // Store user details in context
    console.log(user);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
