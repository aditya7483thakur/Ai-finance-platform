import express from "express";
import { parseReceipt } from "./ai.controller.js";
import { uploadReceipt } from "../../shared/middleware/uploadMiddleware.js";
import rateLimiter from "../../shared/middleware/rateLimiter.js";

const router = express.Router();

router.post("/receipt", rateLimiter(10), uploadReceipt, parseReceipt);

export default router;
