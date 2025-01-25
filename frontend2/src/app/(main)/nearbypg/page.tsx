"use client";
import MainNavbar from "@/components/MainNavbar";
import { decryptToken } from "@/utils/secureToken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-blue-500"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// const PhoneIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="w-4 h-4 text-green-500"
//   >
//     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//   </svg>
// );

// const ChevronRightIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="w-5 h-5 text-gray-400"
//   >
//     <path d="m9 18 6-6-6-6" />
//   </svg>
// );

const listings = [
  {
    id: 1,
    name: "Midland Park Building",
    location: "Nayapatti, Salt Lake",
    price: 7000,
    rating: 4.2,
    images: ["/midlandpark.jpg"],
    amenities: ["WiFi", "Food", "Laundry"],
    roomTypes: ["Single", "Double"],
    gender: "Male",
    available: true,
    reviews: 18,
  },
  {
    id: 5,
    name: "Appayan PG",
    location: "Nayapatti, Technopolis, Salt Lake",
    price: 7000,
    rating: 4.6,
    images: ["/appayan.jpg"],
    amenities: ["AC", "Food", "WiFi"],
    roomTypes: ["Single", "Double"],
    gender: "Male",
    available: true,
    reviews: 28,
  },
  {
    id: 6,
    name: "Sabita PG",
    location: "Nayapatti, Technopolis, Salt Lake",
    price: 6800,
    rating: 4.7,
    images: ["/sabitapg.jpg"],
    amenities: ["WiFi", "Food", "Gym"],
    roomTypes: ["Single", "Double"],
    gender: "Female",
    available: false,
    reviews: 35,
  },
  {
    id: 8,
    name: "Asha PG",
    location: "CL Block, Sector 2, Salt Lake",
    price: 7000,
    rating: 4.4,
    images: ["/ashapg.jpg"],
    amenities: ["WiFi", "Food", "Laundry"],
    roomTypes: ["Double", "Triple"],
    gender: "Female",
    available: true,
    reviews: 19,
  },
  // Add more listings as needed
];

const PGListing = () => {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Request the user's location when the component is mounted
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Geolocation error: ", error);
          }
        );
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      setLoading(true);
      // Fetch PGs near the user's location
      const fetchPGsNearby = async () => {
        try {
          const token = decryptToken(localStorage.getItem("authToken"));
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/get-nearby-pg?lat=${userLocation.latitude}&long=${userLocation.longitude}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();
          setListings(data);
        } catch (err) {
          console.error(err);
          setListings([]);
        } finally {
          setLoading(false);
        }
      };

      fetchPGsNearby();
    }
  }, [userLocation]);

  return (
    <>
      <div className="mb-16">
        <MainNavbar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 flex-col sm:flex-row">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Find Your Perfect PG
              </h1>
              <p className="text-gray-600 mt-2 text-lg sm:text-xl">
                Discover comfortable and affordable PG accommodations
              </p>
            </div>

            <div className="flex gap-4 mt-4 sm:mt-0">
              <select className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Sort by Price</option>
                <option>Low to High</option>
                <option>High to Low</option>
              </select>
              <select className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option>Filter Location</option>
                <option>Kolkata</option>
                <option>Other Cities</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="sm:bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-90">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-5 gap-4 p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="text-sm font-semibold text-gray-600">Image</div>
              <div className="text-sm font-semibold text-gray-600">PG Name</div>
              <div className="text-sm font-semibold text-gray-600">
                Location
              </div>
              <div className="text-sm font-semibold text-gray-600">Amount</div>
              <div className="text-sm font-semibold text-gray-600">Action</div>
            </div>

            {/* Listings */}
            {loading ? (
              <div className="text-center text-gray-600">
                Loading PGs near you...
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {listings?.map((listing) => (
                  <div
                    key={listing.uuid}
                    className="bg-white sm:bg-transparent mb-6 sm:mb-0 grid grid-cols-1 sm:grid-cols-5 gap-4 p-6 items-center transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer"
                    onMouseEnter={() => setHoveredId(listing.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative group">
                      <img
                        src={listing.pictures[0]}
                        alt={listing.name}
                        className="w-16 h-16 rounded-2xl object-cover transform transition-transform group-hover:scale-105 shadow-lg"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {listing.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {listing?.amenities?.join(" · ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocationIcon />
                      <span className="text-gray-700">{listing.location}</span>
                    </div>
                    <div className="font-medium text-gray-900">
                      <span className="text-sm text-gray-500">₹</span>
                      {listing.price}
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          router.push(`/searchpg/${listing?.uuid}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="mt-8 text-center text-gray-500">
            <p>
              Can't find what you're looking for?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => router.push("/about")}
              >
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PGListing;
