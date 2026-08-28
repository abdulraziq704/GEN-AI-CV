import multer from "multer";

// memoryStorage -> file mila as buffer (req.file.buffer), disk pe save nahi hota
// Cloudinary ko seedha buffer se stream karna hai isliye ye zaroori hai
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["application/pdf"];

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error("Only PDF files are allowed"), false);
  }
  cb(null, true);
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 5MB max — CV se bade PDF ki zarurat nahi
  },
});