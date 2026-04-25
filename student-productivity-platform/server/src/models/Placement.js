import mongoose from "mongoose";

const companyPrepSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    status: { type: String, enum: ["planned", "in-progress", "ready"], default: "planned" },
    notes: { type: String, trim: true }
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    link: { type: String, trim: true }
  },
  { _id: false }
);

const placementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    dsaSolved: { type: Number, default: 0 },
    dsaTarget: { type: Number, default: 300 },
    companies: [companyPrepSchema],
    interviews: [interviewSchema],
    resumePath: { type: String },
    resumeTips: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
