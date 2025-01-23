// import Navbar from "@/components/Navbar2";
"use client";
import { decryptToken } from "@/utils/secureToken";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface PgOverviewDetails {
  id: string;
  name: string;
  address: string;
  gender: string;
  price: number;
  amenities: string[];
  roomTypes: string[];
  rating: number;
  timings: string;
  latitude: number;
  longitude: number;
  images: string[];
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PGShowcase = () => {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: "all",
    roomType: "all",
    gender: "all",
  });
  const [searchPg, setSearchPg] = useState("");
  const [sortPg, setSortPg] = useState("recommended");

  const [pg, setPg] = useState<Array<PgOverviewDetails | null>>([null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pgs = [
    {
      id: 1,
      name: "Midland Park Building",
      location: "Nayapatti, Salt Lake",
      price: 7000,
      rating: 4.2,
      images: ["/midlandpark.jpg"],
      amenities: ["WiFi", "Food", "Laundry"],
      roomTypes: ["Single", "Double"],
      gender: "Male",
      available: true,
      reviews: 18,
    },
    {
      id: 2,
      name: "Kashana Housing",
      location: "Action area 1, Newtown",
      price: 6000,
      rating: 4.0,
      images: ["/kashanapg.jpg"],
      amenities: ["WiFi", "AC", "Gym"],
      roomTypes: ["Single"],
      gender: "Female",
      available: true,
      reviews: 25,
    },
    {
      id: 3,
      name: "Barsha PG",
      location: "Nayapatti, Technopolis, Salt Lake",
      price: 7000,
      rating: 4.5,
      images: ["/barshapg.jpg"],
      amenities: ["Food", "Laundry"],
      roomTypes: ["Double", "Triple"],
      gender: "Female",
      available: true,
      reviews: 30,
    },
    {
      id: 4,
      name: "Maa Santoshi PG",
      location: "MB 238/1 Near Chitrakut Mahishbathan",
      price: 6500,
      rating: 4.3,
      images: ["/masantoshi.jpg"],
      amenities: ["WiFi", "Food", "Laundry"],
      roomTypes: ["Single", "Double"],
      gender: "Male",
      available: false,
      reviews: 20,
    },
    {
      id: 5,
      name: "Appayan PG",
      location: "Nayapatti, Technopolis, Salt Lake",
      price: 7000,
      rating: 4.6,
      images: ["/appayan.jpg"],
      amenities: ["AC", "Food", "WiFi"],
      roomTypes: ["Single", "Double"],
      gender: "Male",
      available: true,
      reviews: 28,
    },
    {
      id: 6,
      name: "Sabita PG",
      location: "Nayapatti, Technopolis, Salt Lake",
      price: 6800,
      rating: 4.7,
      images: ["/sabitapg.jpg"],
      amenities: ["WiFi", "Food", "Gym"],
      roomTypes: ["Single", "Double"],
      gender: "Female",
      available: false,
      reviews: 35,
    },
    {
      id: 7,
      name: "Narayan House",
      location: "Krishnapur Main Road, Mohisgote",
      price: 8000,
      rating: 4.9,
      images: ["/narayanhouse.jpg"],
      amenities: ["AC", "Laundry", "Gym"],
      roomTypes: ["Single"],
      gender: "Male",
      available: true,
      reviews: 42,
    },
    {
      id: 8,
      name: "Asha PG",
      location: "CL Block, Sector 2, Salt Lake",
      price: 7000,
      rating: 4.4,
      images: ["/ashapg.jpg"],
      amenities: ["WiFi", "Food", "Laundry"],
      roomTypes: ["Double", "Triple"],
      gender: "Female",
      available: true,
      reviews: 19,
    },
  ];

  //Fetch pgs from databse
  useEffect(() => {
    const fetchPgs = async () => {
      try {
        const token = decryptToken(localStorage.getItem("authToken"));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/get-all-pgs`,
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

        //format pg data
        const pgData = data?.data?.map((pg) => {
          const roomTypes = pg.rooms?.map((room) => room.type);

          // Generate amenities based on services with true values
          const amenities = [];
          Object.keys(pg.services).forEach((key) => {
            if (pg.services[key] === true) {
              amenities.push(key);
            }
          });

          return {
            id: pg.uuid,
            name: pg.name,
            address: pg.address,
            gender: pg.gender,
            price: pg.rooms[0]?.rates.monthly || 1000, // Adjusted to get the monthly rate from the first room
            amenities,
            roomTypes,
            rating: pg.rating, // Corrected the spelling of "ranting" to "rating"
            timings: pg.timings, // Assuming "timings" is correct
            latitude: pg.location.latitude,
            longitude: pg.location.longitude,
            images: pg.pictures, // Adjusted the key to "images" from "pictures"
          };
        });

        setPg(pgData);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch PG details. Please try again later.");
        setLoading(false);
      }
    };

    fetchPgs();
  }, []);

  const filters = {
    priceRanges: [
      { label: "All Prices", value: "all" },
      { label: "Under ₹5,000", value: "under5k" },
      { label: "₹5,000 - ₹10,000", value: "5k-10k" },
      { label: "Above ₹10,000", value: "above10k" },
    ],
    roomTypes: [
      { label: "All Types", value: "all" },
      { label: "Single Room", value: "single" },
      { label: "Double Sharing", value: "double" },
      { label: "Triple Sharing", value: "triple" },
    ],
    genderTypes: [
      { label: "All", value: "all" },
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  };

  const filteredPg = useMemo(() => {
    return pg?.filter((pg) => {
      const searchLower = searchPg.toLowerCase();
      const priceCondition =
        selectedFilters.priceRange === "all" ||
        (selectedFilters.priceRange === "under5k" && pg?.price < 5000) ||
        (selectedFilters.priceRange === "5k-10k" &&
          pg?.price >= 5000 &&
          pg?.price <= 10000) ||
        (selectedFilters.priceRange === "above10k" && pg?.price > 10000);

      const roomCondition =
        selectedFilters.roomType === "all" ||
        pg?.roomTypes.some(
          (room) => room.toLowerCase() === selectedFilters.roomType
        );

      const genderCondition =
        selectedFilters.gender === "all" ||
        pg?.gender.toLowerCase() === selectedFilters.gender;

      return (
        (pg?.name.toLowerCase().includes(searchLower) ||
          pg?.address.toLowerCase().includes(searchLower) ||
          pg?.amenities.some((amenity) =>
            amenity.toLowerCase().includes(searchLower)
          )) &&
        priceCondition &&
        roomCondition &&
        genderCondition
      );
    });
  }, [pg, searchPg, selectedFilters]);

  const sortedPg = useMemo(() => {
    const sorted = [...filteredPg];
    if (sortPg === "priceLowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortPg === "priceHighToLow") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortPg === "ratingHighToLow") {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [filteredPg, sortPg]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!pg) {
    return <div className="text-center mt-8">No PG listed currently.</div>;
  }

  return (
    <>
      {/* Header with Search */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={searchPg}
                onChange={(e) => setSearchPg(e.target.value)}
                placeholder="Search by location, PG name..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedFilters.priceRange}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    priceRange: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {filters.priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedFilters.roomType}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    roomType: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {filters.roomTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedFilters.gender}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    gender: e.target.value,
                  })
                }
                className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {filters.genderTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredPg.length} PGs Available
          </h2>
          <select
            value={sortPg}
            onChange={(e) => setSortPg(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="recommended">Sort by Recommended</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
          </select>
        </div>

        {/* PG Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPg.map((pg) => (
            <div
              key={pg.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative group">
                <Image
                  src={pg.images[0]}
                  alt={pg.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                  {pg.gender} PG
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{pg.name}</h3>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                    <span className="text-green-700 font-medium">
                      {pg.rating}
                    </span>
                    <span className="text-green-700 ml-1">★</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <LocationIcon />
                  <span className="ml-2">{pg?.address}</span>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {pg.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      ₹{pg.price}
                    </span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                  <button
                    onClick={() => router.push(`/searchpg/${pg?.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
            Load More PGs
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 PG Finder. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default PGShowcase;
