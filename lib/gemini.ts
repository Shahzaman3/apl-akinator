import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

// Singleton client initialization
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export interface IDynamicQuestionResponse {
  question: string;
  subtitle: string;
  evaluations: Record<string, "YES" | "NO" | "MAYBE">;
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
    return `Telemetry Log: ${playerName} stands as an elite IPL contributor. Key metrics: ${stats}. Strategic role validated.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
 * Resilient Retry Helper to handle transient Google rate limits (429s) gracefully.
 */
async function generateContentWithRetry(model: any, prompt: string, retries = 2, delayMs = 1500): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error: any) {
      const isRateLimit = error && (error.status === 429 || (error.message && error.message.includes("429")));
      if (isRateLimit && i < retries - 1) {
        console.warn(`Gemini API Retry: Hit 429 Rate Limit. Waiting ${delayMs}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw error;
    }
  }
}

/**
 * Advanced Gemini Coprocessor: Dynamically generates a discriminative question
 * and returns evaluation mappings for every remaining player in the active pool.
 */
export async function generateDynamicQuestionAndEvaluations(
  activePlayers: any[]
): Promise<IDynamicQuestionResponse | null> {
  if (!genAI || activePlayers.length === 0) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.85 // Higher temperature for rich, creative question diversity
      }
    });

    // Strip down players to essential fields to fit context window and maximize processing efficiency
    const playerSummaries = activePlayers.slice(0, 20).map((p) => ({
      name: p.name,
      country: p.country,
      role: p.role,
      battingStyle: p.battingStyle,
      bowlingStyle: p.bowlingStyle,
      teams: p.teams,
      active: p.active,
      retired: p.retired,
      iplTitles: p.iplTitles,
      debutYear: p.debutYear,
      careerRuns: p.careerRuns,
      playingStyle: p.playingStyle,
      signatureMetric: p.signatureMetric
    }));

    // Random Focus Themes to ensure 100% unique question variety
    const focusThemes = [
      "temporal eras, age brackets, or specific debut cohorts",
      "franchise championship wins, IPL titles, trophies, and team success",
      "player roles, wicketkeeper status, captaincy records, or batting styles",
      "franchise history, team loyalty, transfers, or representing multiple different IPL teams",
      "playing archetypes, power hitting, domestic vs overseas classification, or bowling style variety",
      "individual career milestones, performance statistics, and specialized elite skills",
      "playing style specifics, signature metrics, batting positions, or bowling speed classifications"
    ];

    const selectedTheme = focusThemes[Math.floor(Math.random() * focusThemes.length)];
    
    // Choose a random player from the top 5 active pool to act as a creative spark/inspiration
    const focusCandidate = playerSummaries.length > 0
      ? playerSummaries[Math.floor(Math.random() * Math.min(playerSummaries.length, 5))]
      : null;
    
    const focalInspiration = focusCandidate 
      ? `Inspired by player '${focusCandidate.name}' who is a ${focusCandidate.role} and has won ${focusCandidate.iplTitles} titles (use these parameters as a focal point to divide the pool, but DO NOT name the player in the question!)`
      : "No specific focal player, focus purely on dividing the pool dynamically.";

    const prompt = `
      You are the CricIntel AI Akinator engine.
      Your goal is to formulate a highly discriminative, clever, and unique Yes/No question to split this candidate pool of IPL players.
      
      MANDATORY DIVERSITY TARGET (GENERATE RANDOM / UNIQUE QUESTIONS):
      To prevent the game from being repetitive or asking the same opening question, you MUST target this specific gameplay focus:
      - FOCUS GAMEPLAY THEME: ${selectedTheme}
      - CREATIVE FOCAL SPARK: ${focalInspiration}
      
      Here is the candidate pool:
      ${JSON.stringify(playerSummaries, null, 2)}
      
      Instructions:
      1. Analyze the attributes and records of these players.
      2. Formulate one clever Yes/No question related to the FOCUS THEME that divides this pool. Keep the question crisp, engaging, and readable (e.g., "Is the player a domestic Indian batsman who debuted in 2015 or later?", "Has this player won 2 or more IPL titles?").
      3. Make sure the question splits the candidate pool as evenly as possible (some players are YES, some are NO, some are MAYBE).
      4. Create a technical, robotic telemetry subtitle describing the information gain focus.
      5. Provide an evaluation (YES, NO, or MAYBE) for EVERY player in the provided candidate pool list.
      
      Return ONLY a JSON object matching this schema:
      {
        "question": "The question text here?",
        "subtitle": "Technical subtitle here.",
        "evaluations": {
          "Player Name 1": "YES",
          "Player Name 2": "NO",
          ...
        }
      }
    `;

    const result = await generateContentWithRetry(model, prompt);
    const text = result.response.text().trim();
    const data = JSON.parse(text) as IDynamicQuestionResponse;

    if (data && data.question && data.evaluations) {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Gemini dynamic question generation failed:", error);
    return null;
  }
}
