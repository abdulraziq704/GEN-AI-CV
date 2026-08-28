import imagekit from "../config/imageKit.js";

/**
 * Uploads a buffer (from multer memoryStorage) to ImageKit.
 * ImageKit seedha buffer/base64 leta hai — koi extra stream conversion nahi chahiye.
 */
export const uploadBufferToImageKit = async (buffer, originalName) => {
  const result = await imagekit.upload({
    file: buffer, // raw buffer chalta hai
    fileName: `${Date.now()}-${originalName}`,
    folder: "/cvs",
    useUniqueFileName: true,
  });

  return result; // result.url -> public file URL
};