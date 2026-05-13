const { MongoClient } = require("mongodb");

async function checkLastSession() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  const db = client.db("apl");
  
  const lastSessions = await db.collection("gamesessions")
    .find()
    .sort({ _id: -1 })
    .limit(3)
    .toArray();

  for (const session of lastSessions) {
    console.log("SESSION ID:", session._id);
    console.log("ENDED:", session.ended);
    console.log("CONFIDENCE:", session.confidence);
    console.log("PREDICTED PLAYER:", session.predictedPlayer);
    
    if (session.predictedPlayer) {
      const player = await db.collection("players").findOne({ _id: session.predictedPlayer });
      console.log("RESOLVED PLAYER:", player ? player.name : "NOT FOUND");
    }
    console.log("-----------------------------");
  }
  
  await client.close();
}

checkLastSession().catch(console.error);
