import express from "express";
import {
  createReminder,
  getNotifications,
  markNotificationRead
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.post("/", createReminder);
router.patch("/:id/read", markNotificationRead);

export default router;
