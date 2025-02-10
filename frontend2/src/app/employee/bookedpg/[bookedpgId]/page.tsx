"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import pgImg from "../../../../../public/admin/pg.jpeg";

const BookedPG = () => {
  const searchParams = useSearchParams();
  const bookedpgId = searchParams.get("bookedpgId");
  const pgName = bookedpgId ? bookedpgId.split("-").join(" ") : "Unknown PG";

  return (
    <div>
      <h1 className="pageHeading">PG Description</h1>
      <div className="flex flex-wrap py-6 gap-x-10">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-5">
          <div className="flex items-center w-[177px] h-[178px] sm:w-[283px] sm:h-[285px] lg:w-[377px] lg:h-[379px] xl:w-[472px] xl:h-[475px] col-span-4">
            <Image
              src={pgImg}
              alt="pg-image"
              className="size-full rounded-xl"
            />
          </div>
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center size-[36px] sm:size-[58px] lg:size-[78px] xl:size-[97.18px]"
            >
              <Image
                src={pgImg}
                alt={`pg-thumbnail-${index}`}
                className="size-full rounded-2xl"
              />
            </div>
          ))}
        </div>

        {/* PG Details */}
        <div className="flex flex-col justify-start items-start">
          <h1 className="text-2xl lg:text-3xl font-semibold">{pgName}</h1>
          <span className="inline-flex items-center text-lg gap-x-2">
            <FaLocationDot />
            Kolkata
          </span>
          <div className="mt-5">
            <ul>
              {[...Array(5)].map((_, index) => (
                <li
                  key={index}
                  className="text-base sm:text-lg font-medium mb-8"
                >
                  <span className="text-gray-400">Assign Member</span>
                  <span className="ml-20 sm:ml-40">Rajgopal Kumar</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedPG;
