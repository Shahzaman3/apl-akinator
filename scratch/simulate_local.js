const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// 1. Manually load environment variables from .env into process.env
const envPath = path.join(__dirname, "..", ".env");
try {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    if (line.includes("=")) {
      const parts = line.split("=");
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim();
      process.env[key] = val;
    }
  }
  console.log("Loaded env variables. GEMINI_API_KEY active:", !!process.env.GEMINI_API_KEY);
} catch (err) {
  console.error("Failed to load .env file:", err);
}

// Ensure the local database is connected
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/apl";

// Import our upgraded modules directly!
const { questionEngine } = require("../lib/questionEngine");
const Player = require("../models/Player").default || require("../models/Player");

async function simulate() {
  console.log("\n=======================================================");
  console.log("CRICINTEL LIVE GEMINI - LOCAL IN-MEMORY GAMEPLAY TEST");
  console.log("=======================================================");

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB database.");

  // Fetch MS Dhoni as target player
  const targetName = "MS Dhoni";
  const player = await Player.findOne({ name: targetName }).lean();
  if (!player) {
    console.error(`Target player ${targetName} not found in database!`);
    await mongoose.disconnect();
    return;
  }
  console.log(`Target player loaded: ${player.name} (${player.role}, ${player.teams.join(", ")})`);

  // Load all players from database for the engine cache
  const allPlayers = await Player.find({});
  const totalPlayers = allPlayers.length;
  console.log(`Loaded ${totalPlayers} players into candidate list.`);

  // Initialize Bayesian probabilities Map (uniform distribution P(x) = 1/N)
  const initialWeight = 1.0 / totalPlayers;
  let probabilitiesMap = new Map();
  allPlayers.forEach(p => {
    probabilitiesMap.set(p._id.toString(), initialWeight);
  });

  const askedQuestions = [];
  let currentQuestion = null;
  let dynamicQuestionData = null;
  let isComplete = false;
  let turn = 1;

  // Turn 1 question selection
  currentQuestion = await questionEngine.getNextOptimalQuestion(allPlayers, probabilitiesMap, askedQuestions);
  if (currentQuestion) {
    askedQuestions.push(currentQuestion.id);
    if (currentQuestion.dynamicQuestionData) {
      dynamicQuestionData = currentQuestion.dynamicQuestionData;
    }
  }

  while (!isComplete && currentQuestion) {
    console.log(`\n--- TURN ${turn} ---`);
    console.log(`Question ID ${currentQuestion.id}: "${currentQuestion.text}"`);
    console.log(`Telemetry Focus: "${currentQuestion.subtitle}"`);

    let answer = "DONT_KNOW";

    if (currentQuestion.id < 1000) {
      // Pre-defined evaluations
      const qId = currentQuestion.id;
      if (qId === 1) answer = (player.overseas === false) ? "YES" : "NO";
      else if (qId === 2) answer = (player.wicketkeeper === true) ? "YES" : "NO";
      else if (qId === 3) answer = (player.captain === true) ? "YES" : "NO";
      else if (qId === 4) answer = (player.active === true) ? "YES" : "NO";
      else if (qId === 5) answer = (player.role.toLowerCase().includes("batsman") || player.role.toLowerCase().includes("keeper")) ? "YES" : "NO";
      else if (qId === 6) answer = (player.role.toLowerCase().includes("bowler")) ? "YES" : "NO";
      else if (qId === 7) answer = (player.role.toLowerCase().includes("all-rounder")) ? "YES" : "NO";
      else if (qId === 8) answer = (player.battingStyle.toLowerCase().includes("left-hand")) ? "YES" : "NO";
      else if (qId === 9) answer = (player.teams.includes("CSK")) ? "YES" : "NO";
      else if (qId === 10) answer = (player.teams.includes("RCB")) ? "YES" : "NO";
      else if (qId === 11) answer = (player.teams.includes("MI")) ? "YES" : "NO";
      else if (qId === 12) answer = (player.teams.includes("KKR")) ? "YES" : "NO";
      else if (qId === 13) answer = (player.teams.includes("RR")) ? "YES" : "NO";
      else if (qId === 26) answer = (player.retired === true) ? "YES" : "NO";
      else if (qId === 27) answer = (player.debutYear === 2008) ? "YES" : "NO";
      else if (qId === 28) answer = (player.iplTitles > 0) ? "YES" : "NO";
      else if (qId === 29) answer = (player.iplTitles >= 3) ? "YES" : "NO";
      else if (qId === 30) answer = (player.debutYear >= 2018) ? "YES" : "NO";
    } else if (dynamicQuestionData) {
      // Dynamic evaluations lookup!
      const evals = dynamicQuestionData.evaluations;
      const evalVal = evals instanceof Map ? evals.get(player.name) : evals[player.name];
      answer = evalVal || "DONT_KNOW";
      console.log(`Evaluated dynamic answer from AI mapping: ${player.name} -> "${answer}"`);
    }

    console.log(`User response: "${answer}"`);

    // Run core Bayesian updater
    const updateResult = questionEngine.evaluateBayesianAnswer(
      allPlayers,
      probabilitiesMap,
      currentQuestion.id,
      answer,
      dynamicQuestionData
    );

    probabilitiesMap = updateResult.updatedProbabilities;
    console.log(`Remaining Pool Candidates: ${updateResult.activeCount}`);
    console.log(`Logs:`, updateResult.filterLog);
    console.log(updateResult.reductionLog);

    // Assess convergence
    const topPredictions = questionEngine.deriveLikelyCandidates(allPlayers, probabilitiesMap, 5);
    const peakProb = topPredictions.length > 0 ? (topPredictions[0].probability / 100) : 0;
    
    console.log("Top Predictions:", topPredictions.slice(0, 3).map(t => `${t.player.name} (${t.probability}%)`).join(", "));

    // Early convergence thresholds: peak >= 80%, turn count >= 8, or isolated activeCount <= 1
    isComplete = peakProb >= 0.80 || turn >= 8 || updateResult.activeCount <= 1;

    if (!isComplete) {
      currentQuestion = await questionEngine.getNextOptimalQuestion(allPlayers, probabilitiesMap, askedQuestions);
      if (currentQuestion) {
        askedQuestions.push(currentQuestion.id);
        dynamicQuestionData = currentQuestion.dynamicQuestionData || null;
      } else {
        isComplete = true;
      }
    }
    
    turn++;
  }

  console.log("\n=======================================================");
  console.log("GAME CONVERGED - PREDICTION REVEAL");
  console.log("=======================================================");
  const topPredictions = questionEngine.deriveLikelyCandidates(allPlayers, probabilitiesMap, 5);
  if (topPredictions.length > 0) {
    const predicted = topPredictions[0].player;
    console.log(`Predicted Player: ${predicted.name}`);
    console.log(`Probability Score: ${topPredictions[0].probability}%`);
    console.log(`Playing Style: ${predicted.playingStyle || predicted.battingStyle}`);
    console.log(`Debut Year: ${predicted.debutYear}`);
    
    if (predicted.name === targetName) {
      console.log("\n[SUCCESS] Live Google Gemini 2.5 Flash predicted the target player successfully!");
    } else {
      console.log(`\n[FAIL] Mismatch! Target was ${targetName}, but got ${predicted.name}`);
    }
  }

  await mongoose.disconnect();
}

simulate();
