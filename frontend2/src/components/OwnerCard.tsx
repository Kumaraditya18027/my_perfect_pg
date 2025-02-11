// ──────────────────────────────────────────────────────────────
// OwnerCard Component
// ──────────────────────────────────────────────────────────────
"use client";
import { OwnerCardProps } from "@/types";
import { useEffect, useRef } from "react";

const OwnerCard: React.FC<OwnerCardProps> = ({
  owner,
  userType,
  activeOptionsOwnerId,
  setActiveOptionsOwnerId,
  openVerifyModal,
}) => {
  const optionsModalRef = useRef<HTMLDivElement>(null);

  // Toggle the options modal for this owner
  const handleOptionsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActiveOptionsOwnerId(
      activeOptionsOwnerId === owner.uuid ? null : owner.uuid
    );
  };

  // Close the modal if a click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsModalRef.current &&
        !optionsModalRef.current.contains(event.target as Node)
      ) {
        setActiveOptionsOwnerId(null);
      }
    };

    if (activeOptionsOwnerId === owner.uuid) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [activeOptionsOwnerId, owner.uuid, setActiveOptionsOwnerId]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative">
      {/* Owner Info */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{owner.name}</h2>
        <div className="mt-2 space-y-1 text-gray-600">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {owner.email || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span> {owner.phone || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Address:</span>{" "}
            {owner.address || "N/A"}
          </p>
        </div>
      </div>

      {/* Aadhaar Section */}
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

      {/* Verification Status / Verify Button */}
      <div className="flex items-center justify-between">
        {userType === "pgowners" &&
          (owner.isPGOwnerVerified ? (
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
          ))}
      </div>

      {/* Options Button */}
      <button
        className="text-xl absolute top-5 right-5 text-gray-800 hover:text-gray-700 transition"
        onClick={handleOptionsClick}
      >
        ⋮
      </button>
      {activeOptionsOwnerId === owner.uuid && (
        <div
          ref={optionsModalRef}
          className="absolute top-[4%] right-[7%] border-t border-gray-300 shadow-md flex-col gap-y-2 px-5 py-3 rounded-md bg-white"
        >
          <button className="w-full text-left border-b border-gray-200 py-1">
            Edit
          </button>
          <button className="w-full text-left py-1">Delete</button>
        </div>
      )}
    </div>
  );
};

export default OwnerCard;
