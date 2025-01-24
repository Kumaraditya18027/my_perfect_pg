"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Loading from "./Loading";

const ProtectedRoute = ({
  children,
  userType,
}: {
  children: ReactNode;
  userType: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log("Is authenticated", isLoggedIn);
    console.log("Required user type", userType);
    const loggedInUserType = localStorage.getItem("loggedInUserType");
    console.log("Logged in user type", loggedInUserType);
    if (!isLoggedIn || loggedInUserType !== userType) {
      router.replace("/login"); // Redirect unauthenticated users to the login page
      return;
    } else {
      setIsLoading(false); // Allow rendering once authenticated and user type matches
    }
  }, [router, userType]);

  if (isLoading) {
    return <Loading />; // Show nothing while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
