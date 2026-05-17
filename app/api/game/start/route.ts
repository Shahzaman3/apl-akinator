import { NextResponse } from "next/server";
import { dbConnect, getCachedPlayers } from "../../../../lib/mongodb";
import Player from "../../../../models/Player";
import GameSession from "../../../../models/GameSession";
import { questionEngine } from "../../../../lib/questionEngine";

export async function POST() {
  try {
    await dbConnect();

    // 1. Fetch complete database candidate pool (Using Fast Cache)
    const players = await getCachedPlayers();
    if (players.length === 0) {
      return NextResponse.json(
        { error: "No players found in database. Please run the seed utility first." },
        { status: 400 }
      );
    }

    const totalPlayers = players.length;
    const initialWeight = 1.0 / totalPlayers;

    // 2. Construct Uniform Bayesian Probability Map (P(x) = 1/N)
    const probabilitiesMap = new Map<string, number>();
    const playerIds: string[] = [];

    players.forEach((p) => {
      const idStr = p._id.toString();
      probabilitiesMap.set(idStr, initialWeight);
      playerIds.push(idStr);
    });

    // 3. Evaluate optimum starting query using initial distribution entropy
    const initialQuestion = await questionEngine.getNextOptimalQuestion(players, probabilitiesMap, []);
    if (!initialQuestion) {
      return NextResponse.json(
        { error: "Mathematical failure resolving starting distribution split." },
        { status: 500 }
      );
    }

    // 4. Save initialized persistent session configuration
    const session = await GameSession.create({
      askedQuestions: [initialQuestion.id],
      remainingPlayers: playerIds,
      playerProbabilities: probabilitiesMap,
      answers: [],
      confidence: 12, // Starting visual floor
      ended: false,
      dynamicQuestion: initialQuestion.dynamicQuestionData || undefined,
    });

    // 5. Return standard response format
    return NextResponse.json(
      {
        gameId: session._id,
        question: {
          id: initialQuestion.id,
          text: initialQuestion.text,
          subtitle: initialQuestion.subtitle,
        },
        remainingPlayers: totalPlayers,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Session instantiation crash:", error);
    return NextResponse.json(
      { error: "Server failed to initialize Bayesian deductor pipeline." },
      { status: 500 }
    );
  }
}
