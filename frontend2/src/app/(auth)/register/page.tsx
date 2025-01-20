"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/HomeNavbar";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data.data);

      // Redirect to desired page after registration
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      console.error("Error during registration:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    handleRegister();
  };

  return (
    <>
      {/* Navbar */}
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
      {/* Main Background */}
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
        {/* Form Section */}
        <div className="bg-[#0D0D0D] rounded-xl shadow-2xl p-6 sm:p-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl h-auto mt-[8rem] sm:mt-[9rem] ml-0 md:ml-8 backdrop-blur-sm border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white 
                          placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                          focus:ring-opacity-20 outline-none transition-colors"
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg 
                transition-colors font-medium shadow-lg hover:shadow-blue-500/20"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
