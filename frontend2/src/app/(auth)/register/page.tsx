// pages/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext"; // Import the AuthContext hook
import HomeNavbar from "@/components/HomeNavbar";

const RegisterForm = () => {
  const router = useRouter();
  const { dispatch } = useAuth(); // Access the dispatch from context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/"); // Redirect to the home page if already authenticated
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this to a server or handle registration logic
    dispatch({ type: "LOGIN", payload: { email: formData.email } });
    router.push("/Pg"); // Redirect to the desired page after successful registration
  };

  return (
    <>
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-50 backdrop-blur-md">
        <HomeNavbar />
      </div>

      {/* Register Form Section */}
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="bg-[#0D0D0D] rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-md backdrop-blur-sm border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
