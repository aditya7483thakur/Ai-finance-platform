import express from "express";
import { getTransactionSummary } from "../controllers/graph.js";

const router = express.Router();
router.get("/transaction-summary", getTransactionSummary);
export default router;
