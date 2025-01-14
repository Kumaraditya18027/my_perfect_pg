"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HomeNavbar from "./HomeNavbar";
// import Navbar from "./Navbar2";

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for `localStorage` value after the component has mounted
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <div
      className="min-h-screen relative"
      style={{
        margin: "1rem",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/landinghero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.8)",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      />

      {/* Navigation */}
      <HomeNavbar />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 h-[calc(100vh-80px)]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light text-center tracking-wider mb-4 sm:mb-6">
          YOUR PERFECT PG STAY STARTS HERE
        </h1>

        <p className="text-white text-center mb-8 sm:mb-12 max-w-2xl">
          Book today for comfort, convenience, and community, all in prime
          locations with top amenities!
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search PG, Location..."
              className="w-full px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            className="mt-2 sm:mt-0 px-8 py-2 bg-white rounded-full text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
