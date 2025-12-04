import { GoogleGenAI } from "@google/genai";
import { BodyPartOption } from "../types";

// NOTE: In a real production app, ensure API keys are secured. 
// We are using process.env.API_KEY as per instructions.

export const getClinicalAdvice = async (
  history: string,
  parts: BodyPartOption[],
  language: 'MS' | 'EN'
): Promise<string> => {
  if (!process.env.API_KEY) {
    return language === 'MS' 
      ? "Kunci API tidak dijumpai. Sila hubungi pentadbir." 
      : "API Key not found. Please contact admin.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const partsList = parts.map(p => `${p.category} (${p.projection})`).join(', ');
    const langInstruction = language === 'MS' ? 'Jawab dalam Bahasa Melayu.' : 'Answer in English.';
    
    const prompt = `
      Context: You are a senior radiologist assistant at UiTM Health Centre.
      Patient History: ${history}
      Requested X-Ray Exams: ${partsList}
      
      Task: Provide brief, bullet-pointed clinical guidelines or precautions for these specific X-Ray examinations based on the history provided. 
      Include any specific patient positioning advice or contraindications if relevant to the history.
      Keep it short and professional.
      ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || (language === 'MS' ? "Tiada nasihat dijana." : "No advice generated.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'MS' 
      ? "Gagal mendapatkan nasihat AI. Sila cuba lagi." 
      : "Failed to get AI advice. Please try again.";
  }
};