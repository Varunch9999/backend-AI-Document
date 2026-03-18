import express from "express";
import multer from "multer";
import { uploadPDF } from "../controllers/uploadController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, 
});

router.post("/upload", upload.single("file"), uploadPDF);

export default router;