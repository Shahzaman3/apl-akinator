const mongoose = require("mongoose");
const http = require("http");

const MONGODB_URI = "mongodb://127.0.0.1:27017/apl";

// Helper to make local POST requests
function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname + u.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.write(JSON.stringify(data));
    req.end();
  });
}

// Helper to make local GET requests
function getJSON(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on("error", (err) => reject(err));
  });
}

async function simulate() {
  console.log("==================================================");
  console.log("CRICINTEL IPL AKINATOR - GAMEPLAY SIMULATION TEST");
  console.log("==================================================");

  console.log("Connecting to MongoDB to load target player...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // Let's load the Player model
  const PlayerSchema = new mongoose.Schema({ name: String }, { strict: false });
  const Player = mongoose.models.Player || mongoose.model("Player", PlayerSchema);

  // Let's select MS Dhoni as our target test player
  const targetPlayerName = "MS Dhoni";
  const player = await Player.findOne({ name: targetPlayerName }).lean();

  if (!player) {
    console.error(`Error: Target player '${targetPlayerName}' not found in database!`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Target player loaded: ${player.name} (${player.role}, plays for ${player.teams.join(", ")})`);

  // Detect which port our Next.js server is running on (3333 or 3000)
  let baseUrl = "http://127.0.0.1:3333";
  try {
    console.log("Testing server port 3333...");
    await getJSON("http://127.0.0.1:3333/api/db/seed");
    console.log("Next.js active on port 3333!");
  } catch (err) {
    try {
      console.log("Testing server port 3000...");
      await getJSON("http://127.0.0.1:3000/api/db/seed");
      baseUrl = "http://127.0.0.1:3000";
      console.log("Next.js active on port 3000!");
    } catch (err2) {
      console.warn("Could not reach Next.js server on 3000 or 3333. Defaulting to port 3000.");
    }
  }

  console.log(`Starting game session at: ${baseUrl}/api/game/start`);
  const startRes = await postJSON(`${baseUrl}/api/game/start`, {});
  if (startRes.status !== 201) {
    console.error("Failed to start game session:", startRes);
    await mongoose.disconnect();
    return;
  }

  const { gameId, question: initialQuestion } = startRes.json;
  console.log(`Game session started successfully! Game ID: ${gameId}`);

  let currentQuestion = initialQuestion;
  let turn = 1;
  let isComplete = false;

  const GameSessionSchema = new mongoose.Schema({}, { strict: false });
  const GameSession = mongoose.models.GameSession || mongoose.model("GameSession", GameSessionSchema);

  // Core Simulation Loop
  while (!isComplete && currentQuestion) {
    console.log(`\n--- TURN ${turn} ---`);
    console.log(`Question ID ${currentQuestion.id}: "${currentQuestion.text}"`);
    console.log(`Subtitle: "${currentQuestion.subtitle}"`);

    // Determine the simulated answer
    let answer = "DONT_KNOW";

    if (currentQuestion.id < 1000) {
      // 1. Evaluate standard pre-defined questions using local logic
      const qId = currentQuestion.id;
      // Re-implement the evaluators for our test player to match backend
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
      else if (qId === 14) answer = (player.teams.includes("SRH") || player.teams.includes("Deccan Chargers")) ? "YES" : "NO";
      else if (qId === 15) {
        answer = (player.bowlingStyle.toLowerCase().includes("spin") || 
                  player.bowlingStyle.toLowerCase().includes("legbreak") || 
                  player.bowlingStyle.toLowerCase().includes("offbreak") || 
                  player.bowlingStyle.toLowerCase().includes("orthodox")) ? "YES" : "NO";
      } else if (qId === 16) {
        answer = (player.bowlingStyle.toLowerCase().includes("fast") || 
                  player.bowlingStyle.toLowerCase().includes("medium") || 
                  player.bowlingStyle.toLowerCase().includes("pace")) ? "YES" : "NO";
      } else if (qId === 17) answer = (player.country.toLowerCase() === "australia") ? "YES" : "NO";
      else if (qId === 18) answer = (player.country.toLowerCase() === "south africa") ? "YES" : "NO";
      else if (qId === 19) answer = (player.country.toLowerCase().includes("west indies") || player.country.toLowerCase().includes("caribbean")) ? "YES" : "NO";
      else if (qId === 20) answer = (player.teams.includes("DC") || player.teams.includes("DD")) ? "YES" : "NO";
      else if (qId === 21) answer = (player.teams.includes("PBKS") || player.teams.includes("KXIP")) ? "YES" : "NO";
      else if (qId === 22) answer = (player.teams.includes("GT")) ? "YES" : "NO";
      else if (qId === 23) answer = (player.teams.includes("LSG")) ? "YES" : "NO";
      else if (qId === 24) answer = (player.country.toLowerCase() === "england") ? "YES" : "NO";
      else if (qId === 25) answer = (player.country.toLowerCase() === "sri lanka" || player.country.toLowerCase() === "new zealand") ? "YES" : "NO";
      else if (qId === 26) answer = (player.retired === true) ? "YES" : "NO";
      else if (qId === 27) answer = (player.debutYear === 2008) ? "YES" : "NO";
      else if (qId === 28) answer = (player.iplTitles > 0) ? "YES" : "NO";
      else if (qId === 29) answer = (player.iplTitles >= 3) ? "YES" : "NO";
      else if (qId === 30) answer = (player.debutYear >= 2018) ? "YES" : "NO";
    } else {
      // 2. Evaluate dynamic AI questions by checking the evaluations stored in the active GameSession!
      console.log("Retrieving dynamic evaluations from Mongoose session...");
      const activeSession = await GameSession.findById(gameId).lean();
      if (activeSession && activeSession.dynamicQuestion && activeSession.dynamicQuestion.evaluations) {
        const evals = activeSession.dynamicQuestion.evaluations;
        // In Mongoose, maps can be stored as Map or Object
        const evalVal = evals.get ? evals.get(player.name) : evals[player.name];
        answer = evalVal || "DONT_KNOW";
        console.log(`Evaluated dynamic answer from AI mapping: ${player.name} -> "${answer}"`);
      } else {
        console.warn("Could not retrieve active session evaluations. Playing safe with 'DONT_KNOW'.");
        answer = "DONT_KNOW";
      }
    }

    console.log(`Simulated response: "${answer}"`);

    // Submit the response to Next.js API
    const ansRes = await postJSON(`${baseUrl}/api/game/answer`, {
      gameId,
      questionId: currentQuestion.id,
      answer,
    });

    if (ansRes.status !== 200) {
      console.error("Answer submission failed:", ansRes);
      break;
    }

    const resData = ansRes.json;
    console.log(`Remaining pool candidates: ${resData.remainingPlayers}`);
    console.log(`AI Confidence level: ${resData.confidence}%`);
    console.log(`Top 3 Predictions:`, resData.topPredictions.slice(0, 3));
    console.log(`Logs:`, resData.logs);

    isComplete = resData.isComplete;
    currentQuestion = resData.nextQuestion;
    turn++;

    // Safety break
    if (turn > 15) {
      console.error("Simulation safety limit exceeded!");
      break;
    }
  }

  console.log("\n==================================================");
  console.log("GAME CONVERGED - FETCHING PREDICTION RESULT");
  console.log("==================================================");

  const resultRes = await getJSON(`${baseUrl}/api/game/result?gameId=${gameId}`);
  if (resultRes.status !== 200) {
    console.error("Failed to retrieve result:", resultRes);
  } else {
    const result = resultRes.json;
    console.log(`Predicted Player: ${result.prediction.name}`);
    console.log(`Confidence level: ${result.confidence}%`);
    console.log(`Playing Style: ${result.prediction.playingStyle}`);
    console.log(`Key Strength: ${result.prediction.keyStrength}`);
    console.log(`AI Enriched Bio Summary: "${result.prediction.signatureMetric}"`);
    console.log(`Unsplash Image URL: ${result.prediction.imageUrl}`);

    if (result.prediction.name === targetPlayerName) {
      console.log("\n[SUCCESS] AI successfully predicted the target player!");
    } else {
      console.log(`\n[FAIL] Prediction mismatch! Expected: ${targetPlayerName}, Found: ${result.prediction.name}`);
    }
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

simulate();
