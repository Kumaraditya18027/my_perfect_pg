"use client";

import { decryptToken } from "@/utils/secureToken";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Users() {
  const { userType } = useParams();
  const [pgOwners, setPgOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // Modal & form states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    console.log(userType);

    const fetchPgRequests = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken") || "");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/get-${userType}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${userType}`);
        }

        const data = await response.json();
        setPgOwners(data?.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPgRequests();
  }, [userType]);

  const handleVerify = async (
    ownerId: string,
    username: string,
    password: string
  ) => {
    try {
      setSubmissionLoading(true);
      const token = decryptToken(localStorage.getItem("authToken") || "");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/verify-pgowner`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: ownerId, username, password }),
        }
      );

      if (!response.ok) {
        console.log(response.json());
        throw new Error("Failed to verify PG Owner.");
      }

      // Refresh the list
      setPgOwners((prev) =>
        prev.map((owner) =>
          owner.uuid === ownerId ? { ...owner, isPGOwnerVerified: true } : owner
        )
      );

      toast.success("PG Owner is verified successfully !");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmissionLoading(false);
      closeModal();
    }
  };

  const openVerifyModal = (owner) => {
    setSelectedOwner(owner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOwner(null);
    setUsername("");
    setPassword("");
  };

  // Filter owners based on the selected filter option
  const filteredOwners = pgOwners.filter((owner) => {
    if (filter === "verified") return owner.isPGOwnerVerified;
    if (filter === "unverified") return !owner.isPGOwnerVerified;
    if (filter === "noAadhaar") return !owner.adhaar;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {userType.toLocaleString().toUpperCase()}
      </h1>
      {/* Filter Section */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium text-gray-700">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Users</option>
          <option value="verified">Verified Users</option>
          <option value="unverified">Unverified Users</option>
          <option value="noAadhaar">No Aadhaar Uploaded</option>
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredOwners.length === 0 && (
        <p className="text-gray-600">No PG Owners available.</p>
      )}

      {!loading && filteredOwners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwners.map((owner) => (
            <div
              key={owner.uuid}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative"
            >
              {/* Owner Info */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {owner.name}
                </h2>
                <div className="mt-2 space-y-1 text-gray-600">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {owner.email || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    {owner.phone || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Address:</span>{" "}
                    {owner.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Aadhaar File Section */}
              <div className="mb-4">
                {owner.adhaar ? (
                  <a
                    href={owner.adhaar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V3.75A1.5 1.5 0 0 0 14.25 2.25H5.25A1.5 1.5 0 0 0 3.75 3.75v16.5a1.5 1.5 0 0 0 1.5 1.5h10.5m0-15L21 12m0 0-5.25 5.25M21 12H9"
                      />
                    </svg>
                    View Aadhaar
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">
                    No Aadhaar file uploaded
                  </span>
                )}
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between">
                {owner.isPGOwnerVerified ? (
                  <div className="flex items-center text-green-600 font-medium">
                    ✅ Verified
                  </div>
                ) : (
                  <button
                    onClick={() => openVerifyModal(owner)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
                  >
                    Verify
                  </button>
                )}
              </div>

              {/* Options Button (for future actions) */}
              <button className="text-xl absolute top-5 right-5 text-gray-800 hover:text-gray-700 transition">
                ⋮
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Modal for setting username and password */}
      {modalOpen && selectedOwner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Set Credentials</h2>
            {/* Username Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>
            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleVerify(selectedOwner.uuid, username, password)
                }
                className={`px-4 py-2 ${
                  isSubmissionLoading
                    ? "bg-gray-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md transition`}
                disabled={isSubmissionLoading}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
