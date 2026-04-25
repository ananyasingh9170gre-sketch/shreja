import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: ["topic", "todo", "study"], default: "topic" },
    subject: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
    studyMinutes: { type: Number, default: 0 },
    studyDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
