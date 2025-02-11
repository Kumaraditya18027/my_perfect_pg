"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/HomeNavbar";
import toast from "react-hot-toast";

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  adhaarFile: File | null;
}

const PGOwnerRegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    phone: "",
    adhaarFile: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      // Create a FormData instance
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      if (formData.adhaarFile) {
        data.append("adhaarFile", formData.adhaarFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pgowner-register`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await response.json();

      // Show a toast notification
      toast.success(
        "Registered successfully! Check your mail for login credentials."
      );

      // Optionally, delay redirect to allow the toast to be visible
      setTimeout(() => {
        router.push("/login");
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
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
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7) 100%, rgba(0, 0, 0, 0.4) 100%, rgba(0, 0, 0, 0) 100%)`,
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
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-colors"
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
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-colors"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Adhaar</label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adhaarFile: e.target.files ? e.target.files[0] : null,
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-colors"
                accept=".pdf"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium shadow-lg hover:shadow-blue-500/20"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PGOwnerRegisterPage;
