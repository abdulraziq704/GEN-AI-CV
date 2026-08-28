import mongoose, { Schema } from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  relatedTo: { type: String },
  userNotes: { type: String, default: "" },
});

const questionSetSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true, // fast lookups per user
    },
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
      required: true,
    },
    technical: [questionSchema],
    projectBased: [questionSchema],
    behavioral: [questionSchema],
    fieldBasics: [questionSchema],
    totalQuestions: {
      type: Number,
      default: 50,
    },
    title: { type: String, default: "" },
    pdfUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },
  },
  { timestamps: true },
);

const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);

export default QuestionSet;
