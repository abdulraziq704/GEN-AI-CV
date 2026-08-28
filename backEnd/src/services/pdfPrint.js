// services/pdfPrint.js
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const pdfMakeModule = require("pdfmake");
const PdfPrinter = pdfMakeModule.default || pdfMakeModule;

const fonts = {
  Roboto: {
    normal: path.join(process.cwd(), "assets/fonts/Roboto-Regular.ttf"),
    bold: path.join(process.cwd(), "assets/fonts/Roboto-Medium.ttf"),
    italics: path.join(process.cwd(), "assets/fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(process.cwd(), "assets/fonts/Roboto-MediumItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

// Matches CATEGORY_CONFIG in your CvQuestion.jsx
const CATEGORY_LABELS = {
  technical: "Technical Expertise",
  behavioral: "Behavioral & Soft Skills",
  projectBased: "Project Based",
  fieldBasics: "Field Basics",
};

/**
 * Builds the pdfmake docDefinition from a QuestionSet document.
 * questionSetDoc shape: { title, cv, technical: [], behavioral: [], projectBased: [], fieldBasics: [] }
 * each question: { questionText, relatedTo, userNotes }
 */
export function buildInterviewPrepDocDefinition({ cvTitle, questionSetDoc }) {
  const categoryKeys = Object.keys(CATEGORY_LABELS).filter(
    (key) => Array.isArray(questionSetDoc[key]) && questionSetDoc[key].length > 0
  );

  const totalQuestions = categoryKeys.reduce(
    (sum, key) => sum + questionSetDoc[key].length,
    0
  );

  const content = [
    { text: "Interview Preparation", style: "title" },
    {
      text: `${totalQuestions} targeted questions${cvTitle ? ` for ${cvTitle}` : ""}`,
      style: "subtitle",
    },
  ];

  categoryKeys.forEach((key) => {
    const questions = questionSetDoc[key];
    const label = CATEGORY_LABELS[key] || key;

    content.push({
      text: `${label} (${questions.length})`,
      style: "category",
      margin: [0, 20, 0, 10],
    });

    questions.forEach((q, i) => {
      content.push({
        text: [
          { text: `#${i + 1}  `, bold: true },
          q.questionText || "",
        ],
        margin: [0, 0, 0, 4],
      });

      if (q.relatedTo) {
        content.push({
          text: q.relatedTo,
          style: "tag",
          margin: [0, 0, 0, 6],
        });
      }

      if (q.userNotes?.trim()) {
        content.push({
          text: `Notes: ${q.userNotes.trim()}`,
          style: "notes",
          margin: [0, 0, 0, 10],
        });
      } else {
        content.push({ text: "", margin: [0, 0, 0, 8] });
      }
    });
  });

  return {
    content,
    styles: {
      title: { fontSize: 32, bold: true },
      subtitle: { fontSize: 11, color: "gray", margin: [0, 4, 0, 0] },
      category: { fontSize: 15, bold: true, color: "#111" },
      tag: { fontSize: 9, color: "#888" },
      notes: { fontSize: 10, italics: true, color: "#444" },
    },
    defaultStyle: { font: "Roboto", fontSize: 11, lineHeight: 1.3 },
    pageMargins: [40, 40, 40, 40],
  };
}

/**
 * Generates a PDF buffer (no res coupling — reusable, testable, cacheable)
 */
export function generateInterviewPrepPdfBuffer({ cvTitle, questionSetDoc }) {
  return new Promise((resolve, reject) => {
    try {
      const docDefinition = buildInterviewPrepDocDefinition({ cvTitle, questionSetDoc });
      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      const chunks = [];
      pdfDoc.on("data", (chunk) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.on("error", reject);

      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
}