const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = "mongodb://127.0.0.1:27017/apl";
const playersFilePath = path.join(__dirname, '../data/players.json');

async function runDirectSeed() {
  console.log("Connecting to MongoDB at:", MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log("Successfully connected to MongoDB.");

    // Load players data
    const playersData = JSON.parse(fs.readFileSync(playersFilePath, 'utf8'));
    console.log(`Loaded ${playersData.length} players from players.json.`);

    // Define temporary schema
    const PlayerSchema = new mongoose.Schema({
      name: { type: String, required: true },
      country: { type: String, required: true },
      role: { type: String, required: true },
      battingStyle: { type: String, required: true },
      bowlingStyle: { type: String, required: true },
      teams: [{ type: String, required: true }],
      captain: { type: Boolean, required: true },
      wicketkeeper: { type: Boolean, required: true },
      active: { type: Boolean, required: true },
      overseas: { type: Boolean, required: true },
      retired: { type: Boolean, required: true },
      iplTitles: { type: Number, required: true },
      debutYear: { type: Number, required: true },
      imageUrl: { type: String, default: "" },
      careerRuns: { type: String, default: "N/A" },
      playingStyle: { type: String, default: "Classic" },
      keyStrength: { type: String, default: "Versatility" },
      eraGeneration: { type: String, default: "Modern Era" },
      signatureMetric: { type: String, default: "Elite Impact" }
    });

    const Player = mongoose.models.Player || mongoose.model("Player", PlayerSchema);

    // Clear existing players
    console.log("Clearing existing players from database...");
    const deleteRes = await Player.deleteMany({});
    console.log(`Cleared existing players.`, deleteRes);

    // Insert new players
    console.log("Inserting new players dataset...");
    const inserted = await Player.insertMany(playersData);
    console.log(`Successfully seeded ${inserted.length} players into the database.`);

  } catch (err) {
    console.error("Direct seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runDirectSeed();
