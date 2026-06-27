import { generateResumeAnalysis } from "../services/geminiService.js";
import { parseResumeToATS } from "../services/atsParserService.js";

/*
========================================
AI RESUME ANALYSIS CONTROLLER
========================================
*/

export const analyzeResumeWithAI = async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;

    // Validation
    if (!resumeText || !jobRole) {
      return res.status(400).json({
        success: false,
        message: "Resume text and job role are required",
      });
    }

    console.log("================================");
    console.log("AI ANALYSIS STARTED");
    console.log("Job Role:", jobRole);
    console.log("Resume Preview:", resumeText.slice(0, 120) + "...");
    console.log("================================");

    // AI CALL
    const aiResponse = await generateResumeAnalysis(
      resumeText,
      jobRole
    );

    return res.status(200).json({
      success: true,
      message: "AI analysis generated successfully",
      aiResponse,
    });
  } catch (error) {
    console.error("❌ Gemini Controller Error:", error);

    // RATE LIMIT ERROR
    if (error?.status === 429 || error?.code === 429) {
      return res.status(429).json({
        success: false,
        message: "Gemini API quota exceeded. Try again later.",
        aiResponse: null,
      });
    }

    // CONFIG ERROR
    if (error?.message?.includes("API key")) {
      return res.status(500).json({
        success: false,
        message: "AI service not configured properly",
        aiResponse: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "AI analysis failed",
      aiResponse: null,
    });
  }
};

/*
========================================
ATS STRUCTURE CONTROLLER
========================================
*/

export const getATSStructure = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
    }

    const result = await parseResumeToATS(resumeText);

    return res.status(200).json({
      success: true,
      message: "ATS structure generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ ATS Parser Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "ATS parsing failed",
    });
  }
};