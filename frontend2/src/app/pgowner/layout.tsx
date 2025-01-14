// app/pgowner/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const PgOwnerLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "", label: "Home" },
    { href: "addPg", label: "Add PG" },
    { href: "bookings", label: "Bookings" },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 px-6">
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={`/pgowner/${link.href}`}>
              <Link
                href={`/pgowner/${link.href}`}
                className={`hover:text-blue-400 ${
                  pathname === `/pgowner/${link.href}`
                    ? "text-blue-400 font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="flex-1 text-right">Logout</li>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default PgOwnerLayout;
