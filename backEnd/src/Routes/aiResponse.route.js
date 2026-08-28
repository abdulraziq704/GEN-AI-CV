import e from "express";
import {
  generateQuestionsController,
  getMyQuestionSets,
  getQuestionSetById,
  getQuestionSetsByCV,
  getQuestionSetsByPDF,
  updateQuestionNotes,
} from "../controllers/AiResponse.controller.js";

const Airouter = e.Router();

Airouter.post("/generate",generateQuestionsController)

Airouter.get("/", getMyQuestionSets);
Airouter.get("/:id", getQuestionSetById);
Airouter.get("/cv/:cvId", getQuestionSetsByCV);
Airouter.get("/cv/:cvId/download-pdf", getQuestionSetsByPDF);
Airouter.patch("/:id/:category/:questionId/notes", updateQuestionNotes);

export default Airouter;
