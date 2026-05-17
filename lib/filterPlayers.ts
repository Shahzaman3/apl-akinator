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
  answer: "YES" | "NO" | "MAYBE" | "DONT_KNOW"
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
  } else if (answer === "DONT_KNOW") {
    // Zero-information split: prior weights are preserved exactly upon normalization
    likelihoodMatch = 0.50;
    likelihoodNonMatch = 0.50;
  }

  // 2. Apply Bayes updates
  const nextWeights = new Map<string, number>();
  let totalWeight = 0;

  allPlayers.forEach((player) => {
    const idStr = player._id.toString();
    const prior = currentProbabilities.get(idStr) || 0;
    if (prior <= 0) return;

    let likelihood = 0.50;

    // Check if it is a dynamic question
    if (question.category === "Dynamic AI" && question.dynamicEvaluations) {
      const evalVal = question.dynamicEvaluations[player.name] || "";
      
      if (evalVal === "") {
        // Player was not evaluated (outside top 20). Keep probability completely neutral!
        likelihood = 0.50; 
      } else {
        // Player was evaluated (YES, NO, or MAYBE)
        const playerAnswer = evalVal.toUpperCase(); // YES, NO, or MAYBE
        
        // Match user's answer against player's true AI status
        if (answer === "YES") {
          likelihood = (playerAnswer === "YES") ? 0.95 : (playerAnswer === "NO" ? 0.05 : 0.60);
        } else if (answer === "NO") {
          likelihood = (playerAnswer === "YES") ? 0.05 : (playerAnswer === "NO" ? 0.95 : 0.40);
        } else if (answer === "MAYBE") {
          likelihood = (playerAnswer === "YES") ? 0.60 : (playerAnswer === "NO" ? 0.40 : 0.50);
        } else if (answer === "DONT_KNOW") {
          likelihood = 0.50;
        }
      }
    } else {
      // Standard predefined questions
      const matches = question.evaluator(player);
      likelihood = matches ? likelihoodMatch : likelihoodNonMatch;
    }

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
  const activeCount = Array.from(updatedProbabilities.values()).filter((p) => p > 0.001).length;
  
  let filterLog = "";
  if (answer === "MAYBE") {
    filterLog = `Awaiting clarity on: ${question.text.replace("?", "")} (Soft Bayesian decay)`;
  } else if (answer === "DONT_KNOW") {
    filterLog = `Preserved player priors due to 'DON'T KNOW' on: ${question.text.replace("?", "")}`;
  } else {
    filterLog = `Updated distribution based on "${answer}" for: ${question.text.replace("?", "")}`;
  }

  const countDiff = initialActiveCount - activeCount;
  let reductionLog = "";
  if (answer === "DONT_KNOW") {
    reductionLog = `No information added. Active candidates remain at ${activeCount}.`;
  } else if (countDiff > 0) {
    reductionLog = `Entropy concentrated! Active candidates reduced by ${countDiff}.`;
  } else {
    reductionLog = `Soft refining... Active candidates holding steady around ${activeCount}.`;
  }

  return {
    updatedProbabilities,
    activeCount: Math.max(1, activeCount),
    filterLog,
    reductionLog,
  };
}
