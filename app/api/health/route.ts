import { NextResponse } from "next/server";
import { dbConnect, getCachedPlayers } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  
  let dbStatus = "failed";
  let geminiStatus = "offline/degraded";
  let entropyStatus = "awaiting_dataset";
  let datasetCount = 0;

  try {
    // 1. Verify Database Connectivity
    await dbConnect();
    dbStatus = "connected";

    // 2. Verify Player Dataset
    const players = await getCachedPlayers();
    datasetCount = players.length;
    if (datasetCount > 0) {
      entropyStatus = "ready/active";
    }
  } catch (e) {
    dbStatus = "failed";
    console.error("Health check DB diagnostic error:", e);
  }

  // 3. Verify Gemini API Key Setup
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
    geminiStatus = "online/active";
  }

  const responseTime = `${Date.now() - startTime}ms`;

  const overallStatus = (dbStatus === "connected" && datasetCount > 0) ? "operational" : "degraded";

  return NextResponse.json({
    status: overallStatus,
    mongodb: dbStatus,
    gemini: geminiStatus,
    entropyEngine: entropyStatus,
    playerDataset: datasetCount,
    responseTime,
    uptime: "stable",
    diagnosticNotes: overallStatus === "operational" 
      ? "Systems fully authorized."
      : "To resolve failures: (1) Ensure MongoDB service is active locally. (2) Execute /api/db/seed to populate players. (3) Setup GEMINI_API_KEY in .env file."
  });
}
