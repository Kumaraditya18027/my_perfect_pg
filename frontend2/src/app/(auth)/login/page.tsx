// app/login/page.tsx (or pages/login.tsx)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import the AuthContext
import HomeNavbar from "@/components/HomeNavbar"; // Assuming you have this component
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const { state, dispatch } = useAuth(); // Access the auth state and dispatch from context
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push("/"); // Redirect to home page if already authenticated
    }
  }, [state.isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate and dispatch login action
    dispatch({ type: "LOGIN", payload: { email: formData.email } });
    router.push("/Pg"); // Navigate to the desired page after successful login
  };

  return (
    <>
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-50 backdrop-blur-md">
        <HomeNavbar />
      </div>

      {/* Main Background */}
      <div
        className="min-h-screen flex items-start justify-center md:justify-start relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0) 100%), url('/images/laptop.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Form Section */}
        <div className="bg-[#0D0D0D] rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-md h-auto mt-[8rem] sm:mt-[9rem] ml-0 md:ml-8 backdrop-blur-sm border border-gray-700">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
              Login
            </button>
            <p className="my-2 text-white">
              Don't have an account yet?{" "}
              <Link href="/register" className="text-blue-600">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
