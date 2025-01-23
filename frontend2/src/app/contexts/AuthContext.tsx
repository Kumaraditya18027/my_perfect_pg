// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { encryptToken } from "@/utils/secureToken";

interface AuthContextType {
  isAuthenticated: boolean;
  // loggedInUserType: string;
  currentUserData: object | null;
  login: (token: string, userType: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserData, setCurrentUserData] = useState<object>({});

  const login = (token: string, userType: string, userData: object) => {
    if (token && userType) {
      localStorage.setItem("authToken", encryptToken(token));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("loggedInUserType", userType);
      setCurrentUserData(userData);

      if (userType === "Admin") {
        console.log("Going to admin page...");
        router.push("/admin/summary");
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUserType");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ currentUserData, login, logout }}>
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
