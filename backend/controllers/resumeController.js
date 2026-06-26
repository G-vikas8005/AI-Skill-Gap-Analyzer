import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { analyzePDFLayout } from "../services/pdfLayoutAnalyzer.js";
import { analyzeSkillGap } from "../services/skillGapAnalyzer.js";

/*
========================================
PDF TEXT EXTRACTION
========================================
*/

const extractTextFromPDF = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({
    data,
  }).promise;

  let fullText = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const currentPage = await pdf.getPage(page);

    const textContent =
      await currentPage.getTextContent();

    const pageText = textContent.items
      .map((item) => item.str)
      .join(" ");

    fullText += pageText + "\n";
  }

  return fullText;
};

/*
========================================
RESUME STRUCTURING
========================================
*/

const structureResume = (text) => {
  const lower = text.toLowerCase();

  /*
      Master Skill Dictionary
      Add new skills here whenever needed.
  */

  const skillDictionary = {
    HTML: ["html", "html5"],

    CSS: ["css", "css3"],

    JavaScript: [
      "javascript",
      "js",
      "ecmascript",
    ],

    TypeScript: ["typescript", "ts"],

    React: [
      "react",
      "reactjs",
      "react.js",
    ],

    NextJS: [
      "next",
      "nextjs",
      "next.js",
    ],

    Angular: ["angular"],

    Vue: ["vue"],

    Tailwind: [
      "tailwind",
      "tailwindcss",
    ],

    Bootstrap: ["bootstrap"],

    Git: [
      "git",
      "github",
      "gitlab",
    ],

    "Node.js": [
      "node",
      "nodejs",
      "node.js",
    ],

    Express: [
      "express",
      "expressjs",
    ],

    MongoDB: [
      "mongodb",
      "mongo",
    ],

    SQL: [
      "sql",
      "mysql",
      "postgres",
      "postgresql",
    ],

    Firebase: ["firebase"],

    JWT: [
      "jwt",
      "json web token",
    ],

    REST: [
      "rest api",
      "restful api",
      "restful services",
    ],

    GraphQL: ["graphql"],

    Docker: ["docker"],

    Kubernetes: ["kubernetes"],

    AWS: [
      "aws",
      "amazon web services",
    ],

    Azure: ["azure"],

    GCP: [
      "google cloud",
      "gcp",
    ],

    Python: ["python"],

    Java: ["java"],

    C: [" c "],

    "C++": [
      "c++",
      "cpp",
    ],

    Pandas: ["pandas"],

    NumPy: ["numpy"],

    TensorFlow: [
      "tensorflow",
    ],

    PyTorch: ["pytorch"],

    "Machine Learning": [
      "machine learning",
      "ml",
      "scikit",
      "sklearn",
    ],

    DeepLearning: [
      "deep learning",
    ],

    OpenCV: ["opencv"],

    PowerBI: [
      "power bi",
      "powerbi",
    ],

    Tableau: ["tableau"],

    Excel: ["excel"],

    Linux: ["linux"],

    Postman: ["postman"],

    Figma: ["figma"],

    Redux: ["redux"],

    SocketIO: [
      "socket.io",
      "socketio",
    ],
  };

  /*
      Detect Skills
  */

  const detectedSkills = [];

  Object.entries(skillDictionary).forEach(
    ([skill, aliases]) => {
      const found = aliases.some((alias) =>
        lower.includes(alias.toLowerCase())
      );

      if (found) {
        detectedSkills.push(skill);
      }
    }
  );

  /*
      Email Detection
  */

  const emails =
    text.match(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
    ) || [];

  /*
      Phone Detection
  */

  const phones =
    text.match(
      /(\+?\d[\d\s-]{8,15})/g
    ) || [];

  return {
    rawText: text,

    emails,

    phones,

    skills: detectedSkills,

    experience: [],

    education: [],

    projects: [],
  };
};

/*
========================================
UPLOAD RESUME CONTROLLER
========================================
*/

export const uploadResume = async (req, res) => {
  try {
    /*
    =============================
    Validate Upload
    =============================
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const selectedRole = req.body.selectedRole || "";

    const filePath = req.file.path;

    /*
    =============================
    Extract Resume Text
    =============================
    */

    const extractedText =
      await extractTextFromPDF(filePath);

    if (
      !extractedText ||
      extractedText.trim().length < 20
    ) {
      throw new Error(
        "Unable to extract enough text from PDF."
      );
    }

    /*
    =============================
    Clean Text
    =============================
    */

    const cleanedText = extractedText
      .replace(/\r/g, "")
      .replace(/\n+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    /*
    =============================
    Structure Resume
    =============================
    */

    const structuredResume =
      structureResume(cleanedText);

    /*
    =============================
    ATS Layout Analysis
    =============================
    */

    const layoutAnalysis =
      await analyzePDFLayout(filePath);

    /*
    =============================
    Skill Gap Analysis
    =============================
    */

    const skillGapAnalysis =
      analyzeSkillGap(
        structuredResume.skills,
        selectedRole
      );

    /*
    =============================
    Debug Logs
    =============================
    */

    console.log("\n==============================");
    console.log("Selected Role:");
    console.log(selectedRole);

    console.log("\nDetected Skills:");
    console.log(structuredResume.skills);

    console.log("\nSkill Gap:");
    console.log(skillGapAnalysis);

    console.log("==============================\n");

    /*
    =============================
    Send Response
    =============================
    */

    return res.status(200).json({
      success: true,

      message: "Resume parsed successfully",

      extractedText: cleanedText,

      structuredResume,

      layoutAnalysis,

      skillGapAnalysis,
    });
  } catch (error) {
    console.error(
      "Resume Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to process resume.",
    });
  }
};