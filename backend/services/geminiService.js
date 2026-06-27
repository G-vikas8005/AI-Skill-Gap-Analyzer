import { GoogleGenAI, Type } from "@google/genai";

export const generateResumeAnalysis = async (resumeText, jobRole) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.5-flash",
    });

    // Provide default fallbacks to ensure string interpolation doesn't yield undefined values
    const targetedRole = jobRole || "Full Stack Developer";
    const cleanedResumeText = resumeText || "";

    const prompt = `
                      JOB ROLE:
                      ${targetedRole}

                      RESUME:
                      ${cleanedResumeText}
                      `;

    // Initialize configuration matching the official modern @google/genai SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],

      config: {
        systemInstruction:
          "You are an expert ATS resume analyzer and career coach. Return ONLY valid JSON.",
        
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
            careerGuidance: { type: Type.STRING },
            interviewTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "atsScore",
            "strengths",
            "missingSkills",
            "weaknesses",
            "improvements",
            "roadmap",
            "careerGuidance",
            "interviewTips",
          ],
        },
      },
    });

    /**
     * =========================
     * SAFE PARSING 
     * =========================
     */
    let parsed;

    try {
      const text = response.text; 

      if (!text) {
        throw new Error("Empty Gemini response");
      }

      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ JSON Parse Failed:");
      console.log("RAW RESPONSE:", response);

      throw new Error("Invalid JSON response from Gemini");
    }

    /**
     * =========================
     * SAFE OUTPUT
     * =========================
     */
    return {
      ...parsed,

      matchQuality:
        parsed.atsScore >= 80
          ? "Excellent"
          : parsed.atsScore >= 60
          ? "Good"
          : parsed.atsScore >= 40
          ? "Average"
          : "Poor",
    };
  } catch (error) {
    console.error("🔥 Gemini Service Error:", error);

    /**
     * =========================
     * PROPER ERROR HANDLING
     * =========================
     */
    if (
      error?.status === 429 ||
      error?.message?.includes("quota")
    ) {
      throw new Error("Gemini API quota exceeded. Try later.");
    }

    if (
      error?.status === 403 ||
      error?.message?.includes("permission")
    ) {
      throw new Error("Gemini API access denied (403). Check API key/model access.");
    }

    throw new Error(error.message || "AI service not configured properly");
  }
};
