"use client";
import Image from "next/image";
import Link from "next/link";

function HomeNavbar() {
  return (
    <nav className="relative z-10 flex justify-between items-center p-4 md:p-6">
      <Link href="/" className="text-white text-2xl font-semibold">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={30} height={20} />
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
        {!localStorage.getItem("isLoggedIn") && (
          <Link
            href="/login"
            className="text-white hover:text-gray-200 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default HomeNavbar;
