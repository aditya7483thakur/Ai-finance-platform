export type CronJobName =
  | "run-recurring-transactions"
  | "run-monthly-summaries";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type MonthlyExpenseItem = {
  name: string;
  value: number;
};

export type RunRecurringTransactionsResult = {
  processedCount: number;
};

export type SendMonthlySummariesResult = {
  totalUsers: number;
  sentCount: number;
  skippedCount: number;
  failedCount: number;
};

export type CronQuery = {
  date?: string | string[];
};

export type ParsedCronQuery = {
  referenceDate?: Date;
};
