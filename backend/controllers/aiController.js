import { generateResumeAnalysis } from "../services/geminiService.js";
import { parseResumeToATS } from "../services/atsParserService.js";

export const analyzeResumeWithAI = async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !jobRole) {
      return res.status(400).json({
        success: false,
        message: "Resume Text And Job Role Required",
      });
    }

    console.log("Generating AI Analysis...");
    console.log("Job Role:", jobRole);
    console.log(
      "Resume Text Sample:",
      resumeText.slice(0, 100) + "..."
    );

    const aiResponse = await generateResumeAnalysis(
      resumeText,
      jobRole
    );

    return res.status(200).json({
      success: true,
      message: "AI Analysis Generated Successfully",
      aiResponse,
    });
  } catch (error) {
    console.error("Gemini Error:");
    console.error("Status:", error?.status);
    console.error("Message:", error?.message);

    if (error?.status === 429 || error?.code === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Gemini API quota exceeded. Please try again later.",
        aiResponse: null,
      });
    }

    if (
      error?.message?.includes("default credentials")
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Gemini API configuration error.",
        aiResponse: null,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message || "AI Service Unavailable",
      aiResponse: null,
    });
  }
};

export const getATSStructure = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text required",
      });
    }

    const result = await parseResumeToATS(
      resumeText
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("ATS Parser Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "ATS parsing failed",
    });
  }
};