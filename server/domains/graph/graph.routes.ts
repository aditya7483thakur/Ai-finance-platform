import express from "express";
import {
  getCurrentMonthCategoryExpenses,
  getTransactionSummary,
} from "./graph.controller.js";

const router = express.Router();

router.get("/transaction-summary", getTransactionSummary);
router.get("/expense-summary", getCurrentMonthCategoryExpenses);

export default router;
