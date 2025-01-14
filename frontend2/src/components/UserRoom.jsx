import { useState } from "react";
import { useRouter } from "next/router";

const RoomDetailsForm = () => {
  const [rooms, setRooms] = useState([
    {
      type: "",
      features: { ac: false, furnished: false },
      rates: { monthly: "" },
      availability: { count: 0, booked: 0 },
      pictures: [],
    },
  ]);
  const [services, setServices] = useState({
    fooding: false,
    foodingType: "",
    ac: false,
    cctv: false,
    wifi: false,
    laundry: false,
    parking: false,
    security: false,
    otherServices: [],
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const prevformData = router.query;

  const validateForm = () => {
    const newErrors = {};
    rooms.forEach((room, index) => {
      if (!room.type) newErrors[`roomType${index}`] = "Room type is required";
      // if (!room.features.furnished) newErrors[`furnished${index}`] = "Room must be furnished";
      if (!room.rates.monthly) newErrors[`monthlyRate${index}`] = "Monthly rate is required";
    });
    if (services.fooding && !services.foodingType) newErrors.foodingType = "Fooding type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoomChange = (index, field, value) => {
    setRooms((prev) => {
      const updatedRooms = [...prev];
      if (field.includes(".")) {
        const [group, subField] = field.split(".");
        updatedRooms[index][group][subField] = value;
      } else {
        updatedRooms[index][field] = value;
      }
      return updatedRooms;
    });
  };

  const handleServicesChange = (field, value) => {
    setServices((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = {
        rooms: JSON.stringify(rooms), // Serialize rooms
        services: JSON.stringify(services), // Serialize services
      };
      console.log("Serialized Data being passed:", data);
      router.push({
        pathname: "/ownerdetails",
        query: { ...prevformData, ...data },
      });
    }
  };
  

  const addRoom = () => {
    setRooms((prev) => [
      ...prev,
      {
        type: "",
        features: { ac: false, furnished: false },
        rates: { monthly: "" },
        availability: { count: 0, booked: 0 },
        pictures: [],
      },
    ]);
  };

  const removeRoom = (index) => setRooms((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 mt-[4rem]">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {rooms.map((room, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 relative">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-800 mb-6">Room {index + 1} Details</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Room Type *</label>
                  <select
                    value={room.type}
                    onChange={(e) => handleRoomChange(index, "type", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  >
                    <option value="">Select Room Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                  {errors[`roomType${index}`] && <p className="mt-1 text-sm text-red-500">{errors[`roomType${index}`]}</p>}
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={room.features.ac}
                      onChange={(e) => handleRoomChange(index, "features.ac", e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">Air Conditioning</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={room.features.furnished}
                      onChange={(e) => handleRoomChange(index, "features.furnished", e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">Furnished *</span>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Monthly Rate *</label>
                  <input
                    type="number"
                    value={room.rates.monthly}
                    onChange={(e) => handleRoomChange(index, "rates.monthly", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Enter monthly rate"
                  />
                  {errors[`monthlyRate${index}`] && (
                    <p className="mt-1 text-sm text-red-500">{errors[`monthlyRate${index}`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Room Pictures *</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      handleRoomChange(index, "pictures", Array.from(e.target.files).map((file) => file.name))
                    }
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={addRoom}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Another Room
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Services</h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={services.fooding}
                  onChange={(e) => handleServicesChange("fooding", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Fooding</span>
              </label>

              {services.fooding && (
                <select
                  value={services.foodingType}
                  onChange={(e) => handleServicesChange("foodingType", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  <option value="">Select Fooding Type</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="both">Both</option>
                </select>
              )}

              {["ac", "cctv", "wifi", "laundry", "parking", "security"].map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={services[service]}
                    onChange={(e) => handleServicesChange(service, e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 capitalize">{service}</span>
                </label>
              ))}

              <label className="block text-gray-700 font-medium mb-1">Other Services</label>
              <textarea
                value={services.otherServices.join(", ")}
                onChange={(e) =>
                  handleServicesChange("otherServices", e.target.value.split(",").map((s) => s.trim()))
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Comma-separated values"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomDetailsForm;
