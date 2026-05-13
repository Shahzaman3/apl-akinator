import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

// Singleton client initialization
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

/**
 * Enhances the final presentation payload using Gemini AI to generate creative summaries.
 * Uses standard templated fallbacks if API key is absent or fails.
 */
export async function generateIntelligenceReport(
  playerName: string,
  stats: string
): Promise<string> {
  if (!genAI) {
    return `Template Log: ${playerName} stands as an elite IPL player with statistical contribution: ${stats}. Core impact remains extremely high in modern configurations.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Generate a brief, punchy, 1-sentence Akinator-style "Intelligence Report Summary" 
      for IPL player ${playerName}. Incorporate their metric: ${stats}. 
      Keep the tone futuristic, robotic, and analytic. Max 20 words.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || `Analyzed: ${playerName} executes dominant strategies with accuracy matching ${stats}.`;
  } catch (error) {
    console.error("Gemini generation failed, returning fallback:", error);
    return `Strategic Log: ${playerName} maintains elite tier performance with notable metrics: ${stats}.`;
  }
}

/**
 * Generates an optional intelligent question if the deterministic system stalls.
 */
export async function generateDynamicQuestionSuggestion(
  remainingPlayerNames: string[]
): Promise<string | null> {
  if (!genAI || remainingPlayerNames.length < 2) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const list = remainingPlayerNames.slice(0, 10).join(", ");
    const prompt = `
      Analyze this list of IPL players: [${list}].
      Generate ONE unique Yes/No question that divides this specific pool evenly.
      Return ONLY the question text, nothing else. Max 10 words.
    `;

    const result = await model.generateContent(prompt);
    const q = result.response.text().trim();
    return q || null;
  } catch (error) {
    return null;
  }
}
