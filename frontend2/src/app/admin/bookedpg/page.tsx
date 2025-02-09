"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import pgImg from "../../../../public/admin/pg.jpeg";
import { decryptToken } from "@/utils/secureToken";

interface PGDetails {
  image: string;
  name: string;
  location: string;
  amount: string;
  assign_member: string;
  ph_number: string;
}

const tableHeading: string[] = [
  "Image",
  "PG Name",
  "Location",
  "Amount",
  "Assign member",
  "Phone number",
];

const bookedPG: PGDetails[] = [
  {
    image: "https://example.com/image1.jpg",
    name: "Sunshine PG",
    location: "Mumbai",
    amount: "6000",
    assign_member: "Amit Sharma",
    ph_number: "+911234567890",
  },
  {
    image: "https://example.com/image2.jpg",
    name: "Comfort Stay",
    location: "Delhi",
    amount: "5500",
    assign_member: "Sneha Rao",
    ph_number: "+919876543210",
  },
  {
    image: "https://example.com/image3.jpg",
    name: "Green Haven",
    location: "Bangalore",
    amount: "7000",
    assign_member: "Vikram Singh",
    ph_number: "+918765432109",
  },
  {
    image: "https://example.com/image4.jpg",
    name: "Elite Residency",
    location: "Pune",
    amount: "6500",
    assign_member: "Anjali Verma",
    ph_number: "+919123456789",
  },
  {
    image: "https://example.com/image5.jpg",
    name: "Peaceful Abode",
    location: "Hyderabad",
    amount: "6200",
    assign_member: "Rakesh Gupta",
    ph_number: "+918912345678",
  },
  {
    image: "https://example.com/image6.jpg",
    name: "Cosy Corner",
    location: "Chennai",
    amount: "5000",
    assign_member: "Priya Nair",
    ph_number: "+917654321098",
  },
  {
    image: "https://example.com/image7.jpg",
    name: "The Nest",
    location: "Ahmedabad",
    amount: "5600",
    assign_member: "Nitin Patel",
    ph_number: "+917012345678",
  },
  {
    image: "https://example.com/image8.jpg",
    name: "City Lights PG",
    location: "Jaipur",
    amount: "4800",
    assign_member: "Swati Mehta",
    ph_number: "+911098765432",
  },
  {
    image: "https://example.com/image9.jpg",
    name: "Royal Stay",
    location: "Kolkata",
    amount: "5400",
    assign_member: "Rahul Sen",
    ph_number: "+913456789012",
  },
];

const Booked: React.FC = () => {
  const [bookedPGs, setBookedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/get-all-bookings`,
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookedPGs.map((booking, index) => (
                <tr
                  key={index}
                  className="bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <td className="pl-6 py-5 rounded-l-xl">
                    <div className="flex items-center">
                      <Image
                        src={booking.pg.picture}
                        alt="pg-image"
                        width={50}
                        height={50}
                        className="size-12 rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-5">{booking.pg.name}</td>
                  <td className="px-6 py-5">{booking.pg.address}</td>
                  <td className="px-6 py-5">{booking.pg.amount}</td>
                  <td className="px-6 py-5">{booking.pg.assign_member}</td>
                  <td className="px-6 py-5">{booking.pg.phone}</td>
                  <td className="px-6 py-5">{booking.status}</td>
                  <td className="pr-6 py-5 rounded-r-xl">
                    <Link
                      href={`/admin/bookedpg/${booking.pg.name
                        ?.split(" ")
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

export default Booked;
