import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user._id
  });

  if (task.dueDate) {
    const notification = await Notification.create({
      user: req.user._id,
      title: "Upcoming deadline",
      message: `${task.title} has a deadline on ${new Date(task.dueDate).toDateString()}.`,
      type: "deadline"
    });
    req.app.get("io").to(`user-${req.user._id}`).emit("new-notification", notification);
  }

  res.status(201).json(task);
});

export const listTasks = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = { user: req.user._id };
  if (category) query.category = category;
  const tasks = await Task.find(query).sort({ createdAt: -1 });
  res.json(tasks);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }
  res.json({ message: "Task removed" });
});
