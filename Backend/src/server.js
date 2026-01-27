import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/index.js";
import authRoutes from "./routes/auth.js";
import codeRoutes from "./routes/code.js";
import { protect } from "./middleware/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/code", protect, codeRoutes); // 🔒 protected

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
