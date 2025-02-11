"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { decryptToken } from "@/utils/secureToken";
import Image from "next/image";

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
  const [preferences, setPreferences] = useState({
    gender: "female",
    roomType: "single",
    ac: true,
    foodType: "veg",
    budget: [10000, 15000],
    amenities: ["wifi", "laundry"],
    location: "",
  });
  const [isEditPreferencesOpen, setEditPreferencesOpen] =
    useState<boolean>(false);
  const [editPreferences, setEditPreferences] = useState(preferences);

  const [currentBooking, setCurrentBooking] = useState(null);

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

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken"));
        const bookingResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/get-my-bookings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!bookingResponse.ok) {
          throw new Error("Failed to fetch booking details.");
        }

        const data = await bookingResponse.json();
        console.log(data);
        setCurrentBooking(data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookingData();
  }, []);

  // When opening the modal, initialize editPreferences from the current preferences
  const openEditPreferencesModal = () => {
    setEditPreferences(preferences);
    setEditPreferencesOpen(true);
  };

  // Handle form submission
  const handleEditPreferencesSubmit = (e) => {
    e.preventDefault();
    // Update the main preferences state with the new values
    setPreferences(editPreferences);
    setEditPreferencesOpen(false);
  };

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
              defaultValue={currentUserData?.name}
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
              defaultValue={user?.email}
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
              defaultValue={user?.phone}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={user?.bio}
              rows={3}
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

  // Add Preferences Section
  const PreferencesSection = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6">My Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}>
          <h4 className="font-medium text-gray-700">Gender</h4>
          <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
            {preferences.gender}
          </p>
        </div>
        <div className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}>
          <h4 className="font-medium text-gray-700">Room Type</h4>
          <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
            {preferences.roomType}
          </p>
        </div>
        <div className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}>
          <h4 className="font-medium text-gray-700">AC Preference</h4>
          <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
            {preferences.ac ? "AC Required" : "Non-AC Okay"}
          </p>
        </div>
        <div className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}>
          <h4 className="font-medium text-gray-700">Food Type</h4>
          <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
            {preferences.foodType}
          </p>
        </div>
        <div className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}>
          <h4 className="font-medium text-gray-700">Budget</h4>
          <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
            ₹{preferences.budget[0]} - ₹{preferences.budget[1]}
          </p>
        </div>
        <div className={`${COLOR_SCHEME.primary.light} rounded-lg p-4`}>
          <h4 className="font-medium text-gray-700">Amenities</h4>
          <p className={`mt-1 ${COLOR_SCHEME.primary.text}`}>
            {preferences.amenities.join(", ")}
          </p>
        </div>
      </div>
      <button
        onClick={openEditPreferencesModal}
        className={`mt-6 px-4 py-2 text-white rounded-lg bg-gradient-to-r ${COLOR_SCHEME.accent}`}
      >
        Edit Preferences
      </button>
    </div>
  );

  // Current PG Booking Section
  const CurrentPgSection = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6">Current PG Booking</h3>
      {currentBooking && currentBooking.length > 0 ? (
        currentBooking.map((cb, index) => {
          let status, statusClass;
          switch (cb.status) {
            case "pending":
              status = "Pending";
              statusClass = "bg-yellow-300 text-yellow-700";
              break;
            case "assigned":
              status = "Ongoing";
              statusClass = "bg-green-200 text-green-600";
              break;
            default:
              status = "Pending";
              statusClass = "bg-yellow-300 text-yellow-700";
              break;
          }
          return (
            <div className="flex flex-col md:flex-row gap-6 mt-4" key={index}>
              <Image
                src={cb.pg.pictures[0] || "/logo.png"}
                alt={cb.pg.name}
                width={500}
                height={500}
                className="w-40 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">{cb.pg.name}</h4>
                    <p className="text-gray-500 mt-1">{cb.pg.address}</p>
                    <div className="mt-2">
                      <span
                        className={`${COLOR_SCHEME.primary.text} font-medium`}
                      >
                        Room Type: {cb.roomType}
                      </span>
                      <span className="mx-2">•</span>
                      <span className={`${COLOR_SCHEME.primary.text}`}>
                        Food: {cb.foodingType}
                      </span>
                      <span className="mx-2">•</span>
                      <span className={`${COLOR_SCHEME.primary.text}`}>
                        AC: {cb.ac ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${statusClass}`}>
                    {status}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">No active bookings found</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 mt-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex justify-between items-center">
          {/* Left Section: Profile Image and Details */}
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Image
                src={user.profileImage || "/logo.png"}
                alt="Profile"
                width={500}
                height={500}
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

        {/* Add Preferences Section */}
        <PreferencesSection />

        {/* Current PG Section */}
        <CurrentPgSection />

        {/* Bookmarked PGs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Bookmarked PGs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentUserData?.bookmarkedPg?.length > 0 ? (
              currentUserData.bookmarkedPg.map((bookmark) => (
                <div
                  key={bookmark.name}
                  className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="flex space-x-4">
                    <Image
                      src={bookmark.pictures[0] || "/logo.png"}
                      alt={bookmark.name}
                      width={500}
                      height={500}
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
              ))
            ) : (
              <p className="text-gray-500">No bookmarked pgs available</p>
            )}
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

      {/* Edit Preferences Modal */}
      {isEditPreferencesOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Preferences</h3>
            <form onSubmit={handleEditPreferencesSubmit}>
              {/* Gender */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Gender
                </label>
                <select
                  value={editPreferences.gender}
                  onChange={(e) =>
                    setEditPreferences({
                      ...editPreferences,
                      gender: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Room Type */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Room Type
                </label>
                <select
                  value={editPreferences.roomType}
                  onChange={(e) =>
                    setEditPreferences({
                      ...editPreferences,
                      roomType: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                </select>
              </div>
              {/* AC Preference */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="ac"
                  checked={editPreferences.ac}
                  onChange={(e) =>
                    setEditPreferences({
                      ...editPreferences,
                      ac: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="ac" className="text-gray-700 font-medium">
                  AC Required
                </label>
              </div>
              {/* Food Type */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Food Type
                </label>
                <select
                  value={editPreferences.foodType}
                  onChange={(e) =>
                    setEditPreferences({
                      ...editPreferences,
                      foodType: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {/* Budget */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Min Budget
                  </label>
                  <input
                    type="number"
                    value={editPreferences.budget[0]}
                    onChange={(e) => {
                      const newBudget = [...editPreferences.budget];
                      newBudget[0] = Number(e.target.value);
                      setEditPreferences({
                        ...editPreferences,
                        budget: newBudget,
                      });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Max Budget
                  </label>
                  <input
                    type="number"
                    value={editPreferences.budget[1]}
                    onChange={(e) => {
                      const newBudget = [...editPreferences.budget];
                      newBudget[1] = Number(e.target.value);
                      setEditPreferences({
                        ...editPreferences,
                        budget: newBudget,
                      });
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {/* Amenities */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={editPreferences.amenities.join(", ")}
                  onChange={(e) =>
                    setEditPreferences({
                      ...editPreferences,
                      amenities: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Location */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editPreferences.location}
                  onChange={(e) =>
                    setEditPreferences({
                      ...editPreferences,
                      location: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditPreferencesOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notificationOpen && <Notification message={notificationMessage} />}
    </div>
  );
}
