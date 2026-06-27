import fs from "fs";
import path from "path";

import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

/**
 * Create uploads folder if it doesn't exist
 */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Multer Storage Configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/**
 * Resume Upload Route
 */
router.post("/upload", upload.single("resume"), uploadResume);

export default router;