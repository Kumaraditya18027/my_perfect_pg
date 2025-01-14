import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const OwnerDetailsForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState({});
  const [description, setDescription] = useState('');
  const [timings, setTimings] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [pictures, setPictures] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [rating, setRating] = useState(''); // Add rating
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profession: "",
    address: "",  // Add address here
    pictures: [],
    deleted: false,
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const professions = ["Students", "Working Professionals"];

  useEffect(() => {
    if (router.isReady) {
      // Access the raw query object
      console.log("Raw query parameters:", router.query);  // Log the raw query parameters
  
      try {
        const rawRooms = router.query.rooms;  // Access the query parameter directly
        const rawServices = router.query.services;
        const rawData = router.query;  

  
        // Check if the query parameters are non-empty strings before parsing
        const parsedRooms = typeof rawRooms === 'string' && rawRooms.trim() !== '' ? JSON.parse(rawRooms) : [];
        const parsedServices = typeof rawServices === 'string' && rawServices.trim() !== '' ? JSON.parse(rawServices) : {};
  
        console.log("Parsed Rooms:", parsedRooms);
        console.log("Parsed Services:", parsedServices);
        setName(rawData.name);  // Set the name here
        setAddress(rawData.address);  // Set the address here
        setGender(rawData.gender);
        setDescription(rawData.description);
        setTimings(rawData.timings);
         setLongitude(rawData.longitude);
        setLatitude(rawData.latitude);
        setPictures(rawData.pictures);
        // setOwnerName(rawData.ownerDetails.name);
        // setOwnerPhone(rawData.ownerDetails.phone);
        // setOwnerEmail(rawData.ownerDetails.email);
        // setProfession(rawData.ownerDetails.profession);
        setRooms(parsedRooms);
        // setServices(parsedServices);
        const formattedServices = formatServices(parsedServices);
        setServices(formattedServices);
      } catch (error) {
        console.error("Error parsing query parameters:", error);
      }
    }
  }, [router.isReady]);
  
  
  function formatServices(parsedServices) {
    return {
      fooding: parsedServices.fooding || false,  // default to false if not provided
      foodingType: parsedServices.foodingType || "veg",  // default to "veg" if not provided
      ac: parsedServices.ac || false,  // default to false if not provided
      cctv: parsedServices.cctv || false,  // default to false if not provided
      wifi: parsedServices.wifi || false,  // default to false if not provided
      laundry: parsedServices.laundry || false,  // default to false if not provided
      parking: parsedServices.parking || false,  // default to false if not provided
      security: parsedServices.security || false,  // default to false if not provided
      otherServices: parsedServices.otherServices || []  // default to empty array if not provided
    };
  }
  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone || !/\d{10}/.test(formData.phone)) {
      newErrors.phone = "Phone must be a valid 10-digit number";
    }
    if (!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Email must be a valid email address";
    }
    if (!formData.profession) newErrors.profession = "Profession is required";
    if (!formData.address) newErrors.address = "Address is required";  // Validate address

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // If the input field is for address or rating, update accordingly
    if (name === "address") setAddress(value);
    if (name === "rating") setRating(value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, pictures: files }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOwnerName(formData.name);
    setOwnerPhone(formData.phone);
    setOwnerEmail(formData.email);
    setProfession(formData.profession);
    // Ensure the form is valid before submitting
    if (validateForm()) {
      // Prepare the data to match the schema
      const data = {
        name,
        address,  // Use address here
        gender,
        rooms,
        services,
        description,
        rating,  // Use rating here
        location: {
          longitude,
          latitude,
        },
        timings,
        pictures,
        ownerDetails: {
          name: ownerName,
          phone: ownerPhone,
          email: ownerEmail,
        },
        profession,
      };

      console.log('Data to be submitted to the backend:', data);

      // Optionally send the data to the backend
      fetch('http://localhost:5000/api/pg/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(result => console.log('PG listing created:', result))
      .catch(error => console.error('Error:', error));
     }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 mt-[4rem]">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Owner Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Profession */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Profession of student allowed in pg*</label>
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
            {errors.profession && <p className="mt-1 text-sm text-red-500">{errors.profession}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter the address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          {/* Pictures */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Pictures</label>
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
