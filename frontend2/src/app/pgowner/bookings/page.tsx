"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowCircleRight } from "react-icons/fa";
import { decryptToken } from "@/utils/secureToken";

const AllBookings: React.FC = () => {
  const [bookedPGs, setBookedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken"));
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
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Assigned Member
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookedPGs.map((pg, index) => (
                <tr
                  key={index}
                  className="bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <td className="pl-6 py-5 rounded-l-xl">
                    <div className="flex items-center">
                      <Image
                        src={pg.picture || "/placeholder.jpg"}
                        alt="pg-image"
                        width={50}
                        height={50}
                        className="size-12 rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">{pg.name}</td>
                  <td className="px-6 py-5">{pg.location}</td>
                  <td className="px-6 py-5">{pg.amount}</td>
                  <td className="px-6 py-5">{pg.assign_member}</td>
                  <td className="px-6 py-5">{pg.ph_number}</td>
                  <td className="pr-6 py-5 rounded-r-xl">
                    <Link
                      href={`/admin/bookedpg/${pg.name
                        .split(" ")
                        .join("-")
                        .toLowerCase()}`}
                    >
                      <FaArrowCircleRight className="text-2xl text-blue-500 hover:text-blue-600 transition" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
