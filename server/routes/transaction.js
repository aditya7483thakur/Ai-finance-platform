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
// import { RateLimiter } from "../middlewares/arcjet.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.patch("/update-transaction/:transactionId", editTransaction);
router.delete("/delete-transaction/:transactionId", deleteTransaction);
router.delete("/delete-transactions", deleteMultipleTransactions);
router.get("/filter", getFilteredTransactions);
router.post("/ai-receipt", uploadReceipt, AiFormReceipt);

export default router;
