export const buildResumePrompt = (text) => {
  return `
You are an expert ATS resume parser.

Extract structured JSON from this resume text.

RULES:
- Return ONLY valid JSON
- No explanation
- If field missing use empty string or empty array
- Normalize skills into array
- Normalize experience into structured list
- Detect email, phone if present

OUTPUT FORMAT:
{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [],
  "education": [],
  "projects": []
}

RESUME TEXT:
"""${text}"""
`;
};