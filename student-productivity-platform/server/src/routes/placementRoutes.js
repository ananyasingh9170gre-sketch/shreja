import express from "express";
import {
  addCompany,
  addInterview,
  getPlacement,
  updateDsaProgress,
  uploadResume
} from "../controllers/placementController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getPlacement);
router.patch("/dsa", updateDsaProgress);
router.post("/companies", addCompany);
router.post("/interviews", addInterview);
router.post("/resume", upload.single("file"), uploadResume);

export default router;
