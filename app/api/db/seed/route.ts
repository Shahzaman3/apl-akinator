import { NextResponse } from "next/server";
import { dbConnect, flushPlayersCache } from "../../../../lib/mongodb";
import Player from "../../../../models/Player";
import playersData from "../../../../data/players.json";

async function handleSeed() {
  await dbConnect();

  const existingCount = await Player.countDocuments();

  if (existingCount >= 600) {
    return {
      success: true,
      message: `Database already contains ${existingCount} players. Skipping seed to prevent duplicates.`,
      playerCount: existingCount,
      action: "skipped",
    };
  }

  // Clear existing players to prevent conflicts
  await Player.deleteMany({});

  // Insert the entire dataset
  const inserted = await Player.insertMany(playersData);

  // Invalidate in-memory static dataset cache to pull freshly seeded data on next turn
  flushPlayersCache();

  return {
    success: true,
    message: `Successfully seeded ${inserted.length} players into the database.`,
    playerCount: inserted.length,
    action: "seeded",
    seedVersion: "v2-600",
    timestamp: new Date().toISOString(),
  };
}

export async function POST() {
  try {
    const result = await handleSeed();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Seed POST error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error during seeding",
        action: "failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await handleSeed();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Seed GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error during seeding",
        action: "failed",
      },
      { status: 500 }
    );
  }
}
