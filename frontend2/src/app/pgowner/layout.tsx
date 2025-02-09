// app/pgowner/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { decryptToken } from "@/utils/secureToken";
import ProtectedRoute from "@/components/ProtectedRoute";

const PgOwnerLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  console.log(pathname);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const token = decryptToken(localStorage.getItem("authToken") || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed!");
      }

      await response.json();
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
    <ProtectedRoute userType="Owner">
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
    </ProtectedRoute>
  );
};

export default PgOwnerLayout;
