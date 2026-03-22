import express from "express";
import {
  AiFormReceipt,
  createTransaction,
  deleteMultipleTransactions,
  deleteTransaction,
  editTransaction,
  getFilteredTransactions,
} from "../controllers/transaction.js";
import { uploadReceipt } from "../middlewares/uploadMiddleware.js";
import rateLimiter from "../middlewares/rateLimiter.js";
// import { RateLimiter } from "../middlewares/arcjet.js";

const router = express.Router();

router.post("/create-transaction", rateLimiter(2), createTransaction);
router.patch(
  "/update-transaction/:transactionId",
  rateLimiter(2),
  editTransaction
);
router.delete(
  "/delete-transaction/:transactionId",
  rateLimiter(2),
  deleteTransaction
);
router.delete(
  "/delete-transactions",
  rateLimiter(5),
  deleteMultipleTransactions
);
router.get("/filter", getFilteredTransactions);
router.post("/ai-receipt", rateLimiter(10), uploadReceipt, AiFormReceipt);

export default router;
