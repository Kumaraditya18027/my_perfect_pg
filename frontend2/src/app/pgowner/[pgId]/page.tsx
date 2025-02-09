"use client";
import { decryptToken } from "@/utils/secureToken";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type Room = {
  type: "single" | "double" | "triple";
  features: {
    ac: boolean;
    furnished: boolean;
  };
  rates: {
    monthly: number;
  };
  availability: {
    count: number;
    booked: number;
  };
  pictures: string[];
};

export default function AddRoomPage({
  params,
}: {
  params: Promise<{ pgId: string }>;
}) {
  const router = useRouter();
  const { pgId } = React.use(params);
  // const pgId = params.pgId;
  console.log(pgId);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Room State
  const [newRoom, setNewRoom] = useState<Room>({
    type: "single",
    features: { ac: false, furnished: false },
    rates: { monthly: 0 },
    availability: { count: 0, booked: 0 },
    pictures: [],
  });

  // Fetch Existing Rooms
  useEffect(() => {
    if (!pgId) return;

    const fetchRooms = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pgowner/${pgId}/get-rooms`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        console.log("Data : ", data);
        setRooms(data?.data?.rooms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [pgId]);

  // Handle New Room Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setNewRoom((prev) => ({
        ...prev,
        features: { ...prev.features, [name]: checked },
      }));
    } else if (name.startsWith("rates") || name.startsWith("availability")) {
      const key = name.split(".")[1];
      setNewRoom((prev) => ({
        ...prev,
        [name.startsWith("rates") ? "rates" : "availability"]: {
          ...prev[name.startsWith("rates") ? "rates" : "availability"],
          [key]: Number(value),
        },
      }));
    } else {
      setNewRoom((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  // Handling the file input change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewRoom((prev) => ({
        ...prev,
        pictures: Array.from(e.target.files), // Convert FileList to array
      }));
    }
  };

  // Handle Form Submission
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a FormData object to handle both room data and images
    const formData = new FormData();

    // Append the room data to FormData
    formData.append("pgId", pgId);
    formData.append("type", newRoom.type);
    formData.append("features", JSON.stringify(newRoom.features));
    formData.append("rates", JSON.stringify(newRoom.rates));
    formData.append("availability", JSON.stringify(newRoom.availability));

    // Append the room images (assuming `newRoom.pictures` is an array of image files)
    if (newRoom.pictures && newRoom.pictures.length > 0) {
      newRoom.pictures.forEach((file: File) => {
        formData.append("pictureFiles", file);
      });
    }

    try {
      const token = decryptToken(localStorage.getItem("authToken") || "");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pgowner/add-room`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      //   console.log(res.json());
      if (!res.ok) throw new Error("Failed to add room");
      const data = await res.json();

      // Update the room list with the newly added room
      setRooms((prev) => [...prev, data.room]);

      // Reset the form fields after successful submission
      setNewRoom({
        type: "single",
        features: { ac: false, furnished: false },
        rates: { monthly: 0 },
        availability: { count: 0, booked: 0 },
        pictures: [],
      });

      router.refresh();
    } catch (err) {
      console.error("Error adding room:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Rooms for PG</h1>
      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm bg-gray-50"
            >
              {/* Room Images */}
              {room.pictures?.length > 0 ? (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {room.pictures.map((imageUrl, imageIndex) => (
                    <div key={imageIndex} className="w-full h-40">
                      <img
                        src={imageUrl}
                        alt={`${room.type} room image ${imageIndex + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No images available</p>
              )}

              <p>
                <strong>Type:</strong> {room.type}
              </p>
              <p>
                <strong>AC:</strong> {room.features.ac ? "Yes" : "No"}
              </p>
              <p>
                <strong>Furnished:</strong>{" "}
                {room.features.furnished ? "Yes" : "No"}
              </p>
              <p>
                <strong>Monthly Rate:</strong> ₹{room.rates.monthly}
              </p>
              <p>
                <strong>Available:</strong> {room.availability.count}
              </p>
              <p>
                <strong>Booked:</strong> {room.availability.booked}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mt-8">Add New Room</h2>
      <form
        onSubmit={handleAddRoom}
        className="space-y-4 mt-4 max-w-[30rem] bg-indigo-100 p-5 rounded"
      >
        <div>
          <label className="block">Room Type</label>
          <select
            name="type"
            value={newRoom.type}
            onChange={(e) =>
              setNewRoom((prev) => ({
                ...prev,
                type: e.target.value as "single" | "double" | "triple",
              }))
            }
            className="border rounded px-3 py-2 w-full"
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </div>

        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              name="ac"
              checked={newRoom.features.ac}
              onChange={handleInputChange}
            />
            AC
          </label>
          <label>
            <input
              type="checkbox"
              name="furnished"
              checked={newRoom.features.furnished}
              onChange={handleInputChange}
            />
            Furnished
          </label>
        </div>

        <div>
          <label className="block">Monthly Rate (₹)</label>
          <input
            type="number"
            name="rates.monthly"
            value={newRoom.rates.monthly}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block">Available Rooms</label>
          <input
            type="number"
            name="availability.count"
            value={newRoom.availability.count}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {/* File input for pictures */}
        <div>
          <label className="block">Upload Room Pictures</label>
          <input
            type="file"
            name="pictures"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded px-3 py-2 w-full"
          />
          {newRoom.pictures.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium">Selected Pictures:</h3>
              <ul>
                {Array.from(newRoom.pictures).map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Room
        </button>
      </form>
    </div>
  );
}
