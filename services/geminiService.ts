import { GoogleGenAI, Type } from "@google/genai";
import { Student } from '../types';
import { GEMINI_MODEL_FLASH, getRandomAvatar } from '../constants';

// Initialize API safely
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSampleClass = async (count: number = 10): Promise<Student[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning fallback data");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: `Generate a list of ${count} fictional students with diverse names and realistic test scores (0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.INTEGER },
            },
            required: ["name", "score"],
          },
        },
      },
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((item: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      name: item.name,
      score: item.score,
      avatar: getRandomAvatar(), // Assign a random cute face
    }));
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate class data using AI.");
  }
};

export const analyzePerformance = async (students: Student[]): Promise<string> => {
  if (!process.env.API_KEY) return "API Key required for analysis.";

  const studentSummary = students.map(s => `${s.name}: ${s.score}`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: `Analyze the following class performance data. Provide a brief, encouraging summary (max 3 sentences) highlighting the top performer and the general class average trend. Data: ${studentSummary}`,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Analysis error:", error);
    return "Error generating analysis.";
  }
};