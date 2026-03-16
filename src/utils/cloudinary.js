import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // upload file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // delete temp file after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // delete temp file if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary Upload Error:", error);

    return null;
  }
};

export { uploadOnCloudinary };
