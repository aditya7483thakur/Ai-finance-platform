import express from "express";
import {
  runRecurringTransactions,
  sendMonthlySummaries,
} from "./cron.controller.js";

const router = express.Router();

router.post("/run-recurring-transactions", runRecurringTransactions);
router.post("/run-monthly-summaries", sendMonthlySummaries);

export default router;
