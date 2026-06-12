import { GoogleGenAI } from "@google/genai";

/**
 * Convert Resume Text -> ATS Structured JSON
 */
export const parseResumeToATS = async (resumeText) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY not configured"
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an expert ATS resume parser.

Convert the following resume into STRICT JSON only.

Rules:
- Return ONLY valid JSON
- No explanation
- No markdown
- No backticks
- No extra text

JSON format:

{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "techStack": []
    }
  ],
  "certifications": [],
  "summary": ""
}

Resume:

${resumeText}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const rawText = response.text;

    if (!rawText) {
      throw new Error(
        "Empty response received from Gemini"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CLEAN RESPONSE
    |--------------------------------------------------------------------------
    */

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "ATS JSON Parse Error:"
      );
      console.error(cleanedText);

      throw new Error(
        "Invalid JSON returned by Gemini"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ENSURE REQUIRED STRUCTURE
    |--------------------------------------------------------------------------
    */

    return {
      name: parsed.name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      skills: Array.isArray(parsed.skills)
        ? parsed.skills
        : [],
      experience: Array.isArray(
        parsed.experience
      )
        ? parsed.experience
        : [],
      education: Array.isArray(
        parsed.education
      )
        ? parsed.education
        : [],
      projects: Array.isArray(
        parsed.projects
      )
        ? parsed.projects
        : [],
      certifications: Array.isArray(
        parsed.certifications
      )
        ? parsed.certifications
        : [],
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error(
      "ATS Parsing Error:",
      error
    );

    /*
    |--------------------------------------------------------------------------
    | SAFE FALLBACK
    |--------------------------------------------------------------------------
    */

    return {
      name: "",
      email: "",
      phone: "",
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      summary: "",
      error: true,
      message:
        error.message ||
        "Failed to parse resume into ATS format",
    };
  }
};