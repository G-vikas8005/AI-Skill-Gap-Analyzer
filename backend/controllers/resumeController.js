import fs from "fs";
import express from "express";
import multer from "multer";
import path from "path";

// import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs"; // ✅ FIXED IMPORT
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"; // ✅ FIXED IMPORT
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

import { analyzePDFLayout } from "../services/pdfLayoutAnalyzer.js";
import { analyzeSkillGap } from "../services/skillGapAnalyzer.js";
import { generateResumeAnalysis } from "../services/geminiService.js";



/* =========================
   DEBUG HELPER
========================= */
const debug = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("🟡", ...args);
  }
};

/* =========================
   UPLOAD DIR
========================= */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/* =========================
   PDF EXTRACTION
========================= */
const extractTextFromPDF = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found on server");
    }

    // Fix: Force the library to run without an external worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = null;

    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      fullText += content.items.map((item) => item.str).join(" ") + "\n";
    }

    return fullText;
  } catch (err) {
    console.error("❌ PDF Extraction Error:", err);
    throw new Error("PDF extraction failed");
  }
};


/* =========================
   STRUCTURE RESUME
========================= */
const structureResume = (text) => {
  const lower = text.toLowerCase();

  const skillDictionary = {
    HTML: ["html"],
    CSS: ["css"],
    JavaScript: ["javascript", "js"],
    React: ["react"],
    Node: ["node", "nodejs"],
    Express: ["express"],
    MongoDB: ["mongodb"],
    SQL: ["sql", "mysql"],
    Git: ["git"],
    Python: ["python"],
    Java: ["java"],
  };

  const skills = [];

  Object.entries(skillDictionary).forEach(([skill, aliases]) => {
    if (aliases.some((a) => lower.includes(a))) {
      skills.push(skill);
    }
  });

  return {
    rawText: text,
    emails: text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [],
    phones: text.match(/\+?\d[\d\s-]{8,}/g) || [],
    skills,
    experience: [],
    education: [],
    projects: [],
  };
};

/* =========================
   CONTROLLER
========================= */
export const uploadResume = async (req, res) => {
  let filePath;

  try {
    debug("Upload request received");

    if (!req.file) {
      debug("No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const selectedRole = req.body.selectedRole || "";
    filePath = req.file.path;

    debug("File:", filePath);
    debug("Role:", selectedRole);

    const extractedText = await extractTextFromPDF(filePath);

    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error("Unable to extract meaningful text");
    }

    const cleanedText = extractedText.replace(/\s+/g, " ").trim();

    const structured = structureResume(cleanedText);

    const layout = await analyzePDFLayout(filePath);

    const skillGap = analyzeSkillGap(structured.skills || [], selectedRole);

    let aiAnalysis = null;

    try {
      aiAnalysis = await generateResumeAnalysis(cleanedText, selectedRole);
    } catch (err) {
      console.log("⚠️ AI skipped:", err.message);
    }

    return res.json({
      success: true,
      extractedText: cleanedText,
      structuredResume: structured,
      layoutAnalysis: layout,
      skillGapAnalysis: skillGap,
      aiAnalysis,
    });
  } catch (err) {
    console.error("❌ Upload Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   ROUTE
========================= */
const router = express.Router();

router.post("/upload", upload.single("resume"), uploadResume);

export default router;