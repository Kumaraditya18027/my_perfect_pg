// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { encryptToken } from "@/utils/secureToken";

interface AuthContextType {
  currentUserData: {
    name: string;
    email: string;
    bio: string;
    phone: string;
    avatar: string;
    bookmarkedPg: Array<{
      name: string;
      address: string;
      price: string;
      rating: string;
      pictures: string[];
    }>;
  } | null;

  login: (token: string, userType: string, userData: object) => void;
  logout: () => void;
  editUserData: (userData: object) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUserData, setCurrentUserData] =
    useState<AuthContextType["currentUserData"]>(null);

  const login = (token: string, userType: string, userData: object) => {
    if (token && userType) {
      localStorage.setItem("authToken", encryptToken(token));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUserType", userType);
      console.log("User data : ", userData);
      setCurrentUserData(
        userData as {
          name: string;
          email: string;
          bio: string;
          phone: string;
          avatar: string;
          bookmarkedPg: {
            name: string;
            address: string;
            price: string;
            rating: string;
            pictures: string[];
          }[];
        }
      );

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
        const nextPath = searchParams.get("next") || "/searchpg";
        router.replace(nextPath);
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

  const editUserData = (userData: object) => {
    setCurrentUserData(
      userData as {
        name: string;
        email: string;
        bio: string;
        phone: string;
        avatar: string;
        bookmarkedPg: {
          name: string;
          address: string;
          price: string;
          rating: string;
          pictures: string[];
        }[];
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{ currentUserData, login, logout, editUserData }}
    >
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
