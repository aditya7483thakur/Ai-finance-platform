import express from "express";
import { createTransaction } from "../controllers/transaction.js";

const router = express.Router();

router.post("/create-transaction", createTransaction);

export default router;
