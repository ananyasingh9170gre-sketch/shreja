import Placement from "../models/Placement.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrCreatePlacement = async (userId) => {
  let placement = await Placement.findOne({ user: userId });
  if (!placement) {
    placement = await Placement.create({
      user: userId,
      resumeTips: [
        "Keep your resume to one page if under 3 years of experience.",
        "Highlight measurable outcomes and project impact.",
        "Tailor keywords based on the company role description."
      ]
    });
  }
  return placement;
};

export const getPlacement = asyncHandler(async (req, res) => {
  const placement = await getOrCreatePlacement(req.user._id);
  res.json(placement);
});

export const updateDsaProgress = asyncHandler(async (req, res) => {
  const { dsaSolved, dsaTarget } = req.body;
  const placement = await getOrCreatePlacement(req.user._id);

  if (typeof dsaSolved === "number") placement.dsaSolved = dsaSolved;
  if (typeof dsaTarget === "number") placement.dsaTarget = dsaTarget;

  await placement.save();
  res.json(placement);
});

export const addCompany = asyncHandler(async (req, res) => {
  const placement = await getOrCreatePlacement(req.user._id);
  placement.companies.push(req.body);
  await placement.save();
  res.status(201).json(placement);
});

export const addInterview = asyncHandler(async (req, res) => {
  const placement = await getOrCreatePlacement(req.user._id);
  placement.interviews.push(req.body);
  await placement.save();
  res.status(201).json(placement);
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    const error = new Error("Resume file is required");
    error.statusCode = 400;
    throw error;
  }

  const placement = await getOrCreatePlacement(req.user._id);
  placement.resumePath = `/uploads/${req.file.filename}`;
  await placement.save();

  res.json(placement);
});
