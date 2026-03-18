import Chunk from "../models/Chunk.js";
import { generateSummary } from "../services/summaryService.js";
import { getCachedSummary, setCachedSummary } from "../cache/cache.js";

export const getSummary = async (req, res) => {
  try {

    const cached = getCachedSummary();
    if (cached) {
      return res.json({ summary: cached });
    }

    const chunks = await Chunk.find().sort({ chunkIndex: 1 });

    if (!chunks.length) {
      return res.status(400).json({
        error: "No document uploaded"
      });
    }

    const documentText = chunks.map(c => c.chunkText).join("\n");

    const summary = await generateSummary(documentText);

    setCachedSummary(summary);

    res.json({ summary });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error generating summary"
    });

  }
};