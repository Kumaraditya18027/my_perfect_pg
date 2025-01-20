"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  address: string;
  gender: string;
  description: string;
  timings: string;
  longitude: string;
  latitude: string;
}

interface Errors {
  name?: string;
  address?: string;
  gender?: string;
  description?: string;
  timings?: string;
  longitude?: string;
  latitude?: string;
}

const AddPg: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    gender: "",
    description: "",
    timings: "",
    longitude: "",
    latitude: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const tempErrors: Errors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.address.trim()) tempErrors.address = "Address is required";
    if (!formData.gender) tempErrors.gender = "Gender selection is required";
    if (!formData.description.trim())
      tempErrors.description = "Description is required";
    if (!formData.timings.trim()) tempErrors.timings = "Timings are required";
    if (!formData.longitude) tempErrors.longitude = "Longitude is required";
    if (!formData.latitude) tempErrors.latitude = "Latitude is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      // Create query string from formData
      const queryString = new URLSearchParams(
        formData as Record<string, string>
      ).toString();

      // Navigate to the next page with query string
      router.push(`/pgowner/addroom?${queryString}`);
    }
  };

  const FormTooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative inline-block ml-2">
      <svg
        className="w-4 h-4 text-blue-400 hover:text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      <div className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-1 text-sm text-white bg-blue-950 rounded-lg -left-20 top-full">
        {text}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PG Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please fill in your details below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name of the Pg
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Enter your PG name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address of the Pg
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.address ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Enter your complete address"
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Gender Preference
              </label>
              <div className="flex space-x-6">
                {["male", "female", "unisex"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={formData.gender === option}
                      onChange={handleChange}
                      className="text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 capitalize">{option}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="text-gray-700 font-medium">
                  Description of the Pg
                </label>
                <FormTooltip text="Provide a brief description about your Pg" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.description ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Tell us about yourself"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="text-gray-700 font-medium">
                  Timings allowed
                </label>
                <FormTooltip text="Specify your available hours (e.g., 9 AM - 5 PM)" />
              </div>
              <input
                type="text"
                name="timings"
                value={formData.timings}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.timings ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Enter your availability"
              />
              {errors.timings && (
                <p className="text-sm text-red-500 mt-1">{errors.timings}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.longitude ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="Enter longitude"
                  step="any"
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.longitude}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.latitude ? "border-red-500" : "border-gray-200"
                  } focus:outline-none focus:border-blue-500 transition-colors`}
                  placeholder="Enter latitude"
                  step="any"
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPg;
