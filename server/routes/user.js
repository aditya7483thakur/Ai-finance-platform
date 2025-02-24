import express from "express";
import { clerkUser } from "../controllers/user.js";

const router = express.Router();

router.post("/clerk-webhook", clerkUser);

export default router;
