import path from "path";
import { fileURLToPath } from "url";
import Note from "../models/Note.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createNote = asyncHandler(async (req, res) => {
  const { title, subject, description } = req.body;

  if (!req.file || !title || !subject) {
    const error = new Error("Title, subject, and file are required");
    error.statusCode = 400;
    throw error;
  }

  const note = await Note.create({
    title,
    subject,
    description,
    filePath: req.file.path,
    fileName: req.file.originalname,
    uploadedBy: req.user._id
  });

  const populatedNote = await note.populate("uploadedBy", "name email");

  const notification = await Notification.create({
    user: req.user._id,
    title: "Note uploaded",
    message: `${title} was uploaded successfully.`,
    type: "note"
  });

  const io = req.app.get("io");
  io.to(`user-${req.user._id}`).emit("new-notification", notification);

  res.status(201).json(populatedNote);
});

export const listNotes = asyncHandler(async (req, res) => {
  const { subject, search } = req.query;
  const query = {};

  if (subject) query.subject = { $regex: subject, $options: "i" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const notes = await Note.find(query)
    .populate("uploadedBy", "name")
    .populate("comments.user", "name")
    .sort({ createdAt: -1 });

  res.json(notes.map((n) => ({ ...n.toObject(), publicFilePath: `/uploads/${path.basename(n.filePath)}` })));
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)
    .populate("uploadedBy", "name email")
    .populate("comments.user", "name");

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ ...note.toObject(), publicFilePath: `/uploads/${path.basename(note.filePath)}` });
});

export const likeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  const userId = req.user._id.toString();
  const existing = note.likes.find((id) => id.toString() === userId);

  if (existing) {
    note.likes = note.likes.filter((id) => id.toString() !== userId);
  } else {
    note.likes.push(req.user._id);
  }

  await note.save();
  res.json({ likesCount: note.likes.length, liked: !existing });
});

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    const error = new Error("Comment text is required");
    error.statusCode = 400;
    throw error;
  }

  const note = await Note.findById(req.params.id);
  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  note.comments.push({ user: req.user._id, text });
  await note.save();

  const populated = await Note.findById(note._id).populate("comments.user", "name");
  res.status(201).json(populated.comments);
});

export const downloadNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  const filePath = path.isAbsolute(note.filePath)
    ? note.filePath
    : path.join(__dirname, "..", note.filePath);

  res.download(filePath, note.fileName);
});
