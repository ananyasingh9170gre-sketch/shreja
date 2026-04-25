import express from "express";
import {
  addComment,
  createNote,
  downloadNote,
  getNoteById,
  likeNote,
  listNotes
} from "../controllers/noteController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, listNotes);
router.post("/", protect, upload.single("file"), createNote);
router.get("/:id", protect, getNoteById);
router.get("/:id/download", protect, downloadNote);
router.patch("/:id/like", protect, likeNote);
router.post("/:id/comments", protect, addComment);

export default router;
