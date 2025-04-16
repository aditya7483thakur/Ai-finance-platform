import express from "express";
import {
  getCurrentMonthCategoryExpenses,
  getTransactionSummary,
} from "../controllers/graph.js";
// import clerkAuthMiddleware from "../middlewares/auth.js";

const router = express.Router();
router.get("/transaction-summary", getTransactionSummary);
router.get(
  "/expense-summary",
  // clerkAuthMiddleware,
  getCurrentMonthCategoryExpenses
);
export default router;
