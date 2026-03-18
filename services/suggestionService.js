import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSuggestions = async (text) => {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are analyzing a document.

Generate 5 short and relevant questions that someone might ask about THIS document.

Rules:
- Questions must be based strictly on the document content.
- Each question must be clear and specific.
- Return only the questions.
- One question per line.
- Do NOT add bullet points or numbering.

Document:
${text.slice(0, 6000)}
`;

  const result = await model.generateContent(prompt);

  const responseText = result.response.text();

  
  const questions = responseText
  .split("\n")
  .map(q => q.replace(/^[-•*\d.]+\s*/, "").trim())
  .filter(q => q.length > 0);

  return questions;
};