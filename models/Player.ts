import mongoose, { Schema, Document } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  slug: string;
  country: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  teams: string[];
  captain: boolean;
  wicketkeeper: boolean;
  active: boolean;
  overseas: boolean;
  
  // Extended Mathematical Search Parameters
  retired: boolean;
  iplTitles: number;
  debutYear: number;
  
  // Frontend Enrichment Metadata
  imageUrl?: string;
  careerRuns?: string;
  playingStyle?: string;
  keyStrength?: string;
  eraGeneration?: string;
  signatureMetric?: string;
}

const PlayerSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    country: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    battingStyle: { type: String, required: true, trim: true },
    bowlingStyle: { type: String, required: true, trim: true },
    teams: [{ type: String, required: true }],
    captain: { type: Boolean, required: true, default: false },
    wicketkeeper: { type: Boolean, required: true, default: false },
    active: { type: Boolean, required: true, default: true },
    overseas: { type: Boolean, required: true, default: false },
    
    // Added search indices
    retired: { type: Boolean, required: true, default: false },
    iplTitles: { type: Number, required: true, default: 0 },
    debutYear: { type: Number, required: true, default: 2008 },
    
    // Display Metadata
    imageUrl: { type: String, default: "" },
    careerRuns: { type: String, default: "N/A" },
    playingStyle: { type: String, default: "Classic" },
    keyStrength: { type: String, default: "Versatility" },
    eraGeneration: { type: String, default: "Modern Era" },
    signatureMetric: { type: String, default: "Elite Impact" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Player || mongoose.model<IPlayer>("Player", PlayerSchema);
