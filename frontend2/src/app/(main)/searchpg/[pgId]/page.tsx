"use client";
import Loading from "@/components/Loading";
import { decryptToken } from "@/utils/secureToken";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaWifi, FaParking, FaStar } from "react-icons/fa";
import { LuCctv } from "react-icons/lu";

interface PgDetails {
  name: string;
  address: string;
  gender: string;
  rooms: {
    type: string;
    features: {
      ac: boolean;
      furnished: boolean;
      fooding: string;
    };
    rates: {
      monthly: number;
    };
    availability: {
      count: number;
      booked: number;
    };
    pictures: string[];
  }[];
  services: {
    fooding: boolean;
    foodingType?: string[];
    ac: boolean;
    cctv: boolean;
    wifi: boolean;
    laundry: boolean;
    parking: boolean;
    security: boolean;
    otherServices: string[];
  };
  description: string;
  rating: number;
  location: {
    longitude: number;
    latitude: number;
  };
  timings: string;
  pictures: string[];
  profession: string;
}

const PgDetailsPage = ({ params }: { params: Promise<{ pgId: string }> }) => {
  const { pgId } = React.use(params);
  // const pgId = params.pgId;
  console.log(pgId);
  const [pg, setPg] = useState<PgDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingStatus, setBookingStatus] = useState<Array<string>>([]);

  useEffect(() => {
    if (pgId) {
      // Fetch the PG details from the backend using Fetch API
      const fetchPgDetails = async () => {
        try {
          const token = decryptToken(localStorage.getItem("authToken") || "");

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/get-pg-details/${pgId}`,
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
            throw new Error("Failed to fetch PG details.");
          }

          const data = await response.json();
          // console.log(data);
          setPg(data.data.pg);

          const bookedRoomTypes = data.data.booking.map(
            (booked) => booked.roomType
          );
          setBookingStatus(bookedRoomTypes);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch PG details. Please try again later.");
          setLoading(false);
        }
      };

      fetchPgDetails();
    }
  }, [pgId]);

  const handleBooking = async (
    roomType: string,
    ac: boolean,
    foodingType: string
  ) => {
    try {
      const token = decryptToken(localStorage.getItem("authToken") || "");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/create-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pgId,
            roomType,
            ac,
            foodingType,
          }),
        }
      );

      if (!response.ok) {
        console.log(response.json());
        throw new Error("Failed to request book PG.");
      }

      const data = await response.json();
      console.log(data);
      setBookingStatus((prev) => [...prev, roomType]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!pg) {
    return <div className="text-center mt-8">No PG details found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* PG Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{pg.name}</h1>
          <p className="flex items-center text-gray-500 mt-2">
            <FaMapMarkerAlt className="mr-2 text-red-600" />
            {pg.address}
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <p className="text-yellow-400 flex items-center text-xl font-bold">
            <FaStar className="mr-2" />
            {pg.rating}
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {pg.pictures?.length > 0 &&
          pg.pictures.map((pic, index) => (
            <div
              key={index}
              className="relative h-48 w-full overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={pic || "/midlandpark.jpg"}
                alt={`PG Image ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Description</h2>
        <p className="mt-2 text-gray-700">{pg.description}</p>
      </div>

      {/* Rooms */}
      <div className="mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Available Rooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {pg.rooms?.length > 0 &&
            pg.rooms?.map((room, index) => (
              <div
                key={index}
                className="relative border rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <button
                  className={`absolute right-4 px-4 py-2 rounded ${
                    bookingStatus.includes(room.type)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-800 text-white"
                  }`}
                  onClick={() =>
                    !bookingStatus.includes(room.type) &&
                    handleBooking(
                      room.type,
                      room.features.ac,
                      room.features.fooding || "N/A"
                    )
                  }
                  disabled={bookingStatus.includes(room.type)}
                >
                  {bookingStatus.includes(room.type)
                    ? "Request Sent"
                    : "Request Booking"}
                </button>
                <h3 className="text-lg font-bold text-gray-800 capitalize">
                  {room.type} Room
                </h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>AC: {room.features.ac ? "Yes" : "No"}</li>
                  <li>Furnished: {room.features.furnished ? "Yes" : "No"}</li>
                  <li>Monthly Rent: ₹{room.rates.monthly}</li>
                  <li>
                    Availability: {room.availability.count} available,{" "}
                    {room.availability.booked} booked
                  </li>
                </ul>
                {/* Room Pictures */}
                {room.pictures.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Room Pictures:
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {room.pictures.map((pic, idx) => (
                        <div
                          key={idx}
                          className="relative h-20 w-full rounded overflow-hidden"
                        >
                          <img
                            src={pic || "/midlandpark.jpg"}
                            alt={`Room Picture ${idx + 1}`}
                            // width={100}
                            // height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Services */}
      <div className="mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {pg.services?.fooding && (
            <p className="flex items-center text-gray-600">
              <FaStar className="mr-2 text-green-500" />
              Fooding: {pg.services.foodingType?.join(", ")}
            </p>
          )}
          {pg.services?.wifi && (
            <p className="flex items-center text-gray-600">
              <FaWifi className="mr-2 text-blue-500" />
              WiFi Available
            </p>
          )}
          {pg.services?.cctv && (
            <p className="flex items-center text-gray-600">
              <LuCctv className="mr-2 text-gray-800" />
              CCTV Surveillance
            </p>
          )}
          {pg.services?.parking && (
            <p className="flex items-center text-gray-600">
              <FaParking className="mr-2 text-gray-800" />
              Parking Available
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Location</h2>
        <p className="mt-2 text-gray-700">
          Latitude: {pg.location?.latitude}, Longitude: {pg.location?.longitude}
        </p>
      </div>
    </div>
  );
};

export default PgDetailsPage;
