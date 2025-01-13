const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

async function uploadFileOnCloudinary(filePath) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Upload a file
  const uploadResult = await cloudinary.uploader
    .upload(filePath, {
      resource_type: "auto",
    })
    .catch((error) => {
      fs.unlinkSync(filePath);
      console.log(error);
      return null;
    });

  if (uploadResult) {
    console.log(filePath);
    console.log(uploadResult);
    if (filePath !== "uploads\\dummy_pg.jpg") {
      fs.unlinkSync(filePath);
    }
    return uploadResult.url;
  } else {
    return null;
  }
}

module.exports = uploadFileOnCloudinary;
