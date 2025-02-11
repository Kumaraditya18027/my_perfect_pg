// components/BookingTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowCircleRight } from "react-icons/fa";

interface Booking {
  pg: {
    name?: string;
    address?: string;
    picture?: string;
  };
  user: {
    name?: string;
    phone?: string;
    email?: string;
  };
  assignedMember: {
    name?: string;
    phone?: string;
    email?: string;
  };
  status?: string;
}

interface BookingTableProps {
  bookedPGs: Booking[];
  pgNameFilter: string;
  setPgNameFilter: React.Dispatch<React.SetStateAction<string>>;
  employeeFilter: string;
  setEmployeeFilter: React.Dispatch<React.SetStateAction<string>>;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookedPGs,
  pgNameFilter,
  setPgNameFilter,
  employeeFilter,
  setEmployeeFilter,
}) => {
  // Filter the bookings based on PG name and Assigned Employee name.
  const filteredBookings = bookedPGs.filter((booking) => {
    const pgName = (booking.pg?.name || "").toLowerCase();
    const empName = (booking.assignedMember?.name || "").toLowerCase();
    return (
      pgName.includes(pgNameFilter.toLowerCase()) &&
      empName.includes(employeeFilter.toLowerCase())
    );
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 border-separate border-spacing-y-3">
        <thead className="bg-gray-100">
          {/* Main Header Row */}
          <tr className="text-gray-700">
            <th scope="col" className="px-4 py-3 font-semibold w-20">
              PG Image
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-32">
              PG Name
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-32">
              PG Location
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-32">
              Booker Name
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-28">
              Booker Phone
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-32">
              Booker Email
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-32">
              Assigned Employee
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-28">
              Employee Phone
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-32">
              Employee Email
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-20">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold w-16">
              Action
            </th>
          </tr>
          {/* In-Table Filter Row */}
          <tr className="bg-gray-50">
            {/* Empty cell for image column */}
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">
              <input
                type="text"
                placeholder="Filter PG Name"
                value={pgNameFilter}
                onChange={(e) => setPgNameFilter(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">
              <input
                type="text"
                placeholder="Filter Employee"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </th>
            {/* Empty cells for remaining columns */}
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking, index) => (
            <tr
              key={index}
              className="bg-white hover:bg-gray-50 transition-colors duration-300"
            >
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <Image
                    src={booking.pg?.picture || "/logo.png"}
                    alt="pg-image"
                    width={50}
                    height={50}
                    className="rounded-lg w-16 h-16 object-contain"
                  />
                </div>
              </td>
              <td className="px-4 py-3">{booking.pg?.name || "N/A"}</td>
              <td className="px-4 py-3">{booking.pg?.address || "N/A"}</td>
              <td className="px-4 py-3">{booking.user?.name || "N/A"}</td>
              <td className="px-4 py-3">{booking.user?.phone || "N/A"}</td>
              <td className="px-4 py-3">{booking.user?.email || "N/A"}</td>
              <td className="px-4 py-3">
                {booking.assignedMember?.name || "N/A"}
              </td>
              <td className="px-4 py-3">
                {booking.assignedMember?.phone || "N/A"}
              </td>
              <td className="px-4 py-3">
                {booking.assignedMember?.email || "N/A"}
              </td>
              <td className="px-4 py-3">{booking.status || "N/A"}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/bookedpg/${booking.pg?.name
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
  );
};

export default BookingTable;
