import express from "express";
import { getMe, listUsers, loginUser, registerUser } from "../controllers/authController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/users", protect, authorize("admin"), listUsers);

export default router;
