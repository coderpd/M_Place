"use client"
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ AuthProvider Mounted"); // Debugging log
    setTimeout(() => {
      console.log("✅ Setting user...");
      setUser({ name: "Test User" }); // Simulating user login
      setLoading(false);
      console.log("✅ Auth Loaded");
    }, 2000);
  }, []);
  
  if (loading) {
    console.log("⚠️ Auth is still loading...");
    return <p>Loading Auth...</p>;
  }

  console.log("✅ Auth Loaded:", user);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
