import { NextResponse } from "next/server";
import { dbConnect, getCachedPlayers } from "../../../../lib/mongodb";
import GameSession from "../../../../models/GameSession";
import Player from "../../../../models/Player";
import { questionEngine } from "../../../../lib/questionEngine";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { gameId, questionId, answer } = body;

    if (!gameId || !questionId || !answer) {
      return NextResponse.json({ error: "Missing input metrics." }, { status: 400 });
    }

    // 1. Load active game state
    const session = await GameSession.findById(gameId);
    if (!session) {
      return NextResponse.json({ error: "Inference session missing." }, { status: 404 });
    }

    // 2. Pull overall player pool for distribution management (Using Blazing Fast Memory Cache)
    const allPlayers = await getCachedPlayers();
    
    // Ensure Mongoose map is instantiated correctly
    const currentMap = session.playerProbabilities instanceof Map 
      ? session.playerProbabilities 
      : new Map(Object.entries(session.playerProbabilities || {}));

    // 3. Run core Bayesian Updating Pipeline
    const { 
      updatedProbabilities, 
      activeCount, 
      filterLog, 
      reductionLog 
    } = questionEngine.evaluateBayesianAnswer(
      allPlayers,
      currentMap,
      Number(questionId),
      answer
    );

    // 4. Calculate state progress telemetry
    const questionsAskedCount = session.askedQuestions.length;
    const newConfidence = questionEngine.calculateTelemetry(updatedProbabilities, questionsAskedCount);

    // Update session probability map back to document
    session.playerProbabilities = updatedProbabilities;

    // Store query history log
    session.answers.push({
      questionId: Number(questionId),
      answer,
      filterLog,
      reductionLog,
    });

    // 5. Assess Convergence Conditions
    const currentTop = questionEngine.deriveLikelyCandidates(allPlayers, updatedProbabilities, 5);
    const peakProb = currentTop.length > 0 ? (currentTop[0].probability / 100) : 0;
    const runnerUpProb = currentTop.length > 1 ? (currentTop[1].probability / 100) : 0;
    
    // Relative Isolation Ratio: If Top 1 is 8x more likely than Top 2, we have mathematical isolation
    const isolationRatio = runnerUpProb > 0.001 ? (peakProb / runnerUpProb) : 100;

    // STRICT USER MANDATE: Do NOT finish before 8 questions have been asked to build suspense
    const minQuestionsMet = questionsAskedCount >= 8;

    // Mathematical convergence targets: peak hits 85%, ratio > 12, or absolute concentration
    const mathConvergence = peakProb >= 0.85 || isolationRatio > 12.0 || activeCount <= 1;

    // Complete ONLY if mathematical convergence is achieved AFTER 8 questions, OR safety cap reached
    let isComplete = (mathConvergence && minQuestionsMet) || questionsAskedCount >= 15;
    let nextQuestion = null;

    if (!isComplete) {
      // Dynamic Bayesian Entropy selection via Facade
      nextQuestion = questionEngine.getNextOptimalQuestion(
        allPlayers,
        updatedProbabilities,
        session.askedQuestions
      );

      if (nextQuestion) {
        // Track question as asked
        session.askedQuestions.push(nextQuestion.id);
      } else {
        // Zero informational variance left, forcing completion regardless of count
        isComplete = true;
      }
    }

    // Update Session Document properties
    session.confidence = newConfidence;
    
    if (isComplete) {
      session.ended = true;
      // Set the highest probable player as prediction target
      if (currentTop.length > 0) {
        session.predictedPlayer = currentTop[0].player._id;
      }
    }

    // Force MongoDB change tracking on Map field
    session.markModified("playerProbabilities");
    await session.save();

    // 7. Return strictly formatted schema + UI support logs
    return NextResponse.json({
      nextQuestion,
      remainingPlayers: activeCount,
      confidence: newConfidence,
      topPredictions: currentTop.map((t) => ({
        name: t.player.name,
        probability: t.probability,
      })),
      // Backend enhancement flags for robust UI synchronization
      isComplete,
      logs: [
        {
          filter: filterLog,
          reduction: reductionLog,
          type: answer === "YES" ? "check_circle" : answer === "NO" ? "cancel" : "help",
        },
      ],
    });
  } catch (error: any) {
    console.error("Submit answer Bayesian failure:", error);
    return NextResponse.json({ error: "Mathematical calculators failed during inference loop." }, { status: 500 });
  }
}
