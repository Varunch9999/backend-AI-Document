import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "Server running",
    timestamp: new Date()
  });
});

export default router;