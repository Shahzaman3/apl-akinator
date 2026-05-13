import { IPlayer } from "../models/Player";
import { IQuestionDef } from "./questions";

export interface IBayesianUpdateResult {
  updatedProbabilities: Map<string, number>;
  activeCount: number;
  filterLog: string;
  reductionLog: string;
}

/**
 * Performs Bayesian updating on the player probability distribution.
 * P(Player | Answer) = P(Answer | Player) * P(Player) / P(Answer)
 */
export function applyBayesianUpdate(
  allPlayers: IPlayer[],
  currentProbabilities: Map<string, number>,
  question: IQuestionDef,
  answer: "YES" | "NO" | "MAYBE"
): IBayesianUpdateResult {
  const initialActiveCount = Array.from(currentProbabilities.values()).filter((p) => p > 0.001).length;

  // 1. Map likelihood tables incorporating slight noise tolerance
  let likelihoodMatch = 0.95;
  let likelihoodNonMatch = 0.05;

  if (answer === "NO") {
    likelihoodMatch = 0.05;
    likelihoodNonMatch = 0.95;
  } else if (answer === "MAYBE") {
    // Soft probability decay: does not heavily penalize non-matches, just shifts skew
    likelihoodMatch = 0.60;
    likelihoodNonMatch = 0.40;
  }

  // 2. Apply Bayes updates
  const nextWeights = new Map<string, number>();
  let totalWeight = 0;

  allPlayers.forEach((player) => {
    const idStr = player._id.toString();
    const prior = currentProbabilities.get(idStr) || 0;
    if (prior <= 0) return;

    const matches = question.evaluator(player);
    const likelihood = matches ? likelihoodMatch : likelihoodNonMatch;
    const posterior = prior * likelihood;

    nextWeights.set(idStr, posterior);
    totalWeight += posterior;
  });

  // 3. Normalize weights back into valid probability space (sum to 1.0)
  const updatedProbabilities = new Map<string, number>();
  if (totalWeight > 0) {
    nextWeights.forEach((w, idStr) => {
      updatedProbabilities.set(idStr, w / totalWeight);
    });
  } else {
    // Emergency fallback: preserve priors if normalization collapses
    currentProbabilities.forEach((w, idStr) => {
      updatedProbabilities.set(idStr, w);
    });
  }

  // 4. Count candidates above noise floor (e.g. > 0.1%) for the user HUD representation
  // Using 0.001 captures uniform distributions perfectly (1/251 = 0.00398 > 0.001)
  const activeCount = Array.from(updatedProbabilities.values()).filter((p) => p > 0.001).length;
  
  const filterLog = answer === "MAYBE" 
    ? `Awaiting clarity on: ${question.text.replace("?", "")} (Soft Bayesian decay)`
    : `Updated distribution based on "${answer}" for: ${question.text.replace("?", "")}`;

  const countDiff = initialActiveCount - activeCount;
  const reductionLog = countDiff > 0
    ? `Entropy concentrated! Active candidates reduced by ${countDiff}.`
    : `Soft refining... Active candidates holding steady around ${activeCount}.`;

  return {
    updatedProbabilities,
    activeCount: Math.max(1, activeCount),
    filterLog,
    reductionLog,
  };
}
