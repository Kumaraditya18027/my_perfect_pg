"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import React, { useEffect, useState } from "react";
import { decryptToken } from "@/utils/secureToken";
import BookingTable from "@/components/BookingTable";

const Booked: React.FC = () => {
  const [bookedPGs, setBookedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pgNameFilter, setPgNameFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employee/get-all-bookings?status=assigned`,
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
      } catch (err) {
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
        <BookingTable
          bookedPGs={bookedPGs}
          pgNameFilter={pgNameFilter}
          setPgNameFilter={setPgNameFilter}
          employeeFilter={employeeFilter}
          setEmployeeFilter={setEmployeeFilter}
        />
      )}
    </div>
  );
};

export default Booked;
