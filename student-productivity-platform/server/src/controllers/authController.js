import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "student"
  });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id, user.role)
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id, user.role)
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});
