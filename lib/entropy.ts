import { IPlayer } from "../models/Player";
import { IQuestionDef } from "./questions";

/**
 * Calculates Shannon Entropy for an explicit weighted probability distribution.
 * Formula: H(P) = -sum(P(i) * log2(P(i)))
 */
export function calculateShannonEntropy(probabilities: Map<string, number>): number {
  let entropy = 0;
  probabilities.forEach((p) => {
    if (p > 1e-9) {
      entropy -= p * Math.log2(p);
    }
  });
  return entropy;
}

/**
 * Computes expected Information Gain for a candidate query relative to the weighted distribution.
 * Incorporates question weight multipliers.
 */
export function calculateInformationGain(
  allPlayers: IPlayer[],
  probabilities: Map<string, number>,
  question: IQuestionDef
): number {
  // 1. Evaluate current base entropy
  const baseEntropy = calculateShannonEntropy(probabilities);
  if (baseEntropy < 1e-5) return 0;

  // 2. Calculate aggregate probability of YES and NO outcomes
  let probYes = 0;
  let probNo = 0;

  allPlayers.forEach((player) => {
    const idStr = player._id.toString();
    const p = probabilities.get(idStr) || 0;
    if (p <= 1e-9) return;

    if (question.evaluator(player)) {
      probYes += p;
    } else {
      probNo += p;
    }
  });

  // If the question splits with an extreme skew (e.g. zero variance), gain is effectively 0.
  if (probYes < 1e-6 || probNo < 1e-6) {
    return 0;
  }

  // 3. Compute conditional entropy H(P|YES) and H(P|NO)
  let entropyYes = 0;
  let entropyNo = 0;

  allPlayers.forEach((player) => {
    const idStr = player._id.toString();
    const p = probabilities.get(idStr) || 0;
    if (p <= 1e-9) return;

    if (question.evaluator(player)) {
      const condP = p / probYes;
      entropyYes -= condP * Math.log2(condP);
    } else {
      const condP = p / probNo;
      entropyNo -= condP * Math.log2(condP);
    }
  });

  const expectedChildEntropy = probYes * entropyYes + probNo * entropyNo;

  // IG(T, Q) = H(T) - H(T|Q)
  let infoGain = baseEntropy - expectedChildEntropy;

  // Multiply by configuration weight to allow strategic steering
  return Math.max(0, infoGain * question.weight);
}

/**
 * Selects next optimum question to deploy based on maximum expected entropy reduction.
 */
export function getNextBestQuestion(
  allPlayers: IPlayer[],
  probabilities: Map<string, number>,
  unaskedQuestions: IQuestionDef[]
): { question: IQuestionDef; infoGain: number } | null {
  if (unaskedQuestions.length === 0) return null;

  let bestQuestion: IQuestionDef | null = null;
  let maxGain = -1;

  for (const q of unaskedQuestions) {
    const gain = calculateInformationGain(allPlayers, probabilities, q);
    if (gain > maxGain) {
      maxGain = gain;
      bestQuestion = q;
    }
  }

  // If everything resolves to zero splitting gain, fallback to first unasked strategically
  if ((!bestQuestion || maxGain < 1e-4) && unaskedQuestions.length > 0) {
    return { question: unaskedQuestions[0], infoGain: 0 };
  }

  return bestQuestion ? { question: bestQuestion, infoGain: maxGain } : null;
}
