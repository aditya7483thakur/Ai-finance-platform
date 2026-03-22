import express from "express";
import { signup, signin, getMe } from "../controllers/auth.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", requireAuth, getMe);

export default router;
