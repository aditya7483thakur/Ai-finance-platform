import express from "express";
import {
  AiFormReceipt,
  createTransaction,
  deleteMultipleTransactions,
  deleteTransaction,
  editTransaction,
  getFilteredTransactions,
} from "./transaction.controller.js";
import { uploadReceipt } from "../../shared/middleware/uploadMiddleware.js";
import rateLimiter from "../../shared/middleware/rateLimiter.js";

const router = express.Router();

router.post("/create-transaction", rateLimiter(2), createTransaction);
router.patch(
  "/update-transaction/:transactionId",
  rateLimiter(2),
  editTransaction,
);
router.delete(
  "/delete-transaction/:transactionId",
  rateLimiter(2),
  deleteTransaction,
);
router.delete(
  "/delete-transactions",
  rateLimiter(5),
  deleteMultipleTransactions,
);
router.get("/filter", getFilteredTransactions);
router.post("/ai-receipt", rateLimiter(10), uploadReceipt, AiFormReceipt);

export default router;
