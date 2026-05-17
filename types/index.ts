/**
 * Represents the binary or soft-weighted input selections available during inference loops.
 */
export type AnswerType = "YES" | "NO" | "MAYBE" | "DONT_KNOW";

/**
 * Structural definition of an evaluated player-deduction parameter constraint.
 */
export interface Question {
  id: number;
  text: string;
  subtitle: string;
}

/**
 * Diagnostic record emitted by the underlying model pipeline tracking runtime candidate reductions.
 */
export interface ReasoningLog {
  filter: string;
  reduction: string;
  type: string;
}

/**
 * Verified target output mapping representing a fully matched Indian Premier League candidate.
 */
export interface PlayerProfile {
  name: string;
  confidence: number;
  country: string;
  role: string;
  team: string;
  matchAccuracy: number;
  careerRuns: string;
  playingStyle: string;
  keyStrength: string;
  eraGeneration: string;
  signatureMetric: string;
  imageUrl: string;
  sessionId: string;
}

/**
 * Payload packet delivered back from integration logic containing real-time telemetry metrics.
 */
export interface AnswerResponse {
  nextQuestion: Question | null;
  confidence: number;
  remainingPool: number;
  logs: ReasoningLog[];
  isComplete: boolean;
}
