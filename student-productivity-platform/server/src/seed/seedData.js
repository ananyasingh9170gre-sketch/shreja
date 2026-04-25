import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Note from "../models/Note.js";
import Task from "../models/Task.js";
import Placement from "../models/Placement.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Note.deleteMany({}),
    Task.deleteMany({}),
    Placement.deleteMany({})
  ]);

  const password = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Demo Student",
    email: "student@example.com",
    password,
    role: "student"
  });

  await Task.insertMany([
    { user: user._id, category: "topic", subject: "DBMS", title: "Normalization", completed: true },
    { user: user._id, category: "topic", subject: "OS", title: "Deadlocks", completed: false },
    { user: user._id, category: "todo", title: "Revise graph problems", dueDate: new Date() },
    { user: user._id, category: "study", title: "Daily Study", studyMinutes: 120, studyDate: new Date() }
  ]);

  await Placement.create({
    user: user._id,
    dsaSolved: 95,
    dsaTarget: 300,
    companies: [{ company: "Google", status: "in-progress", notes: "Focus on DP and system design basics." }],
    interviews: [{ title: "Mock with peer", scheduledAt: new Date(Date.now() + 86400000), link: "https://meet.google.com" }],
    resumeTips: [
      "Use strong action verbs.",
      "Quantify each project impact.",
      "Keep ATS-friendly formatting."
    ]
  });

  console.log("Seed data inserted.");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
