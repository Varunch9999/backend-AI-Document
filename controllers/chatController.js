import { searchChunks } from "../services/searchService.js";
import { generateAnswer } from "../services/aiService.js";
import { addMessage, getHistory } from "../services/chatMemory.js";

export const askQuestion = async (req, res) => {
  try {

    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const results = await searchChunks(question);

    addMessage("user", question);

    const answer = await generateAnswer(question, results);

    addMessage("assistant", answer);

    res.json({
      question,
      answer,
      sources: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating answer" });
  }
};