import express from "express";
import {
  createTransaction,
  editTransaction,
  getAccountTransactions,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.patch("/update-transaction/:transactionId", editTransaction);
router.get("/get-account-transactions/:accountId", getAccountTransactions);

export default router;
