"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChartBar, FaBox, FaCog } from "react-icons/fa";

const Sidebar = () => {
  const router = useRouter();
  const [activeIcon, setActiveIcon] = useState("summary");

  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);
    router.push(`/admin/${iconName}`);
  };

  const NavIcon = ({ icon: Icon, name, ariaLabel }) => (
    <button
      className={`p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
      </nav>
    </aside>
  );
};

export default Sidebar;
