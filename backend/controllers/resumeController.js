import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { analyzePDFLayout } from "../services/pdfLayoutAnalyzer.js";
import { analyzeSkillGap } from "../services/skillGapAnalyzer.js";

/**
 * Extract PDF text (UNCHANGED BEHAVIOR)
 */
const extractTextFromPDF = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const strings = content.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
};

//Struture resume
const structureResume = (text) => {
  const keywords = [
    "html",
    "css",
    "javascript",
    "react",
    "tailwind",
    "git",
    "node.js",
    "express",
    "mongodb",
    "rest api",
    "jwt",
    "python",
    "pandas",
    "numpy",
    "machine learning",
    "sql",
    "data visualization",
  ];

  return {
    rawText: text,

    emails:
      text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      ) || [],

    phones:
      text.match(
        /(\+?\d[\d\s-]{8,15})/g
      ) || [],

    skills: keywords.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    ),

    experience: [],
    education: [],
    projects: [],
  };
};


/**
 * Controller (UNCHANGED OUTPUT STRUCTURE)
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const selectedRole = req.body.selectedRole || "";
    const filePath = req.file.path;

    // STEP 1 - extract text
    let text = await extractTextFromPDF(filePath);

    if (!text || text.trim().length < 20) {
      throw new Error("Low text extraction");
    }

    // STEP 2 - clean text
    const cleaned = text
      .replace(/\s+/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();

    // STEP 3 - structured resume (unchanged logic placeholder)
   const structuredResume = structureResume(cleaned);

    // STEP 4 - FIXED CALL (IMPORTANT)
    const layoutAnalysis = await analyzePDFLayout(filePath); // 👈 FIXED HERE

    // STEP 5 - skill gap
    const skillGapAnalysis = analyzeSkillGap(
      structuredResume.skills || [],
      selectedRole
    );

    return res.status(200).json({
      success: true,
      message: "Resume parsed successfully",

      extractedText: cleaned,
      structuredResume,
      layoutAnalysis,
      skillGapAnalysis,
    });

  } catch (error) {
    console.error("Resume parsing error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process resume",
    });
  }
};