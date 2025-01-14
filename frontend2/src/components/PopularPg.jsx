import React from "react";
import Image from "next/image";

const PopularPGSection = () => {
  // Array of PG listings data
  const pgListings = [
    {
      name: "Midland Park Building",
      price: 7000,
      image: "/midlandpark.jpg",
    },
    {
      name: "Kashana Housing",
      price: 6000,
      image: "/kashanapg.jpg",
    },
    {
      name: "Barsha PG",
      price: 7000,
      image: "/barshapg.jpg",
    },
    {
      name: "Maa Santoshi PG",
      price: 6500,
      image: "/masantoshi.jpg",
    },
    {
      name: "Appayan PG",
      price: 7000,
      image: "/appayan.jpg",
    },
    {
      name: "Sabita PG",
      price: 6800,
      image: "/sabitapg.jpg",
    },
    {
      name: "Narayan House",
      price: 8000,
      image: "/narayanhouse.jpg",
    },
    {
      name: "Asha PG",
      price: 7000,
      image: "/ashapg.jpg",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-4xl font-normal mb-8">Popular PG</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pgListings.map((pg, index) => (
          <div key={index} className="bg-gray-50 rounded-3xl p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-normal mb-1">{pg.name}</h3>
                <p className="text-xl">₹{pg.price}</p>
              </div>
              <button className="bg-white rounded-full p-3 shadow-sm hover:shadow-md transition-shadow">
                {/* Cart Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7h16M4 7l2 11h12l2-11M4 7l4-4h8l4 4M9 11v6M15 11v6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="relative h-48 w-full overflow-hidden rounded-2xl">
              <Image
                src={pg.image}
                alt={pg.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPGSection;
