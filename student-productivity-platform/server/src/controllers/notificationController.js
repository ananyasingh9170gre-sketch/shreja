import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  notification.read = true;
  await notification.save();

  res.json(notification);
});

export const createReminder = asyncHandler(async (req, res) => {
  const notification = await Notification.create({
    user: req.user._id,
    title: req.body.title || "Study reminder",
    message: req.body.message || "Stay consistent and complete today's tasks.",
    type: "reminder"
  });

  req.app.get("io").to(`user-${req.user._id}`).emit("new-notification", notification);
  res.status(201).json(notification);
});
