import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/* ---------------------------------------------------------
   1. ZOD SCHEMA — mirrors your questionSchema in QuestionSet model
   Used to validate Gemini's output AFTER parsing, before saving.
--------------------------------------------------------- */
const questionItemSchema = z.object({
  questionText: z.string().min(10, "Question text too short/empty"),
  relatedTo: z.string().min(1, "relatedTo must reference a CV item"),
});

export const questionSetAISchema = z.object({
  title: z
    .string()
    .min(2, "Title too short")
    .max(80, "Title too long"),
  technical: z.array(questionItemSchema),
  projectBased: z.array(questionItemSchema),
  behavioral: z.array(questionItemSchema),
  fieldBasics: z.array(questionItemSchema),
});

/* ---------------------------------------------------------
   2. GEMINI SCHEMA — controls what shape the model outputs.
   Uses Gemini's own Type enum (OpenAPI-subset), NOT zod.
--------------------------------------------------------- */
const questionItemGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    questionText: {
      type: Type.STRING,
      description:
        "The full interview question, phrased naturally the way an interviewer would ask it.",
    },
    relatedTo: {
      type: Type.STRING,
      description:
        "The exact skill, tech, project name, or role from the CV this question is testing.",
    },
  },
  required: ["questionText", "relatedTo"],
};

const questionSetGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description:
        "A short 2-5 word job title that best fits this candidate, inferred from their CV — e.g. 'Senior Frontend Developer', 'Full Stack MERN Developer'. This is what identifies the question set in the dashboard, so keep it specific to the candidate's actual experience, not generic.",
    },
    technical: { type: Type.ARRAY, items: questionItemGeminiSchema },
    projectBased: { type: Type.ARRAY, items: questionItemGeminiSchema },
    behavioral: { type: Type.ARRAY, items: questionItemGeminiSchema },
    fieldBasics: { type: Type.ARRAY, items: questionItemGeminiSchema },
  },
  required: ["technical", "projectBased", "behavioral", "fieldBasics"],
};

/* ---------------------------------------------------------
   3. PROMPT BUILDER
--------------------------------------------------------- */
const buildPrompt = (cvText, counts) => `
You are a senior technical interviewer preparing a candidate for a real job interview.

Read the CV text below and generate interview questions STRICTLY grounded in what is actually written there. Do not invent skills, companies, or projects that don't appear in the CV.

CV TEXT:
"""
${cvText}
"""

Generate exactly:
- ${counts.technical} TECHNICAL questions — deep questions on the specific languages,university studied material like oops , databases, and tools/techs mentioned in the CV.
- ${counts.projectBased} PROJECT-BASED questions — about the specific projects listed: architecture decisions, trade-offs, challenges, "why did you choose X over Y".
- ${counts.behavioral} BEHAVIORAL questions — teamwork, ownership, conflict, deadlines — grounded in the roles/experience described.
- ${counts.fieldBasics} FIELD BASICS questions — fundamental concepts someone at this experience level in this field should know, even if not explicitly stated in the CV.

Rules:
- Every question must set "relatedTo" to the specific CV item it's testing (a skill name, project name, or role). For fieldBasics, use the general domain/topic if no single CV item applies.
- No generic filler like "Tell me about yourself" or "What are your strengths".
- Vary difficulty — mix a few easy warm-ups with harder, probing follow-up-style questions.
`;

/* ---------------------------------------------------------
   4. MAIN FUNCTION
   NOTE: this throws on failure instead of swallowing errors —
   your BullMQ worker/controller should catch it and flip
   QuestionSet.status to "failed". Silently console.log()-ing
   the error (like your original stub) hides failures from the queue.
--------------------------------------------------------- */
export const AIresponse = async ({
  cvText,
  counts = { technical: 25, projectBased: 10, behavioral: 5, fieldBasics: 10 },
}) => {
  if (!cvText) {
    throw new Error("cvText is missing");
  }

  const aiprompt = buildPrompt(cvText, counts);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: aiprompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: questionSetGeminiSchema,
      temperature: 0.7,
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("Gemini returned an empty response");
  }

  let parsedJson;
  try {
    parsedJson = JSON.parse(rawText);
    
   } catch (err) {
    throw new Error(`Gemini returned invalid JSON: ${err.message}`);
  }

  const validation = questionSetAISchema.safeParse(parsedJson);
  if (!validation.success) {
    console.error("AI schema validation failed:", validation.error.flatten());
    throw new Error("AI output did not match expected structure");
  }
  console.log("VALIDATED DATA:", validation.data); // <-- add this

  // validation.data is now typed/safe and maps 1:1 onto
  // QuestionSet.technical / projectBased / behavioral / fieldBasics
  return validation.data;
};
