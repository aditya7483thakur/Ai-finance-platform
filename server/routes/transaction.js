import express from "express";
import {
  createTransaction,
  deleteMultipleTransactions,
  deleteTransaction,
  editTransaction,
  getFilteredTransactions,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.patch("/update-transaction/:transactionId", editTransaction);
router.delete("/delete-transaction/:transactionId", deleteTransaction);
router.delete("/delete-transactions", deleteMultipleTransactions);
router.get("/filter", getFilteredTransactions);

export default router;
