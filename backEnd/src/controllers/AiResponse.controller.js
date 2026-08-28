import { getAuth } from "@clerk/express";
import QuestionSet from "../models/questions.model.js";
import { asynchandler } from "../utils/handlers.js";
import { extractTextFromPdfUrl } from "../utils/pdfParser.js";
import { AIresponse } from "../services/Gen_ai.js"; // aapka wala Gemini+zod service
import CV from "../models/cv.model.js";
import { generateInterviewPrepPdfBuffer } from "../services/pdfPrint.js";

// POST /ai/generate  { cvId }
// PUBLIC — login required nahi. Guest bhi turant 50 questions dekh sake.
// Agar user logged in hai to QuestionSet uske clerkId ke saath save hoga
// (dashboard me dikhega), warna clerkId null rahega — result phir bhi milega.
export const generateQuestionsController = asynchandler(async (req, res) => {
  console.log("🔵 /ai/generate HIT — cvId:", req.body.cvId); // 👈 ye add karo

  const { userId, isAuthenticated } = getAuth(req); // hard 401 nahi lagaya — guest allowed

  if (!isAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { cvId } = req.body;

  if (!cvId) {
    return res.status(400).json({ error: "cvId is required" });
  }

  const cv = await CV.findById(cvId);
  if (!cv) {
    return res.status(404).json({ error: "CV not found" });
  }

  try {
    cv.status = "processing";
    await cv.save();

    // 1. PDF se text nikalo (agar pehle se parsed nahi hai to cache kar lo)
    const cvText = cv.parsedText || (await extractTextFromPdfUrl(cv.fileUrl));

    if (!cv.parsedText) {
      cv.parsedText = cvText;
      await cv.save();
    }

    // 2. Aapki AI service ko bhejo — already schema-validated data deti hai
    const questions = await AIresponse({ cvText });

    // 3. QuestionSet save karo — clerkId optional
    const questionSet = await QuestionSet.create({
      clerkId: userId || null,
      cv: cv._id,
      technical: questions.technical,
      projectBased: questions.projectBased,
      behavioral: questions.behavioral,
      fieldBasics: questions.fieldBasics,
    });

    cv.status = "completed";
    await cv.save();

    res.status(201).json({ questionSet });
  } catch (err) {
      console.error("🔴 Generate controller error:", err);
  cv.status = "failed";
  await cv.save();
  return res.status(500).json({ error: err.message || "Failed to generate questions" }) 
  // asynchandler isko catch kar ke error middleware tak bhejega
  }
});

// List all question sets for this user
export const getMyQuestionSets = asynchandler(async (req, res) => {
  const { userId, isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const sets = await QuestionSet.find({ clerkId: userId })
    .populate("cv", "originalName createdAt") // shows which CV each set belongs to
    .sort({ createdAt: -1 });

  res.json({ questionSets: sets });
});

// Get a single question set's full 50 questions (for dashboard detail view)
export const getQuestionSetById = asynchandler(async (req, res) => {
  const { userId, isAuthenticated } = getAuth(req);
  const { id } = req.params;

  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized ",
    });
  }

  const set = await QuestionSet.findOne({ _id: id, clerkId: userId });

  if (!set) {
    return res.status(404).json({ message: "Question set not found" });
  }

  res.json({ questionSet: set });
});

// Get all question sets tied to one specific CV (if a user re-generates for same CV)
export const getQuestionSetsByCV = asynchandler(async (req, res) => {
  const { userId, isAuthenticated } = getAuth(req);
  const { cvId } = req.params;
    console.log("🟡 QUERY DEBUG:", { cvId, userId }); // 👈 temporary

  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized ",
    });
  }

  const sets = await QuestionSet.find({ cv: cvId, clerkId: userId }).sort({
    createdAt: -1,
  });

  res.json({ questionSets: sets });
});

export const getQuestionSetsByPDF = asynchandler(async (req, res) => {
  const { userId, isAuthenticated } = getAuth(req);
  const { cvId } = req.params;
    console.log("🟡 QUERY DEBUG:", { cvId, userId }); // 👈 temporary

  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized ",
    });
  }

   const questionSetDoc = await QuestionSet.findOne({
    cv: cvId,
    clerkId: userId,
  }).sort({ createdAt: -1 });

  if (!questionSetDoc) {
    return res.status(404).json({ error: "No question sets found for this CV" });
  }

  // Optional: fetch CV title for the PDF header
  const cv = await CV.findOne({ _id: cvId, clerkId: userId }).select("originalName");

  const pdfBuffer = await generateInterviewPrepPdfBuffer({
    cvTitle: cv?.originalName,
    questionSetDoc, // ✅ matches the function's destructured key exactly
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="interview-prep-${cvId}.pdf"`
  );
  res.setHeader("Content-Length", pdfBuffer.length);
  return res.send(pdfBuffer);
});

// Save/update the notes a user drafts under ONE specific question.
// :id        -> the QuestionSet's own _id
// :category  -> one of "technical" | "projectBased" | "behavioral" | "fieldBasics"
// :questionId -> that question's own _id (subdocument id inside the category array)
//
// Needs two things already true on the question sub-schema in
// models/questions.model.js:
//   1. NOT setting `{ _id: false }` on it (so each question gets its own _id)
//   2. a `userNotes: { type: String, default: "" }` field
// If you haven't applied those yet, share questions.model.js next and I'll
// update it directly.
const NOTE_CATEGORIES = [
  "technical",
  "projectBased",
  "behavioral",
  "fieldBasics",
];

export const updateQuestionNotes = asynchandler(async (req, res) => {
  const { userId, isAuthenticated } = getAuth(req);
  const { id, category, questionId } = req.params;
  const { notes } = req.body;

  if (!isAuthenticated) {
    return res.status(401).json({
      error: "not authorized ",
    });
  }

  if (!NOTE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  const updated = await QuestionSet.findOneAndUpdate(
    {
      _id: id,
      clerkId: userId, // scoped to the signed-in user
      [`${category}._id`]: questionId,
    },
    {
      $set: { [`${category}.$.userNotes`]: notes ?? "" },
    },
    { new: true },
  );

  if (!updated) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json({ questionSet: updated });
});
