/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { FaArrowRight, FaBell, FaMapMarkerAlt } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import Image from "next/image";
import { decryptToken } from "@/utils/secureToken";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Page: React.FC = () => {
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  // Dashboard Stats & Chart Data State
  const [stats, setStats] = useState([
    { title: "Booking Request", value: 0 },
    { title: "Booked", value: 0 },
    { title: "Total PG", value: 0 },
    { title: "Total Employees", value: 0 },
    { title: "Total Rooms", value: 0 },
    // You can add more stats like Total Employees, Total Rooms if desired.
  ]);
  const [labels, setLabels] = useState<string[]>([]);
  const [bookingRequestData, setBookingRequestData] = useState<number[]>([]);
  const [bookedData, setBookedData] = useState<number[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(false);
  const [members, setMembers] = useState<string[]>([]);

  // Fetch Dashboard Data (stats + chart data)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");
        setLoadingDashboard(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/dashboard-stats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await response.json();
        // Update stats based on your API structure
        setStats([
          { title: "Booking Request", value: data.data.totalBookingCount },
          { title: "Booked", value: data.data.totalBookedPgCount },
          { title: "Total PG", value: data.data.totalPgCount },
          { title: "Total Employees", value: data.data.totalEmployeeCount },
          { title: "Total Rooms", value: data.data.totalRoomCount },
        ]);
        setLabels(data.bookingRequest?.labels || []);
        setBookingRequestData(data.bookingRequest?.data || []);
        setBookedData(data.booked?.data || []);
      } catch (err) {
        console.error("Dashboard data error:", err.message);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data objects
  const bookingRequestChartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Booking Request",
        data: bookingRequestData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const bookedChartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Booked",
        data: bookedData,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Fetch members (employees)
  useEffect(() => {
    const fetchMembers = async () => {
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
        if (!response.ok) throw new Error("Failed to fetch employees.");
        const data = await response.json();
        setMembers(data?.data || []);
      } catch (err) {
        console.error("Members fetch error:", err.message);
      }
    };

    fetchMembers();
  }, []);

  // Static chart & summary UI as provided, updated to use dynamic data
  return (
    <div className="flex-grow bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-[17px] font-semibold">Hello Admin</h1>
        <button className="relative bg-gray-100 p-3 rounded-full hover:bg-gray-200">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
        </button>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between relative items-center mt-[50px]">
        <h1 className="text-2xl font-semibold">Summary</h1>

        {/* Popup button and handling */}
        <div className="relative flex gap-x-3">
          <Link
            href="/admin/new-booking-request"
            className="relative text-sm bg-gray-100 p-2 rounded-[14px] hover:bg-gray-200"
          >
            <p>New Booking</p>
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
          </Link>
          <Link
            href="/admin/pg-requests"
            className="relative text-sm bg-gray-100 p-2 ml-4 rounded-[14px] hover:bg-gray-200"
          >
            <p>New PG Request</p>
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
          </Link>
          <Link
            href="/admin/employees"
            className="relative text-sm bg-gray-100 p-2 ml-4 rounded-[14px] hover:bg-gray-200"
          >
            <p>Employees</p>
          </Link>
          <Link
            href="/admin/pgowners"
            className="relative text-sm bg-gray-100 p-2 ml-4 rounded-[14px] hover:bg-gray-200"
          >
            <p>PG Owners</p>
          </Link>

          {/* Popup (if needed) */}
          {isPopupOpen && (
            <>
              <div
                className="fixed inset-0 bg-black opacity-50 z-10"
                onClick={() => setPopupOpen(false)}
              ></div>
              <div className="absolute mt-4 right-0 left-auto bg-white p-6 rounded-lg shadow-lg max-w-md w-80 z-20">
                <div className="flex justify-end">
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="text-lg text-black bg-gray-50 hover:bg-gray-200 w-8 h-8 rounded-full"
                  >
                    X
                  </button>
                </div>
                <div className="flex">
                  <Image
                    src="/PgImage.png"
                    alt="PgImage"
                    width={500}
                    height={500}
                    className="w-16 h-16"
                  />
                  <div className="ml-2 flex flex-col">
                    <h2 className="text-xl font-semibold">Bla Bla PG</h2>
                    <span className="flex">
                      <FaMapMarkerAlt className="text-gray-900 mt-1 text-lg mr-1" />
                      <span className="text-lg">Kolkata</span>
                    </span>
                    <p className="text-gray-700">₹ 5,000</p>
                  </div>
                </div>
                <div className="mt-4">
                  <select className="mt-4 w-full p-2 border border-gray-300 rounded">
                    {members.map((member, index) => (
                      <option key={index} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                  <div className="mt-6 flex justify-between w-full">
                    <button
                      onClick={() => setPopupOpen(false)}
                      className="bg-red-400 hover:bg-red-500 text-white py-2 w-32 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setPopupOpen(false)}
                      className="bg-green-400 hover:bg-green-500 text-white py-2 w-32 px-4 rounded ml-4"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-2 text-white bg-blue-600 grid grid-cols-3 gap-5 py-16 rounded-[16px]">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`ml-8 ${
              index !== stats.length - 1 ? "border-r border-white" : ""
            }`}
          >
            <h2 className="text-lg">{stat.title}</h2>
            <div className="inline-flex items-center">
              <p className="text-4xl font-bold">
                {stat.value.toString().padStart(2, "0")}
              </p>
              <FaArrowRight className="text-blue-600 bg-white text-normal text-md w-6 h-6 p-1 rounded-full ml-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Booking Request and Booked Graphs */}
      <div className="mt-6 grid grid-cols-2 gap-6 mb-16">
        <div className="bg-[#F7F7F7] p-6 rounded shadow-md mb-4">
          <h3 className="mb-4 text-lg font-semibold">Booking Request</h3>
          <Line
            data={bookingRequestChartData}
            options={{
              scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } },
              },
            }}
          />
        </div>
        <div className="bg-[#F7F7F7] p-6 rounded shadow-md mb-4">
          <h3 className="mb-4 text-lg font-semibold">Booked</h3>
          <Line
            data={bookedChartData}
            options={{
              scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
