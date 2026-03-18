import Chunk from "../models/Chunk.js";
import { generateEmbedding } from "./embeddingService.js";

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dot / (magA * magB);
}

export const searchChunks = async (question) => {

  
  const queryEmbedding = await generateEmbedding(question);

  
  const chunks = await Chunk.find();

 const scoredChunks = chunks.map(chunk => ({
  text: chunk.chunkText,
  page: chunk.pageNumber,
  score: cosineSimilarity(queryEmbedding, chunk.embedding)
}));

  
  scoredChunks.sort((a, b) => b.score - a.score);

  
  return scoredChunks.slice(0, 5);
};