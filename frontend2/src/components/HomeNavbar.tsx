import Image from "next/image";
import Link from "next/link";
import React from "react";

function HomeNavbar() {
  return (
    <nav className="relative z-10 flex justify-between items-center p-4 md:p-6">
      <Link href="/" className="text-white text-2xl font-semibold">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={30} // Ensure this is a number, not a string
            height={20} // Ensure this is a number, not a string
          />
          <span className="ml-2 md:ml-4 text">My perfect PG</span>
        </div>
      </Link>
      <div className="flex gap-4 md:gap-6">
        <Link href="/" className="text-white hover:text-gray-200 transition">
          Home
        </Link>
        <Link
          href="/about"
          className="text-white hover:text-gray-200 transition"
        >
          About
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;
