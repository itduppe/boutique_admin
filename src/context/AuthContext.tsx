"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { getDecodedToken, logoutHelper } from "@/utils/helper";

interface User {
  id?: string;
  username?: string;
  role?: string;
  site?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decoded = getDecodedToken();

    if (decoded) setUser(decoded);
    setIsLoading(false);
  }, []);

  const logout = () => {
    logoutHelper();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
