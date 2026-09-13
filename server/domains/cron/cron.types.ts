export type CronJobName =
  | "run-recurring-transactions"
  | "run-monthly-summaries";

export type RunRecurringTransactionsResult = {
  processedCount: number;
};

export type SendMonthlySummariesResult = {
  totalUsers: number;
  sentCount: number;
  skippedCount: number;
  failedCount: number;
};

export type { ParsedCronQuery } from "./cron.validators.js";
