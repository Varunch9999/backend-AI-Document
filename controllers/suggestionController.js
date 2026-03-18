import Chunk from "../models/Chunk.js";
import { generateSuggestions } from "../services/suggestionService.js";
import { getCachedSuggestions, setCachedSuggestions } from "../cache/cache.js";

export const getSuggestions = async (req, res) => {
  try {

    const cached = getCachedSuggestions();
    if (cached) {
      return res.json({ questions: cached });
    }

    const chunks = await Chunk.find().sort({ chunkIndex: 1 });

    if (!chunks.length) {
      return res.status(400).json({
        error: "No document uploaded"
      });
    }

    const documentText = chunks.map(c => c.chunkText).join("\n");

    const suggestions = await generateSuggestions(documentText);

    setCachedSuggestions(suggestions);

    res.json({ questions: suggestions });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error generating suggestions"
    });

  }
};