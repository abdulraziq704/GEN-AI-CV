import { getAuth } from "@clerk/express";
import { asynchandler } from "../utils/handlers.js";
import CV from "../models/cv.model.js";
import QuestionSet from "../models/questions.model.js";
import { uploadBufferToImageKit } from "../utils/imagekitUpload.js";

// POST /cv/upload  (multipart/form-data, field name: "cv")
export const uploadCVController = asynchandler(async (req, res) => {
  const { userId, isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // 1. ImageKit pe upload
  const result = await uploadBufferToImageKit(
    req.file.buffer,
    req.file.originalname,
  );

  // 2. DB record banao — abhi sirf "uploaded" status, parsing/AI step alag hoga
  const cv = await CV.create({
    clerkId: userId,
    originalName: req.file.originalname,
    fileUrl: result.url,
    status: "uploaded",
  });

  res.status(201).json({ cv });
});

export const getMyCv = asynchandler(async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized",
    });
  }

  const cv = await CV.find({ clerkId: userId }).sort({ createdAt: -1 });
  res.status(200).json({
    message: "cv get ok",
    cv,
  });
});

export const getCvById = asynchandler(async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized",
    });
  }

  const { id } = req.params;

  const cv = await CV.findOne({ _id: id, clerkId: userId });
  if (!cv) {
    return res.status(404).json({ message: "CV not found" });
  }

  res.status(200).json({
    message: "cv get ok",
    cv,
  });
});

export const Deletecv = asynchandler(async (req, res) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized",
    });
  }

  const { id } = req.params;

  const cv = await CV.findOneAndDelete({ _id: id, clerkId: userId });
  if (!cv) {
    return res.status(404).json({ message: "CV not found" });
  }

  await QuestionSet.deleteMany({ cv: id, clerkId: userId });

  console.log("delete cv and question",userId);

  res.status(200).json({
    message: "cv del ok",
    cv,
  });
});
