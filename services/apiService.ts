import { AnswerType, Question, PlayerProfile, AnswerResponse } from "../types";

export class ApiService {
  private currentGameId: string | null = null;

  private setSessionId(id: string) {
    this.currentGameId = id;
    if (typeof window !== "undefined") {
      localStorage.setItem("apl_game_id", id);
    }
  }

  private getSessionId(): string | null {
    if (this.currentGameId) return this.currentGameId;
    if (typeof window !== "undefined") {
      return localStorage.getItem("apl_game_id");
    }
    return null;
  }

  /**
   * Starts game, initializes live session.
   */
  public async getInitialGame(): Promise<{ firstQuestion: Question; totalQuestions: number; initialPool: number; initialConfidence: number }> {
    try {
      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Engine start failure.");

      const data = await response.json();
      this.setSessionId(data.gameId);

      return {
        firstQuestion: {
          id: data.question.id,
          text: data.question.text,
          subtitle: data.question.subtitle,
        },
        totalQuestions: 0, // Adaptive flow: no fixed cap
        initialPool: data.remainingPlayers,
        initialConfidence: 12,
      };
    } catch (error) {
      console.error("ApiService Error:", error);
      // Absolute hardcoded fallback in event of emergency
      return {
        firstQuestion: { id: 1, text: "Is the player Indian?", subtitle: "Verify nationality." },
        totalQuestions: 0,
        initialPool: 150,
        initialConfidence: 10,
      };
    }
  }

  /**
   * Submits specific response to deduction router.
   */
  public async submitAnswer(
    questionId: number,
    answer: AnswerType
  ): Promise<AnswerResponse & { topCandidates?: string[] }> {
    try {
      const gameId = this.getSessionId();
      if (!gameId) throw new Error("Active session trace lost.");

      const response = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, questionId, answer }),
      });

      if (!response.ok) throw new Error("Telemetry split rejected.");

      const data = await response.json();

      return {
        nextQuestion: data.nextQuestion
          ? {
              id: data.nextQuestion.id,
              text: data.nextQuestion.text,
              subtitle: data.nextQuestion.subtitle,
            }
          : null,
        confidence: data.confidence,
        remainingPool: data.remainingPlayers,
        logs: data.logs,
        isComplete: data.isComplete,
        topCandidates: data.topPredictions.map((p: any) => p.name), // Used for live display rendering
      } as any;
    } catch (error) {
      console.error("ApiService submit failure:", error);
      throw error;
    }
  }

  /**
   * Retrives ultimate outcome mapping.
   */
  public async getPredictionResult(): Promise<PlayerProfile> {
    try {
      const gameId = this.getSessionId();
      if (!gameId) throw new Error("Resolution identity missing.");

      const response = await fetch(`/api/game/result?gameId=${gameId}`);
      if (!response.ok) throw new Error("Failed fetching intelligence bio.");

      const data = await response.json();
      // Flatten payload securely for complete backward compatibility with standard React state bindings
      return {
        ...data.prediction,
        confidence: data.confidence,
      } as PlayerProfile;
    } catch (error) {
      console.error("ApiService result retrieval failure:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
