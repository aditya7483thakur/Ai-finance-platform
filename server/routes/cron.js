import express from "express";
import { runRecurringTransactions } from "../controllers/cron.js";

const router = express.Router();

router.get("/run-recurring-transactions", runRecurringTransactions);

export default router;
