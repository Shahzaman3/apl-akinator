import mongoose, { Schema, Document } from "mongoose";

export interface IDynamicQuestion {
  id: number;
  text: string;
  subtitle: string;
  evaluations: Record<string, "YES" | "NO" | "MAYBE">;
}

export interface IAnswerLog {
  questionId: number;
  answer: "YES" | "NO" | "MAYBE" | "DONT_KNOW";
  filterLog: string;
  reductionLog: string;
}

export interface IGameSession extends Document {
  askedQuestions: number[];
  remainingPlayers: mongoose.Types.ObjectId[];
  playerProbabilities: Map<string, number>; // Maps Player ObjectId -> current Bayesian weight (normalized)
  answers: IAnswerLog[];
  confidence: number;
  ended: boolean;
  predictedPlayer?: mongoose.Types.ObjectId;
  predictedPlayerInsight?: string;
  dynamicQuestion?: IDynamicQuestion;
  createdAt: Date;
}

const GameSessionSchema: Schema = new Schema(
  {
    askedQuestions: [{ type: Number }],
    remainingPlayers: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    playerProbabilities: {
      type: Map,
      of: Number,
      default: {},
    },
    answers: [
      {
        questionId: { type: Number },
        answer: { type: String, enum: ["YES", "NO", "MAYBE", "DONT_KNOW"] },
        filterLog: { type: String },
        reductionLog: { type: String },
      },
    ],
    confidence: { type: Number, default: 10 },
    ended: { type: Boolean, default: false },
    predictedPlayer: { type: Schema.Types.ObjectId, ref: "Player" },
    predictedPlayerInsight: { type: String },
    dynamicQuestion: {
      id: { type: Number },
      text: { type: String },
      subtitle: { type: String },
      evaluations: { type: Map, of: String },
    },
  },
  { timestamps: true }
);

// Index for performance tuning session TTL if needed (e.g. expire sessions in 1 hour)
GameSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.models.GameSession || mongoose.model<IGameSession>("GameSession", GameSessionSchema);
