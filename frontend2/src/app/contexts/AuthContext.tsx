// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, userType: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (token: string, userType: string) => {
    if (token && userType) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("isLoggedIn", true);
      setIsAuthenticated(true);

      if (userType === "Admin") {
        console.log("Going to admin page...");
        router.push("/admin");
        return;
      } else if (userType === "Owner") {
        console.log("Going to owner page...");
        router.push("/pgowner");
        return;
      } else {
        console.log("Going to user search page...");
        router.push("/searchpg");
        return;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
