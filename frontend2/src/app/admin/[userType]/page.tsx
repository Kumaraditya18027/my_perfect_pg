"use client";

import { decryptToken } from "@/utils/secureToken";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { User, EmployeeFormData } from "@/types";
import OwnerCard from "@/components/OwnerCard";

interface AddEmployeeFormProps {
  onClose: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "employee",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes for both text inputs and select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = decryptToken(localStorage.getItem("authToken") || "");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/add-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add employee");
      }

      const data = await response.json();
      toast.success(data.message || "Employee added successfully!");
      // Clear the form and close the modal
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "employee",
      });
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Employee
      </h2>
      {error && (
        <p className="mb-4 text-center text-red-500 text-sm">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter employee name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter employee email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="employee">Employee</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors font-medium"
        >
          {loading ? "Adding Employee..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

function Users() {
  const { userType } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // Verify Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<User>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmissionLoading, setSubmissionLoading] = useState(false);

  // Add Employee Modal State
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState<boolean>(false);

  // State to track which owner's options modal is open
  const [activeOptionsOwnerId, setActiveOptionsOwnerId] = useState<
    string | null
  >(null);

  // Fetch owners (or employees/pgowners) based on userType
  useEffect(() => {
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
        setUsers(data?.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPgRequests();
  }, [userType]);

  // Handle verify action for PG Owners
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
        throw new Error("Failed to verify PG Owner.");
      }
      // Update the owner list
      setUsers((prev) =>
        prev.map((owner) =>
          owner.uuid === ownerId ? { ...owner, isPGOwnerVerified: true } : owner
        )
      );
      toast.success("PG Owner is verified successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmissionLoading(false);
      closeModal();
    }
  };

  // Functions to open/close the verify modal
  const openVerifyModal = (owner: User) => {
    setSelectedOwner(owner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOwner(null);
    setUsername("");
    setPassword("");
  };

  // Functions to open/close the add employee modal
  const openEmployeeModal = () => {
    setEmployeeModalOpen(true);
  };

  const closeEmployeeModal = () => {
    setEmployeeModalOpen(false);
  };

  // Filter owners based on the selected option
  const filteredOwners = users.filter((owner) => {
    if (filter === "verified") return owner.isPGOwnerVerified;
    if (filter === "unverified") return !owner.isPGOwnerVerified;
    if (filter === "noAadhaar") return !owner.adhaar;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {userType.toString().toUpperCase()}
      </h1>
      {/* Filter Section & Add Employee Button */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <label className="font-medium text-gray-700 mr-3">Filter:</label>
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
        {userType === "employees" && (
          <button
            onClick={openEmployeeModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Employee
          </button>
        )}
      </div>

      {/* Add Employee Modal */}
      {userType === "employees" && isEmployeeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-end">
              <button
                onClick={closeEmployeeModal}
                className="text-xl text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
            </div>
            <AddEmployeeForm onClose={closeEmployeeModal} />
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && filteredOwners.length === 0 && (
        <p className="text-gray-600">No PG Owners available.</p>
      )}
      {/* Owners Grid */}
      {!loading && filteredOwners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwners.map((owner) => (
            <OwnerCard
              key={owner.uuid}
              owner={owner}
              userType={userType}
              activeOptionsOwnerId={activeOptionsOwnerId}
              setActiveOptionsOwnerId={setActiveOptionsOwnerId}
              openVerifyModal={openVerifyModal}
            />
          ))}
        </div>
      )}

      {/* Verify Modal */}
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
