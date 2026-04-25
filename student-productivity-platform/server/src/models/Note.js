import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    filePath: { type: String, required: true },
    fileName: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
