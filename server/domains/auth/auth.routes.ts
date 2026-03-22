import express from "express";
import { getMe, signin, signup } from "./auth.controller.js";
import { requireAuth } from "./requireAuth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", requireAuth, getMe);

export default router;
