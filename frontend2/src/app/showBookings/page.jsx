"use client";

import React, { useState } from "react";
import Navbar from "@/components/MainNavbar";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Pending", time: "2:30 PM", date: "Feb 15, 2024", assignedTo: "" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", time: "4:00 PM", date: "Feb 16, 2024", assignedTo: "" },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const handleAssign = (id) => {
    if (!selectedEmployee) return alert("Please select an employee before assigning.");

    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? { ...booking, assignedTo: selectedEmployee, status: "Assigned" }
          : booking
      )
    );
    setSelectedEmployee("");
  };

  const handleAccept = (id) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? booking.assignedTo
            ? { ...booking, status: "Accepted" }
            : booking
          : booking
      )
    );
  };

  const handleReject = (id) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: "Rejected" } : booking
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Assigned: "bg-blue-100 text-blue-800",
      Accepted: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <>
    <div className="mb-8">
<Navbar/>
</div>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Booking Management Dashboard
          </h1>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{booking.name}</h2>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{booking.email}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span>{booking.date}</span>
                      <span>•</span>
                      <span>{booking.time}</span>
                    </div>
                  </div>

                  {booking.assignedTo && (
                    <div className="inline-block px-4 py-2 bg-blue-50 rounded-full">
                      <span className="text-sm text-blue-700">Assigned to: {booking.assignedTo}</span>
                    </div>
                  )}
                </div>

                {booking.status === "Pending" || booking.status === "Assigned" ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Employee</option>
                      <option value="Employee 1">Employee 1</option>
                      <option value="Employee 2">Employee 2</option>
                      <option value="Employee 3">Employee 3</option>
                    </select>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <button
                        onClick={() => handleAssign(booking.id)}
                        className="px-6 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => handleAccept(booking.id)}
                        className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                          booking.assignedTo
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                        disabled={!booking.assignedTo}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
