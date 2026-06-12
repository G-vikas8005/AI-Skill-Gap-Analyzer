import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

/**
 * =========================
 * DATABASE CONNECTION
 * =========================
 */
connectDB();

/**
 * =========================
 * MIDDLEWARES
 * =========================
 */

// Enable CORS (frontend-backend communication)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// URL encoded parser (optional but safe)
app.use(express.urlencoded({ extended: true }));

/**
 * =========================
 * STATIC FILES
 * =========================
 * Used for uploaded resumes access
 */
app.use("/uploads", express.static("uploads"));

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
 * ERROR HANDLING (IMPORTANT)
 * =========================
 */

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/**
 * =========================
 * START SERVER
 * =========================
 */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});