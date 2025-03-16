import express from "express";
import {
  createTransaction,
  deleteMultipleTransactions,
  deleteTransaction,
  editTransaction,
  getAccountTransactions,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.patch("/update-transaction/:transactionId", editTransaction);
router.get("/get-account-transactions/:accountId", getAccountTransactions);
router.delete("/delete-transaction/:transactionId", deleteTransaction);
router.delete("/delete-transactions", deleteMultipleTransactions);

export default router;
