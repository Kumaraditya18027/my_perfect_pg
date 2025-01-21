"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const OwnerDetailsForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState({});
  const [description, setDescription] = useState("");
  const [timings, setTimings] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [pictures, setPictures] = useState([]);
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [rating, setRating] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profession: "",
    address: "",
    pictures: [],
    deleted: false,
  });
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const searchParams = useSearchParams();
  const professions = ["Students", "Working Professionals"];

  useEffect(() => {
    console.log('useEffect triggered');
    
    try {
      // Log all search parameters
      const paramsObject = {};
      searchParams.forEach((value, key) => {
        paramsObject[key] = value;
      });
      console.log("All search parameters:", paramsObject);

      // Get and parse rooms
      const rawRooms = searchParams.get('rooms');
      console.log("Raw rooms:", rawRooms);
      const parsedRooms = rawRooms ? JSON.parse(rawRooms) : [];
      console.log("Parsed rooms:", parsedRooms);
      setRooms(parsedRooms);

      // Get and parse services
      const rawServices = searchParams.get('services');
      console.log("Raw services:", rawServices);
      const parsedServices = rawServices ? JSON.parse(rawServices) : {};
      console.log("Parsed services:", parsedServices);
      const formattedServices = formatServices(parsedServices);
      setServices(formattedServices);

      // Set other form fields
      setName(searchParams.get('name') || '');
      setAddress(searchParams.get('address') || '');
      setGender(searchParams.get('gender') || '');
      setDescription(searchParams.get('description') || '');
      setTimings(searchParams.get('timings') || '');
      setLongitude(searchParams.get('longitude') || '');
      setLatitude(searchParams.get('latitude') || '');
      
      // Parse and set pictures if they exist
      const rawPictures = searchParams.get('pictures');
      if (rawPictures) {
        const parsedPictures = JSON.parse(rawPictures);
        setPictures(parsedPictures);
      }

      // Update formData with the new values
      setFormData(prev => ({
        ...prev,
        name: searchParams.get('name') || '',
        address: searchParams.get('address') || '',
        profession: searchParams.get('profession') || ''
      }));

    } catch (error) {
      console.error("Error parsing search parameters:", error, {
        stack: error.stack
      });
    }
  }, [searchParams]);

  function formatServices(parsedServices) {
    return {
      fooding: parsedServices.fooding || false,
      foodingType: parsedServices.foodingType || "veg",
      ac: parsedServices.ac || false,
      cctv: parsedServices.cctv || false,
      wifi: parsedServices.wifi || false,
      laundry: parsedServices.laundry || false,
      parking: parsedServices.parking || false,
      security: parsedServices.security || false,
      otherServices: parsedServices.otherServices || [],
    };
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be a valid 10-digit number";
    }
    if (!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Email must be a valid email address";
    }
    if (!formData.profession) newErrors.profession = "Profession is required";
    if (!formData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Update corresponding state variables
    if (name === "address") setAddress(value);
    if (name === "rating") setRating(value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, pictures: files }));

    // Create and set image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Clean up old previews
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    // Update owner details
    setOwnerName(formData.name);
    setOwnerPhone(formData.phone);
    setOwnerEmail(formData.email);
    setProfession(formData.profession);

    // Prepare submission data
    const submissionData = {
      name,
      address,
      gender,
      rooms,
      services,
      description,
      rating,
      location: {
        longitude,
        latitude,
      },
      timings,
      pictures,
      ownerDetails: {
        name: formData.name,         // Use formData directly
        phone: formData.phone,       // Use formData directly
        email: formData.email,       // Use formData directly
        address: formData.ownerAddress, // Use correct property name
      },
      profession: formData.profession,
    };

    console.log("Data to be submitted:", submissionData);

    try {
      // Uncomment and modify this section when ready to submit to backend
      /*
      const response = await fetch("your-api-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      */
    } catch (error) {
      console.error("Submission error:", error);
      // Handle error appropriately (e.g., show error message to user)
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Owner Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Profession */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Profession of student allowed in pg*
            </label>
            <select
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Select Profession</option>
              {professions.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
            {errors.profession && (
              <p className="mt-1 text-sm text-red-500">{errors.profession}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.ownerAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter the address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Pictures */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Pictures
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
            />
            <div className="mt-4 flex gap-4 flex-wrap">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>

          {/* Deleted */}
          {/* <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="deleted"
                checked={formData.deleted}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">Mark as Deleted</span>
            </label>
          </div> */}

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => router.back()}
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerDetailsForm;
