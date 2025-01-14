import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import pgImg from "../../../../public/admin/pg.jpeg";

interface PGDetails {
  image: string;
  name: string;
  location: string;
  amount: string;
  assign_member: string;
  ph_number: string;
}

const tableHeading: string[] = [
  "Image",
  "PG Name",
  "Location",
  "Amount",
  "Assign member",
  "Phone number",
];

const bookedPG: PGDetails[] = [
  {
    image: "https://example.com/image1.jpg",
    name: "Sunshine PG",
    location: "Mumbai",
    amount: "6000",
    assign_member: "Amit Sharma",
    ph_number: "+911234567890",
  },
  {
    image: "https://example.com/image2.jpg",
    name: "Comfort Stay",
    location: "Delhi",
    amount: "5500",
    assign_member: "Sneha Rao",
    ph_number: "+919876543210",
  },
  {
    image: "https://example.com/image3.jpg",
    name: "Green Haven",
    location: "Bangalore",
    amount: "7000",
    assign_member: "Vikram Singh",
    ph_number: "+918765432109",
  },
  {
    image: "https://example.com/image4.jpg",
    name: "Elite Residency",
    location: "Pune",
    amount: "6500",
    assign_member: "Anjali Verma",
    ph_number: "+919123456789",
  },
  {
    image: "https://example.com/image5.jpg",
    name: "Peaceful Abode",
    location: "Hyderabad",
    amount: "6200",
    assign_member: "Rakesh Gupta",
    ph_number: "+918912345678",
  },
  {
    image: "https://example.com/image6.jpg",
    name: "Cosy Corner",
    location: "Chennai",
    amount: "5000",
    assign_member: "Priya Nair",
    ph_number: "+917654321098",
  },
  {
    image: "https://example.com/image7.jpg",
    name: "The Nest",
    location: "Ahmedabad",
    amount: "5600",
    assign_member: "Nitin Patel",
    ph_number: "+917012345678",
  },
  {
    image: "https://example.com/image8.jpg",
    name: "City Lights PG",
    location: "Jaipur",
    amount: "4800",
    assign_member: "Swati Mehta",
    ph_number: "+911098765432",
  },
  {
    image: "https://example.com/image9.jpg",
    name: "Royal Stay",
    location: "Kolkata",
    amount: "5400",
    assign_member: "Rahul Sen",
    ph_number: "+913456789012",
  },
];

const Booked: React.FC = () => {
  return (
    <div>
      <h1 className="pageHeading">Booked</h1>

      <div className="relative overflow-x-auto">
        <table className="w-full text-base text-left text-gray-500 border-separate border-spacing-y-3">
          <thead className="text-gray-700">
            <tr>
              {tableHeading.map((th, index) => (
                <th key={index} scope="col" className="px-6 py-3 font-semibold">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookedPG.map((pg, index) => (
              <tr className="bg-bgGray" key={index}>
                <td className="pl-6 py-5 rounded-l-xl">
                  <div className="flex items-center">
                    <Image
                      src={pgImg}
                      alt="pg-image"
                      className="size-12 rounded-lg"
                    />
                  </div>
                </td>
                <td className="px-6 py-5">{pg.name}</td>
                <td className="px-6 py-5">{pg.location}</td>
                <td className="px-6 py-5">{pg.amount}</td>
                <td className="px-6 py-5">{pg.assign_member}</td>
                <td className="px-6 py-5">{pg.ph_number}</td>
                <td className="pr-6 py-5 rounded-r-xl">
                  <Link
                    href={`/admin/bookedpg/${pg.name.split(" ").join("-")}`}
                  >
                    <FaArrowCircleRight className="text-2xl" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booked;
