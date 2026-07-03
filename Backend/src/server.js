import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import codeRoutes from "./routes/code.js";
import userRoutes from "./routes/user.js";
import { protect } from "./middleware/auth.js";
import health from "./routes/health.js"
dotenv.config();
connectDB(process.env.MONGO_DB_URL);//
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/code", codeRoutes); // 🔒 protected
app.use("/api/user",userRoutes);
app.use("/api",health);
const PORT = process.env.PORT || 3000; // ready Deploye
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
