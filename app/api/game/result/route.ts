import { NextResponse } from "next/server";
import { dbConnect, getCachedPlayers } from "../../../../lib/mongodb";
import GameSession from "../../../../models/GameSession";
import Player from "../../../../models/Player";
import { generateIntelligenceReport } from "../../../../lib/gemini";
import { questionEngine } from "../../../../lib/questionEngine";
import { fetchPlayerImage } from "../../../../lib/playerImage";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json({ error: "Missing session identifier." }, { status: 400 });
    }

    // 1. Fetch Session data
    const session = await GameSession.findById(gameId);
    if (!session) {
      return NextResponse.json({ error: "Game session trace missing." }, { status: 404 });
    }

    // 2. Pull overall player pool from in-memory cache (0ms!)
    const allPlayers = await getCachedPlayers();
    const currentMap = session.playerProbabilities instanceof Map 
      ? session.playerProbabilities 
      : new Map(Object.entries(session.playerProbabilities || {}));

    // 3. Pull peak predictive results via entropy facade
    const currentTop = questionEngine.deriveLikelyCandidates(allPlayers, currentMap, 5);
    
    let targetPlayer = null;
    if (session.predictedPlayer) {
      // Find target player instantly from in-memory POJO cache (0ms!)
      targetPlayer = allPlayers.find((p) => p._id.toString() === session.predictedPlayer.toString()) || null;
    }
    if (!targetPlayer && currentTop.length > 0) {
      // Fallback: resolve peak probability candidate
      targetPlayer = currentTop[0].player;
    }

    if (!targetPlayer) {
      return NextResponse.json({ error: "Non-convergence: No predictive candidate resolved." }, { status: 404 });
    }

    // 4. Load pre-cached Gemini report from session (0ms!), otherwise fallback to live generation
    let aiInsight = session.predictedPlayerInsight || null;
    if (!aiInsight) {
      console.log("ResultRoute: Pre-cached insight missing. Generating dynamically...");
      aiInsight = await generateIntelligenceReport(
        targetPlayer.name,
        targetPlayer.keyStrength || targetPlayer.role
      );
    } else {
      console.log("ResultRoute: Loaded pre-cached intelligence report successfully in 0ms!");
    }

    // 5. Fetch the real player image from Wikipedia (cached after first lookup)
    const realImageUrl = await fetchPlayerImage(targetPlayer.name);

    // 6. Shape the Prediction block containing enriched profile telemetry
    const predictionBlock = {
      name: targetPlayer.name,
      confidence: session.confidence,
      country: targetPlayer.country,
      role: targetPlayer.role,
      team: targetPlayer.teams && targetPlayer.teams.length > 0 ? targetPlayer.teams[0] : "IPL Star",
      matchAccuracy: session.confidence,
      careerRuns: targetPlayer.careerRuns || "Elite Profile",
      playingStyle: targetPlayer.playingStyle || targetPlayer.battingStyle,
      keyStrength: targetPlayer.keyStrength || "Dynamic Impact",
      eraGeneration: targetPlayer.eraGeneration || `Debuted ${targetPlayer.debutYear}`,
      signatureMetric: aiInsight || targetPlayer.signatureMetric,
      imageUrl: realImageUrl,
      sessionId: `#${session._id.toString().slice(-8).toUpperCase()}`,
    };

    // 6. Construct the strictly requested Bayesian response wrapper
    const outputPayload = {
      prediction: predictionBlock,
      confidence: session.confidence,
      topPredictions: currentTop.map((t) => ({
        name: t.player.name,
        probability: t.probability,
      })),
    };

    return NextResponse.json(outputPayload, { status: 200 });
  } catch (error: any) {
    console.error("Bayesian result derivation error:", error);
    return NextResponse.json({ error: "Database calculator failed output processing." }, { status: 500 });
  }
}
