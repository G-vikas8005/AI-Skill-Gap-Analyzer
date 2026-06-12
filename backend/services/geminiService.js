import { GoogleGenAI } from "@google/genai";

export const generateResumeAnalysis = async (
  resumeText,
  jobRole
) => {
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
You are an expert ATS resume analyzer and career coach.

Analyze the resume for this job role:

${jobRole}

Resume:

${resumeText}

Return output in STRICT JSON format only:

{
  "atsScore": number,
  "strengths": string[],
  "missingSkills": string[],
  "weaknesses": string[],
  "improvements": string[],
  "roadmap": string[],
  "careerGuidance": string,
  "interviewTips": string[]
}

Do NOT include markdown.
Do NOT include backticks.
Do NOT include explanations.
Only return valid JSON.
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
    | CLEAN JSON RESPONSE
    |--------------------------------------------------------------------------
    */

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanText);
    } catch (err) {
      console.error(
        "Gemini JSON Parse Error:"
      );
      console.error(cleanText);

      throw new Error(
        "AI returned invalid JSON format"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CONVERT JSON → HUMAN READABLE REPORT
    |--------------------------------------------------------------------------
    */

    const report = `
ATS SCORE
${parsed.atsScore ?? "N/A"}%

━━━━━━━━━━━━━━━━━━━━

✅ STRENGTHS

${
  parsed.strengths?.length
    ? parsed.strengths
        .map((item) => `• ${item}`)
        .join("\n")
    : "No strengths identified."
}

━━━━━━━━━━━━━━━━━━━━

❌ MISSING SKILLS

${
  parsed.missingSkills?.length
    ? parsed.missingSkills
        .map((item) => `• ${item}`)
        .join("\n")
    : "No missing skills."
}

━━━━━━━━━━━━━━━━━━━━

⚠️ WEAKNESSES

${
  parsed.weaknesses?.length
    ? parsed.weaknesses
        .map((item) => `• ${item}`)
        .join("\n")
    : "No weaknesses identified."
}

━━━━━━━━━━━━━━━━━━━━

🚀 IMPROVEMENTS

${
  parsed.improvements?.length
    ? parsed.improvements
        .map((item) => `• ${item}`)
        .join("\n")
    : "No recommendations."
}

━━━━━━━━━━━━━━━━━━━━

🛣️ LEARNING ROADMAP

${
  parsed.roadmap?.length
    ? parsed.roadmap
        .map(
          (item, index) =>
            `${index + 1}. ${item}`
        )
        .join("\n")
    : "No roadmap generated."
}

━━━━━━━━━━━━━━━━━━━━

🎯 CAREER GUIDANCE

${parsed.careerGuidance || "No guidance available."}

━━━━━━━━━━━━━━━━━━━━

💼 INTERVIEW TIPS

${
  parsed.interviewTips?.length
    ? parsed.interviewTips
        .map((item) => `• ${item}`)
        .join("\n")
    : "No interview tips available."
}
`;
    console.log(response.data);
    console.log(report);
    return report;
  } catch (error) {
    console.error(
      "Gemini Service Error:",
      error
    );

    if (
      error?.status === 429 ||
      error?.message?.includes("quota")
    ) {
      throw new Error(
        "Gemini API quota exceeded. Try again later."
      );
    }

    throw new Error(
      error?.message ||
        "AI analysis failed"
    );
  }
};