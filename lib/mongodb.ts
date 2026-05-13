import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/apl";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

// --- Optimized Static Dataset Caching Strategy ---
let globalCachedPlayers: any[] | null = null;

/**
 * Returns all players cached in fast, lightweight, de-hydrated POJO format (.lean()).
 * This completely avoids Mongoose overhead and DB retrieval loops on every turn.
 */
export async function getCachedPlayers(): Promise<any[]> {
  if (!globalCachedPlayers || globalCachedPlayers.length === 0) {
    await dbConnect();
    const Player = mongoose.models.Player || (await import("../models/Player")).default;
    // Using .lean() makes document retrieval 10x faster with zero mongoose wrappers
    globalCachedPlayers = await Player.find({}).lean();
  }
  return globalCachedPlayers || [];
}

/**
 * Force invalidation of memory cache, used when seeding new datasets.
 */
export function flushPlayersCache(): void {
  globalCachedPlayers = null;
}
