"use client";

import { decryptToken } from "@/utils/secureToken";
import Image from "next/image";
import { useState, useEffect } from "react";

function PgVerificationRequests() {
  const [pgRequests, setPgRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPgRequests = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employee/get-pgVerification-requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch PG verification requests.");
        }

        const data = await response.json();
        setPgRequests(data?.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPgRequests();
  }, []);

  const handleVerify = async (pgId: string) => {
    try {
      const token = decryptToken(localStorage.getItem("authToken") || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employee/toggle-pgVerfication`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pgId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify PG.");
      }

      // Refresh the PG list after verification
      setPgRequests((prev) => prev.filter((pg) => pg.uuid !== pgId));
      alert("PG verified successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        PG Verification Requests
      </h1>

      {loading && <p className="text-gray-500">Loading requests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && pgRequests.length === 0 && (
        <p className="text-gray-600">No verification requests available.</p>
      )}

      {!loading && pgRequests.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {pgRequests.map((pg) => (
            <li
              key={pg.uuid}
              className="flex items-center justify-between mt-2 py-4 px-4 bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center">
                <Image
                  src={pg.pictures[0] || "/placeholder.jpg"}
                  alt={pg.name}
                  className="w-16 h-16 rounded-md object-cover mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {pg.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{pg.address}</p>
                  <div className="flex gap-x-1 mt-1 items-center">
                    Owner:
                    <p className="text-sm text-gray-500">
                      {pg.owner?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {pg.owner?.email || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Phone: {pg.owner?.phone || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Address: {pg.owner?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleVerify(pg.uuid)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PgVerificationRequests;
