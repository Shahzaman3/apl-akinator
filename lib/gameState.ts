import { IPlayer } from "../models/Player";

export interface IPredictionWeight {
  player: IPlayer;
  probability: number;
}

/**
 * Calculates confidence using a blended Bayesian certainty model.
 * Uses top probability, separation from runner-up, and normalized entropy.
 */
export function calculateConfidence(
  topProbability: number,
  runnerUpProbability: number,
  questionsAskedCount: number,
  normalizedEntropy: number
): number {
  if (topProbability <= 0) return 0;

  const topPercent = topProbability * 100;
  const separationBoost = Math.min(15, Math.max(0, (topProbability - runnerUpProbability) * 100 * 0.45));
  const entropyBoost = Math.max(0, (1 - normalizedEntropy) * 12);
  const evidenceBoost = Math.min(8, questionsAskedCount) * 0.6;

  const blended = topPercent * 0.75 + separationBoost + entropyBoost + evidenceBoost;
  return Math.max(0, Math.min(99, Math.round(blended)));
}

/**
 * Ranks all players by their current active Bayesian weights and 
 * returns the top N candidates for UI telemetry bars.
 */
export function getTopPredictions(
  allPlayers: IPlayer[],
  probabilities: Map<string, number>,
  limit = 5
): IPredictionWeight[] {
  // Construct keyed map of players for O(1) retrieval
  const playerLookup = new Map<string, IPlayer>();
  allPlayers.forEach(p => playerLookup.set(p._id.toString(), p));

  // Pull out map entries, filter non-zero, and sort descending
  const sortedWeights = Array.from(probabilities.entries())
    .filter(([_, prob]) => prob > 0.0001)
    .sort((a, b) => b[1] - a[1]);

  // Take top limit and map back to hydrated player profiles
  const ranked = sortedWeights.slice(0, limit).map(([idStr, prob]) => {
    const player = playerLookup.get(idStr);
    return {
      player: player!,
      probability: Math.round(prob * 100),
    };
  }).filter(item => item.player !== undefined);

  return ranked;
}
