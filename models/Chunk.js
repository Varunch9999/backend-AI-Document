import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  chunkText: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], 
    required: true,
  },
  pageNumber: {
    type: Number,
  },
  chunkIndex: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chunk = mongoose.model("Chunk", chunkSchema);

export default Chunk;