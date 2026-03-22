import express from "express";
import {
  getCurrentMonthCategoryExpenses,
  getTransactionSummary,
} from "../controllers/graph.js";

const router = express.Router();
router.get("/transaction-summary", getTransactionSummary);
router.get("/expense-summary", getCurrentMonthCategoryExpenses);
export default router;
