"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

// SVG Icons as components
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn")
  );
  const { logout, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full transform transition-all duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-1 rounded-full bg-blue-500/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Perfect PG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About Us</NavLink>
            <NavLink href="/searchpg">Search</NavLink>
            <NavLink href="/nearbypg">Nearby PGs</NavLink>
            {/* <NavLink href="/Summary">Dashboard</NavLink> */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium 
                         transform transition-all duration-300 
                         hover:bg-blue-600 hover:scale-105 hover:shadow-lg
                         active:scale-95"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium 
              transform transition-all duration-300 
              hover:bg-blue-600 hover:scale-105 hover:shadow-lg
              active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-3 space-y-1">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/About" onClick={() => setIsOpen(false)}>
              About
            </MobileNavLink>
            <MobileNavLink href="/Pg" onClick={() => setIsOpen(false)}>
              Search
            </MobileNavLink>
            <MobileNavLink href="/Nearby" onClick={() => setIsOpen(false)}>
              NearBy PGs
            </MobileNavLink>
            {/* <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
              About
            </MobileNavLink> */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-4 py-2 mt-4 rounded-full 
                         bg-blue-500 text-white font-medium 
                         transform transition-all duration-300 
                         hover:bg-blue-600 hover:scale-105
                         active:scale-95"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="block w-full text-center px-4 py-2 mt-4 rounded-full 
                         bg-blue-500 text-white font-medium 
                         transform transition-all duration-300 
                         hover:bg-blue-600 hover:scale-105
                         active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop NavLink component
const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="group relative font-medium text-gray-700 transition-colors duration-200 hover:text-blue-500"
  >
    <span className="relative">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
    </span>
  </Link>
);

// Mobile NavLink component
const MobileNavLink = ({ href, onClick, children }) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-4 py-2 text-base font-medium text-gray-700 
               hover:text-blue-500 hover:bg-blue-50 rounded-lg
               transition-all duration-200"
  >
    {children}
  </Link>
);

export default Navbar;
