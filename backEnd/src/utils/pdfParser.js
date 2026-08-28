import axios from "axios";
import { PDFParse } from "pdf-parse";

export const extractTextFromPdfUrl = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  const buffer = Buffer.from(response.data);

  const parser = new PDFParse({ data: buffer });   // 👈 "new" ke saath
  const result = await parser.getText();            // 👈 method call, direct function nahi

  const text = result.text?.trim();

  if (!text) {
    throw new Error("Could not extract text from PDF — file may be scanned/image-based");
  }

  return text;
};