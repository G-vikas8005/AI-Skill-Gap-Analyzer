import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

/**
 * =========================
 * DEBUG LOGGER (DEV ONLY)
 * =========================
 */
const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  console.log("🟡 ENV DEBUG MODE ENABLED");
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "MISSING");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "LOADED" : "MISSING");
}

/**
 * =========================
 * SAFE UPLOAD DIRECTORY
 * =========================
 */
const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * =========================
 * MIDDLEWARES
 * =========================
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-skill-gap-analyzer-frontend.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * STATIC FILES (SAFE PATH)
 */
app.use("/uploads", express.static(uploadDir));

/**
 * =========================
 * SIMPLE REQUEST LOGGER (DEBUG FRIENDLY)
 * =========================
 */
app.use((req, res, next) => {
  if (isDev) {
    console.log(`➡️ ${req.method} ${req.url}`);
  }
  next();
});

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Running Successfully 🚀",
  });
});

/**
 * =========================
 * GLOBAL ERROR HANDLER
 * =========================
 */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:");
  console.error(err.stack || err);

  res.status(500).json({
    success: false,
    message: isDev ? err.message : "Internal Server Error",
  });
});

/**
 * =========================
 * SERVER START (SAFE)
 * =========================
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:");
    console.error(err);
    process.exit(1);
  }
};

startServer();