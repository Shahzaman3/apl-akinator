import { IPlayer } from "../models/Player";
import { questionsList, IQuestionDef, getQuestionById } from "./questions";
import { getNextBestQuestion } from "./entropy";
import { applyBayesianUpdate, IBayesianUpdateResult } from "./filterPlayers";
import { calculateConfidence, getTopPredictions } from "./gameState";

/**
 * Unified Intelligent Game Engine Facade.
 * Orchestrates probabilistic question selection, informational entropy gain 
 * evaluations, and Bayesian weight syncing based on analytical user feedback.
 */
export class QuestionEngine {
  /**
   * Resolves the optimal next question based on current distribution entropy.
   */
  public getNextOptimalQuestion(
    allPlayers: IPlayer[],
    probabilities: Map<string, number>,
    askedQuestionIds: number[]
  ): { id: number; text: string; subtitle: string } | null {
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
   */
  public evaluateBayesianAnswer(
    allPlayers: IPlayer[],
    currentProbabilities: Map<string, number>,
    questionId: number,
    answer: "YES" | "NO" | "MAYBE"
  ): IBayesianUpdateResult {
    const question = getQuestionById(questionId);
    if (!question) {
      throw new Error("Question identification trace missing.");
    }

    return applyBayesianUpdate(allPlayers, currentProbabilities, question, answer);
  }

  /**
   * Derives the aggregate confidence based on distribution concentration.
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
