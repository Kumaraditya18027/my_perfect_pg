"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import { decryptToken } from "@/utils/secureToken";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChartBar, FaBox, FaCog, FaSignOutAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const router = useRouter();
  const [activeIcon, setActiveIcon] = useState("summary");
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const token = decryptToken(localStorage.getItem("authToken"));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed!");
      }

      await response.json();
      logout();
    } catch (err: any) {
      console.log(err.message || "Something went wrong. Please try again.");
      toast.success("Logout failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleIconClick = (iconName) => {
    if (iconName === "logout") {
      handleLogout();
      return;
    } else {
      setActiveIcon(iconName);
      router.push(`/admin/${iconName}`);
    }
  };

  const NavIcon = ({ icon: Icon, name, ariaLabel }) => (
    <button
      className={`p-3 rounded-full transition-all duration-300 focus:outline-none ${
        activeIcon === name ? "bg-blue-500 text-white" : "text-gray-600"
      }`}
      onClick={() => handleIconClick(name)}
      aria-label={ariaLabel}
    >
      <Icon className="text-2xl" />
    </button>
  );

  return (
    <aside
      className="fixed left-12 flex flex-col items-center justify-start bg-bgGray shadow-lg p-4 transition-all duration-300 sm:w-20 w-16"
      style={{ height: "694px", marginTop: "3rem", borderRadius: "24px" }}
    >
      <ToastContainer />
      {/* Profile Picture */}
      <div className="mb-4">
        <button
          className="w-12 h-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="User profile"
        >
          <img
            src="https://th.bing.com/th/id/OIP.7G6XwS4BzQWHQl-VoyvCFgHaHa?rs=1&pid=ImgDetMain" // Replace with actual profile picture URL
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-6">
        <NavIcon icon={FaChartBar} name="summary" ariaLabel="View charts" />
        <NavIcon icon={FaBox} name="bookedpg" ariaLabel="View content" />
        <NavIcon icon={FaCog} name="settings" ariaLabel="Open settings" />
        <NavIcon icon={FaSignOutAlt} name="logout" ariaLabel="Logout" />
      </nav>
    </aside>
  );
};

export default Sidebar;
