"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { decryptToken } from "@/utils/secureToken";

const AllBookings: React.FC = () => {
  const [bookedPGs, setBookedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pgowner/get-all-bookings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response.json());

        if (!response.ok) {
          throw new Error("Failed to fetch booked PGs.");
        }

        const data = await response.json();
        setBookedPGs(data?.data || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1 className="pageHeading text-2xl font-bold text-gray-800 mb-6">
        All Bookings
      </h1>

      {loading && <p className="text-gray-500">Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookedPGs.length === 0 && (
        <p className="text-gray-600">No bookings available.</p>
      )}

      {!loading && bookedPGs.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Room Type
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Fooding Type
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  AC
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody>
              {bookedPGs.length > 0 ? (
                bookedPGs.map((booking, index) => (
                  <tr
                    key={index}
                    className="bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <td className="pl-6 py-5 rounded-l-xl">
                      <div className="flex items-center">
                        <Image
                          src={booking.pg.pictures?.[0] || "/placeholder.jpg"}
                          alt="pg-image"
                          width={50}
                          height={50}
                          className="size-12 rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5">{booking.pg.name}</td>
                    <td className="px-6 py-5">{booking.pg.address}</td>
                    <td className="px-6 py-5">{booking.roomType}</td>
                    <td className="px-6 py-5">{booking.foodingType}</td>
                    <td className="px-6 py-5">{booking.ac ? "Yes" : "No"}</td>
                    <td className="px-6 py-5">{booking.user.name}</td>
                    <td className="px-6 py-5">{booking.user.phone}</td>
                  </tr>
                ))
              ) : (
                <p>No Bookings available</p>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
