import { IPlayer } from "../models/Player";

export interface IPredictionWeight {
  player: IPlayer;
  probability: number;
}

/**
 * Calculates the system's visual confidence using a Relative Separation Heuristic.
 * As the top candidate separates from runner-ups, visual confidence scales to peak.
 */
export function calculateConfidence(
  topProbability: number,
  runnerUpProbability: number,
  questionsAskedCount: number
): number {
  const absoluteBaseline = Math.round(topProbability * 100);
  
  // Relative Separation Ratio: how far ahead is #1 compared to #2?
  let relativeConfidence = 0;
  if (topProbability > 0.001) {
    const ratio = 1 - (runnerUpProbability / topProbability);
    relativeConfidence = Math.round(ratio * 100);
  }

  // Smoothed visual blending: blend absolute dominance with relative isolation
  // Favor relative isolation heavily for visual smoothness, bounded by progressive floor
  const weightedConfidence = Math.max(absoluteBaseline, relativeConfidence * 0.9);
  const progressiveFloor = Math.max(12 + questionsAskedCount * 3, weightedConfidence);

  // Constrain boundaries to guarantee a satisfying visual progression
  return Math.min(98, Math.round(progressiveFloor));
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
