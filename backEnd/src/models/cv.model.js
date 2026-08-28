import mongoose, { Schema } from "mongoose";

const cvSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // uploaded CV file location
    parsedText: { type: String }, // extracted text used for AI generation
    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },
  },
  { timestamps: true },
);

const CV = mongoose.model("CV", cvSchema);
export default CV;