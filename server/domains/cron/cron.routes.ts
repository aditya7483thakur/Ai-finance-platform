import express from "express";
import {
  runRecurringTransactions,
  sendMonthlySummaries,
} from "./cron.controller.js";

const router = express.Router();

router.get("/run-recurring-transactions", runRecurringTransactions);
router.get("/run-monthly-summaries", sendMonthlySummaries);

export default router;
