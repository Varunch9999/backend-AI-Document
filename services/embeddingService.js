import { pipeline } from "@xenova/transformers";

let extractor;

export const loadEmbeddingModel = async () => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractor;
};

export const generateEmbedding = async (text) => {
  const model = await loadEmbeddingModel();

  

  const output = await model(text, { pooling: "mean", normalize: true });

  return Array.from(output.data);
};