import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (text) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
Summarize the following document in 5 concise bullet points.

Document:
${text.slice(0, 6000)}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};