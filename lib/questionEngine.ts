import { IPlayer } from "../models/Player";
import { questionsList, IQuestionDef, getQuestionById } from "./questions";
import { getNextBestQuestion } from "./entropy";
import { applyBayesianUpdate, IBayesianUpdateResult } from "./filterPlayers";
import { calculateConfidence, getTopPredictions } from "./gameState";
import { generateDynamicQuestionAndEvaluations } from "./gemini";

/**
 * Unified Intelligent Game Engine Facade.
 * Orchestrates probabilistic question selection, informational entropy gain 
 * evaluations, and Bayesian weight syncing based on analytical user feedback.
 */
export class QuestionEngine {
  /**
   * Resolves the optimal next question based on current distribution entropy.
   * Prompts Gemini AI to generate a dynamic, hyper-specific question on EVERY turn.
   * If Gemini fails or key is missing, seamlessly falls back to Shannon Entropy.
   */
  public async getNextOptimalQuestion(
    allPlayers: IPlayer[],
    probabilities: Map<string, number>,
    askedQuestionIds: number[]
  ): Promise<{ id: number; text: string; subtitle: string; dynamicQuestionData?: any } | null> {
    // 1. Identify active candidates with probability above noise floor (0.1%)
    const activePlayers = allPlayers.filter((p) => {
      const prob = probabilities.get(p._id.toString()) || 0;
      return prob > 0.001;
    });

    // Sort active players by probability descending to prioritize top candidates
    activePlayers.sort((a, b) => {
      const probA = probabilities.get(a._id.toString()) || 0;
      const probB = probabilities.get(b._id.toString()) || 0;
      return probB - probA;
    });

    console.log(`QuestionEngine: Active player pool size: ${activePlayers.length}`);

    // Skip Gemini generation for maximum performance
    // 3. Fallback to Shannon Entropy selection
    const unasked = questionsList.filter((q) => !askedQuestionIds.includes(q.id));
    const selection = getNextBestQuestion(allPlayers, probabilities, unasked);
    if (!selection) return null;

    return {
      id: selection.question.id,
      text: selection.question.text,
      subtitle: selection.question.subtitle,
    };
  }

  /**
   * Calculates the next distribution state using Bayesian updating.
   * Supports standard predefined questions as well as dynamically generated Gemini questions.
   */
  public evaluateBayesianAnswer(
    allPlayers: IPlayer[],
    currentProbabilities: Map<string, number>,
    questionId: number,
    answer: "YES" | "NO" | "MAYBE" | "DONT_KNOW",
    dynamicQuestion?: any
  ): IBayesianUpdateResult {
    // Check if it's a dynamic question (ID >= 1000)
    if (questionId >= 1000 && dynamicQuestion) {
      console.log(`QuestionEngine: Evaluating dynamic question answer: "${answer}"`);
      const evaluationsMap = dynamicQuestion.evaluations;

      // Normalize evaluations Map/Object to Record<string, string>
      const normEvaluations: Record<string, string> = {};
      if (evaluationsMap instanceof Map) {
        evaluationsMap.forEach((v, k) => {
          normEvaluations[k] = v;
        });
      } else if (evaluationsMap && typeof evaluationsMap === "object") {
        Object.entries(evaluationsMap).forEach(([k, v]) => {
          normEvaluations[k] = String(v);
        });
      }

      // Construct a temporary IQuestionDef using the saved dynamic evaluations
      const dynamicQuestionDef: IQuestionDef = {
        id: questionId,
        text: dynamicQuestion.text,
        subtitle: dynamicQuestion.subtitle,
        attribute: "dynamic",
        evaluator: (player: IPlayer) => {
          const evalVal = normEvaluations[player.name] || "";
          return evalVal.toUpperCase() === "YES";
        },
        weight: 1.0,
        category: "Dynamic AI",
        dynamicEvaluations: normEvaluations,
      };

      return applyBayesianUpdate(allPlayers, currentProbabilities, dynamicQuestionDef, answer);
    }

    // Otherwise, handle standard predefined questions
    const question = getQuestionById(questionId);
    if (!question) {
      throw new Error(`Question identification trace missing for ID ${questionId}`);
    }

    return applyBayesianUpdate(allPlayers, currentProbabilities, question, answer);
  }

  /**
   * Derive the aggregate confidence based on distribution concentration.
   */
  public calculateTelemetry(
    probabilities: Map<string, number>,
    questionsAskedCount: number
  ): number {
    // Sort entire probability spectrum to isolate peak and runner up
    const sorted = Array.from(probabilities.values()).sort((a, b) => b - a);
    
    const peak = sorted.length > 0 ? sorted[0] : 0;
    const runnerUp = sorted.length > 1 ? sorted[1] : 0;

    return calculateConfidence(peak, runnerUp, questionsAskedCount);
  }

  /**
   * Extracts top predictive candidates currently dominating the probability space.
   */
  public deriveLikelyCandidates(
    allPlayers: IPlayer[],
    probabilities: Map<string, number>,
    limit = 3
  ) {
    return getTopPredictions(allPlayers, probabilities, limit);
  }
}

export const questionEngine = new QuestionEngine();
