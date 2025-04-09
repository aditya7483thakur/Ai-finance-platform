import express from "express";
import {
  runRecurringTransactions,
  sendMonthlySummaries,
} from "../controllers/cron.js";

const router = express.Router();

router.get("/run-recurring-transactions", runRecurringTransactions);
router.get("/run-monthly-summaries", sendMonthlySummaries);

export default router;
