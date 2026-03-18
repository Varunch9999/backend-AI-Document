import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler.js";



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});



dotenv.config();



const app = express();

connectDB();

// Middleware
app.use(cors({ 
    origin: ["http://localhost:5173","https://frontend-ai-document.vercel.app"],
    credentials: true 
}));
app.use(express.json());


app.use("/api", healthRoutes);
app.use("/api", uploadRoutes);
app.use("/api", chatRoutes);
app.use("/api", summaryRoutes);
app.use("/api", suggestionRoutes);
app.use(limiter);
app.use(errorHandler);


// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});