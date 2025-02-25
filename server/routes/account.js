import express from "express";
import clerkAuthMiddleware from "../middlewares/auth.js";
import { createAccount } from "../controllers/account.js";

const router = express.Router();

router.post("/create-account", createAccount);

export default router;
