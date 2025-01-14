"use client";

import React, { useState } from "react";
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

  // Data for the charts (mock data for example purposes)
  const labels: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Yesterday",
    "Today",
  ];

  const bookingRequestData: number[] = [100, 120, 150, 180, 170, 130, 140];
  const bookedData: number[] = [60, 50, 70, 80, 75, 65, 90];

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

  const stats = [
    { title: "Booking Request", value: 1000 },
    { title: "Booked", value: 100 },
    { title: "Total PG", value: 67 },
  ];

  const members: string[] = [
    "Rajgopal Kumar",
    "Sunny Kumar",
    "Kumar Raj",
    "R Kumar",
  ];

  return (
    <div className="flex-grow bg-white p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[17px] font-semibold">Hello Rajgopal</h1>
        <button className="relative bg-gray-100 p-3 rounded-full hover:bg-gray-200">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
        </button>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between relative items-center mt-[50px]">
        <h1 className="text-2xl font-semibold">Summary</h1>

        {/* Popup button and handling */}
        <div className="relative">
          <button
            onClick={() => setPopupOpen(!isPopupOpen)}
            className="relative text-sm bg-gray-100 p-2 rounded-[14px] hover:bg-gray-200"
          >
            <p>New Booking</p>
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-blue-500 border-2 border-white rounded-full" />
          </button>

          {/* Popup */}
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
                  <img src="/PgImage.png" alt="PgImage" className="w-16 h-16" />
                  <div className="ml-2 flex flex-col">
                    <h2 className="text-xl font-semibold">Bla Bla PG</h2>
                    <span className="flex">
                      <FaMapMarkerAlt className="text-gray-900 mt-1 text-lg mr-1" />{" "}
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
      <div className="mt-2 text-white bg-blue-600 grid grid-cols-3 py-16 rounded-[16px]">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`ml-8 ${
              index !== stats.length - 1 ? "border-r border-white" : ""
            }`}
          >
            <h2 className="text-lg">{stat.title}</h2>
            <div className="inline-flex items-center">
              <p className="text-4xl font-bold">{stat.value}</p>
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
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                },
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
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
