"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { decryptToken } from "@/utils/secureToken";

// app/pgowner/page.tsx
const PgOwnerHome = () => {
  const { currentUserData } = useAuth();
  const [pgListed, setPgListed] = useState<Array<object>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken"));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pgowner/get-pg`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch PG details.");
        }

        // console.log(response.json());
        const data = await response.json();
        console.log(data);
        setPgListed(data.data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch PG details. Please try again later.");
        setLoading(false);
      }
    };
    fetchPgs();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {currentUserData?.name || "PG Owner"}!
      </h1>
      <p>Select an option from the navbar to manage your PG.</p>
      <h2 className="text-xl font-semibold mt-4">PG Added</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pgListed?.length > 0 &&
          pgListed.map((pg) => (
            <div
              key={pg?.name}
              className="group relative bg-white shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
            >
              <div className="flex space-x-6">
                <img
                  src={pg?.pictures[0]}
                  alt={pg?.name}
                  className="w-1/3 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition">
                    {pg?.name}
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">{pg?.address}</p>
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-gray-700 font-medium">
                      {pg?.rating}
                    </span>
                  </div>
                  <p
                    className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-md ${
                      pg?.isAdminVerified
                        ? "text-green-800 bg-green-200"
                        : "text-gray-600 bg-gray-200"
                    }`}
                  >
                    {pg?.isAdminVerified ? "Admin Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PgOwnerHome;
