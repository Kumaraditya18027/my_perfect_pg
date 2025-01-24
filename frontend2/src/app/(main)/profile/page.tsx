"use client";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { decryptToken } from "@/utils/secureToken";

const COLOR_SCHEME = {
  primary: {
    light: "bg-teal-50",
    medium: "bg-teal-500",
    dark: "bg-teal-700",
    text: "text-teal-700",
    hover: "hover:bg-teal-600",
    border: "border-teal-500",
  },
  secondary: {
    light: "bg-rose-50",
    medium: "bg-rose-500",
    dark: "bg-rose-700",
    text: "text-rose-700",
    hover: "hover:bg-rose-600",
  },
  accent: "from-teal-500 to-emerald-500",
};

export default function ProfilePage() {
  const { currentUserData, editUserData } = useAuth();
  // State Management
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const [user, setUser] = useState({
    name: currentUserData?.name,
    email: currentUserData?.email,
    phone: currentUserData?.phone,
    bio: currentUserData?.bio,
    profileImage: currentUserData?.avatar,
    preferences: {
      foodType: "Vegetarian",
      roomType: "Single Occupancy",
      budget: "₹12,000 - ₹15,000",
      location: "Mumbai",
      amenities: ["WiFi", "AC", "Food", "Laundry"],
    },
    currentPG: {
      name: "Sunshine PG for Women",
      address: "123, Andheri West, Mumbai",
      rent: "₹15,000/month",
      image: "/api/placeholder/400/200",
      amenities: ["WiFi", "AC", "Food", "Laundry", "Security"],
      rating: 4.5,
      joinedDate: "Jan 2024",
    },
    bookmarks: currentUserData?.bookmarkedPg,
  });

  const handleProfileImageUpdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the uploaded file
      console.log(file);
    }
  };

  // Edit Profile Modal Component
  const EditProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Edit Profile</h3>
          <button
            onClick={() => setEditModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={currentUserData.name}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={user.phone}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={user.bio}
              rows="3"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitProfile}
              className={`px-4 py-2 text-white rounded-lg ${COLOR_SCHEME.primary.medium} ${COLOR_SCHEME.primary.hover}`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Handle edit profile
  const handleSubmitProfile = async () => {
    try {
      const token = decryptToken(localStorage.getItem("authToken"));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/edit-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...user }),
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to update profile. Please try again later.");
      }

      const data = await response.json();

      // Handle the success case (update the state, show a success message, etc.)
      console.log("Profile updated successfully:", data);
      editUserData(data.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Something went wrong. Please try again.");
    }
  };

  // Notification Component
  const Notification = ({ message }) => (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 animate-slide-up">
      <p className="text-gray-800">{message}</p>
    </div>
  );

  // Handle Profile Update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));

    setEditModalOpen(false);
    showNotification("Profile updated successfully!");
  };

  // Show Notification Helper
  const showNotification = (message) => {
    setNotificationMessage(message);
    setNotificationOpen(true);
    setTimeout(() => setNotificationOpen(false), 3000);
  };

  // Handle Bookmark Deletion
  const handleDeleteBookmark = (name) => {
    setUser((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((bookmark) => bookmark.name !== name),
    }));
    setDeleteModalOpen(false);
    showNotification("Bookmark removed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 mt-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex justify-between items-center">
          {/* Left Section: Profile Image and Details */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label
                className={`absolute bottom-0 right-0 w-8 h-8 rounded-full ${COLOR_SCHEME.primary.medium} flex items-center justify-center cursor-pointer`}
              >
                <input
                  type="file"
                  className="hidden"
                  onChange={handleProfileImageUpdate}
                  accept="image/*"
                />
                <span className="text-white text-xl">+</span>
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <p className="text-gray-500">{user.phone || ""}</p>
              <p className="mt-2 text-gray-700">
                {user.bio || "Bio not written"}
              </p>
            </div>
          </div>

          {/* Right Section: Edit Profile Button */}
          <button
            onClick={() => setEditModalOpen(true)}
            className={`px-4 py-2 text-white rounded-lg bg-gradient-to-r ${COLOR_SCHEME.accent}`}
          >
            Edit Profile
          </button>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">My Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(user.preferences).map(([key, value]) => (
              <div
                key={key}
                className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}
              >
                <h4 className="font-medium text-gray-700 capitalize">{key}</h4>
                <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
                  {Array.isArray(value) ? value.join(", ") : value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Current PG Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Current PG</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={user.currentPG.image}
              alt={user.currentPG.name}
              className="w-full md:w-1/3 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">
                    {user.currentPG.name}
                  </h4>
                  <p className="text-gray-500 mt-1">{user.currentPG.address}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${COLOR_SCHEME.primary.light} ${COLOR_SCHEME.primary.text}`}
                >
                  {user.currentPG.rent}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {user.currentPG.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full ${COLOR_SCHEME.primary.light} ${COLOR_SCHEME.primary.text} text-sm`}
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-yellow-400">★</span>
                <span className="font-medium">{user.currentPG.rating}</span>
                <span className="text-gray-500">
                  • Joined {user.currentPG.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarked PGs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Bookmarked PGs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentUserData?.bookmarkedPg?.length > 0 &&
              currentUserData.bookmarkedPg.map((bookmark) => (
                <div
                  key={bookmark.name}
                  className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="flex space-x-4">
                    <img
                      src={bookmark.pictures[0]}
                      alt={bookmark.name}
                      className="w-1/3 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{bookmark.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {bookmark.address}
                      </p>
                      <div
                        className={`mt-2 ${COLOR_SCHEME.primary.text} font-medium`}
                      >
                        {bookmark.price}
                      </div>
                      <div className="mt-2 flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span>{bookmark.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBookmark(bookmark.name);
                        setDeleteModalOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {editModalOpen && <EditProfileModal />}

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-4">Remove Bookmark</h3>
            <p className="text-gray-600">
              Are you sure you want to remove this PG from your bookmarks?
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBookmark(selectedBookmark)}
                className={`px-4 py-2 text-white rounded-lg ${COLOR_SCHEME.secondary.medium} ${COLOR_SCHEME.secondary.hover}`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notificationOpen && <Notification message={notificationMessage} />}
    </div>
  );
}
