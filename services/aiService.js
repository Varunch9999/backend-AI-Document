import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { getHistory } from "./chatMemory.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAnswer = async (question, chunks) => {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const context = chunks.map(c => c.text).join("\n\n");

    const history = getHistory()
      .map(m => `${m.role}: ${m.message}`)
      .join("\n");

    const prompt = `
Conversation history:
${history}

Answer the question using ONLY the context below.

Context:
${context}

Question:
${question}

If the answer is not in the context, say:
"I cannot find this information in the document."
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    return result.response.text();

  } catch (error) {

    console.error("Gemini error:", error);
    throw error;

  }
};