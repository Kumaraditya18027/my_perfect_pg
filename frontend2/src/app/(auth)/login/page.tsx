"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

interface FormData {
  email: string;
  password: string;
  userType: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    userType: "Student",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      // console.log(data);
      login(data.data.accessToken, formData.userType, data.data.user);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const userTypes: string[] = ["Student", "Owner", "Employee", "Admin"];

  return (
    <>
      <div
        className="absolute top-0 left-0 w-full z-50 backdrop-blur-md"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.7) 100%, rgba(0, 0, 0, 0.4) 100%, rgba(0, 0, 0, 0) 100%)
          `,
        }}
      >
        <HomeNavbar />
      </div>
      <div
        className="min-h-screen flex items-start justify-center md:justify-start relative"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0) 100%),
            url('/images/laptop.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[#0D0D0D] rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl h-auto mt-[8rem] sm:mt-[9rem] ml-0 md:ml-8 backdrop-blur-sm border border-gray-700">
          {/* User Type Toggle */}
          <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg mb-8">
            {userTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFormData({ ...formData, userType: type })}
                className={`flex-1 py-2 px-4 rounded-md text-sm transition-all ${
                  formData.userType === type
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                          placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                          focus:ring-opacity-20 outline-none transition-colors"
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
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                          placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                          focus:ring-opacity-20 outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
                transition-colors font-medium shadow-lg hover:shadow-blue-500/20"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {formData.userType === "Student" && (
              <p className="my-2 text-white">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register"
                  prefetch={true}
                  className="text-blue-600"
                >
                  Register here
                </Link>
              </p>
            )}
            {formData.userType === "Owner" && (
              <p className="my-2 text-white">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/register/pgowner"
                  prefetch={true}
                  className="text-blue-600"
                >
                  Register here
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
