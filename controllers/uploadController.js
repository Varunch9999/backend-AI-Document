import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { chunkText } from "../utils/chunkText.js";
import Chunk from "../models/Chunk.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { resetCache } from "../cache/cache.js";

export const uploadPDF = async (req, res) => {

  let filePath;

  try {

    filePath = req.file.path;

    // Read uploaded PDF
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let pages = [];
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map(item => item.str);
      const pageText = strings.join(" ");

      text += pageText + "\n";

      pages.push({
        text: pageText,
        pageNumber: i
      });

    }

    if (!text.trim()) {
  return res.status(400).json({
    error: "This PDF contains no readable text (possibly scanned images)."
  });
}

    let allChunks = [];

    for (const page of pages) {

      const chunks = await chunkText(page.text);

      const chunksWithPage = chunks.map(c => ({
        pageContent: c.pageContent,
        pageNumber: page.pageNumber
      }));

      allChunks.push(...chunksWithPage);

    }

    const chunkTexts = allChunks.map(c => c.pageContent);

    const vectors = await Promise.all(
      chunkTexts.map(text => generateEmbedding(text))
    );

    await Chunk.deleteMany({});

    const documents = allChunks.map((chunk, i) => ({
      chunkText: chunk.pageContent,
      embedding: vectors[i],
      chunkIndex: i,
      pageNumber: chunk.pageNumber
    }));

    await Chunk.insertMany(documents);

    resetCache();

    console.log("Chunks stored:", documents.length);

    res.json({
      message: "PDF processed successfully",
      totalChunks: documents.length,
      preview: chunkTexts.length ? chunkTexts[0].substring(0, 200) : ""
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error processing PDF"
    });

  } finally {

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  }

};