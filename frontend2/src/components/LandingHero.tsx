"use client";
import React, { useEffect, useState } from "react";
import HomeNavbar from "./HomeNavbar";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check for `localStorage` value after the component has mounted
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // handle search pg
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]); // Clear search results when input is empty
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/search-pg?query=${searchQuery}`
        );
        if (!res.ok) throw new Error("Failed to fetch search results");

        const data = await res.json();
        setSearchResults(data); // Set search results
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]); // Trigger search on every key press

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 focus:outline-none focus:border-white/50"
            />
            {loading && (
              <div className="absolute inset-y-0 right-4 flex items-center justify-center">
                <div className="w-4 h-4 border-4 border-t-4 border-white/70 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-[62%]">
          {searchResults.length > 0 && (
            <div className="mt-6 w-[40rem] max-w-2xl bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4">Search Results</h2>
              <ul>
                {searchResults.map((pg, index) => (
                  <li
                    key={index}
                    className="border-b py-4 cursor-pointer"
                    onClick={() => router.push(`/searchpg/${pg.uuid}`)}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{pg.name}</h3>
                        <p className="text-gray-600">{pg.address}</p>
                        <p className="text-gray-600">{pg.gender}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchResults.length === 0 && !loading && searchQuery && (
            <p className="mt-4 text-white">
              No PGs found matching "{searchQuery}"
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
