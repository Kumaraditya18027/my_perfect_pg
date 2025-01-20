"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { ReactNode, useEffect } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login"); // Redirect unauthenticated users to the login page
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Show nothing while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
