"use client";

import { decryptToken } from "@/utils/secureToken";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// A dedicated component for rendering each booking row.
const BookingRow = ({ booking }) => {
  // console.log(booking.assignedMember?.name);
  // Manage the assigned member and status locally for each booking.
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(
    booking.assignedMember?.name || ""
  );
  const [isMemberAssigned, setMemberAssigned] = useState(
    booking.status === "assigned"
  );
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/get-employees`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch employees.");
        }

        const data = await response.json();
        setMembers(data?.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAssign = async () => {
    // Ensure a member has been selected
    if (!selectedMember) {
      alert("Please select a member first.");
      return;
    }

    try {
      const token = decryptToken(localStorage.getItem("authToken") || "");
      const payload = {
        bookingId: booking._id,
        employeeId: selectedMember,
      };

      // Make the POST request to assign the employee
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/assign-employee`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.log(response.json());
        throw new Error("Failed to assign employee");
      }

      const data = await response.json();
      // Update status to disable further changes upon success
      const member = members.find((member) => member.uuid === selectedMember);
      const memberName = member ? member.name : "";
      setMemberAssigned(true);
      setSelectedMember(memberName);
      setStatus("assigned");

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <tr className="bg-white shadow-md rounded-lg hover:shadow-lg transition-all duration-300 text-base text-center font-semibold">
      <td className="pl-6 py-5 rounded-l-xl">
        <div className="flex items-center justify-center">
          <Image
            src={booking.pg.picture}
            alt="PG image"
            width={50}
            height={50}
            className="rounded-lg"
          />
        </div>
      </td>
      <td className="px-6 py-5">{booking.pg.name}</td>
      <td className="px-6 py-5">{booking.pg.address || "N/A"}</td>
      <td className="px-6 py-5">{booking.pg.phone || "N/A"}</td>
      <td className="px-6 py-5">{booking.pg.amount || "N/A"}</td>
      <td className="px-6 py-5">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : isMemberAssigned ? (
          <span>{selectedMember}</span>
        ) : (
          <>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="mr-2 border rounded p-1"
            >
              <option value="">Select Employee</option>
              {loading ? (
                <option value="loading">Loading...</option>
              ) : (
                members.map((member, index) => (
                  <option key={index} value={member.uuid}>
                    {member.name}
                  </option>
                ))
              )}
              {/* Add additional options as needed */}
            </select>
            <button
              onClick={handleAssign}
              disabled={isMemberAssigned}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded ${
                isMemberAssigned ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Assign
            </button>
          </>
        )}
      </td>
      <td className="px-6 py-5">{status}</td>
    </tr>
  );
};

function PgBookingRequests() {
  const [pgBookingRequests, setPgBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const storedToken = localStorage.getItem("authToken") || "";
        const token = decryptToken(storedToken);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/get-all-bookings?status=pending`,
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
        console.log(data.data);
        setPgBookingRequests(data?.data || []);
      } catch (err) {
        // Ensure that err is an Error instance before accessing message.
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="pageHeading text-2xl font-bold text-gray-800 mb-6">
        New Booking Requests
      </h1>

      {loading && <p className="text-gray-500">Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && pgBookingRequests.length === 0 && (
        <p className="text-gray-600">No bookings available.</p>
      )}

      {!loading && pgBookingRequests.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
            <thead className="text-center text-gray-700 bg-gray-100">
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
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Assigned Employee
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pgBookingRequests.map((booking, index) => (
                <BookingRow key={index} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PgBookingRequests;
