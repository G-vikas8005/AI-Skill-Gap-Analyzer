import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

try {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Say hello and explain the what is Barath and india",
  });

  console.log(response.text);

} catch (error) {
  console.error("FULL ERROR:");
  console.error(error);
}