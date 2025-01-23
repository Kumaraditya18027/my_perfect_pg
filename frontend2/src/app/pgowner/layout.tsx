// app/pgowner/layout.tsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "@/components/Loading";
import { toast, ToastContainer } from "react-toastify";

const userType = "Owner";

const PgOwnerLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Is authenticated", isAuthenticated);
    console.log("Required user type", userType);
    const loggedInUserType = localStorage.getItem("loggedInUserType");
    console.log("Logged in user type", loggedInUserType);
    if (!isAuthenticated && loggedInUserType !== userType) {
      router.replace("/login"); // Redirect unauthenticated users to the login page
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <Loading />; // Show loading while redirecting
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed!");
      }

      await response.json();
      // console.log(data);
      logout();
    } catch (err: any) {
      console.log(err.message || "Something went wrong. Please try again.");
      toast.success("Logout failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const navLinks = [
    { href: "../", label: "Home" },
    { href: "", label: "Dashboard" },
    { href: "addPg", label: "Add PG" },
    { href: "bookings", label: "Bookings" },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 px-6">
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={`/pgowner/${link.href}`}>
              <Link
                href={`/pgowner/${link.href}`}
                className={`hover:text-blue-400 ${
                  pathname === `/pgowner/${link.href}`
                    ? "text-blue-400 font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* <li className="flex-1 text-right">Logout</li> */}
          <button onClick={handleLogout} className="flex-1 text-right">
            Logout
          </button>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="p-6">
        <ToastContainer />
        {children}
      </main>
    </div>
  );
};

export default PgOwnerLayout;
