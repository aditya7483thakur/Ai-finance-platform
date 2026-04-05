import type { Account, Prisma, Transaction, User } from "@prisma/client";

export type CronJobName =
  | "run-recurring-transactions"
  | "run-monthly-summaries";

export type RecurringTransactionRecord = Transaction;

export type AccountWithUser = Account & {
  user: User;
};

export type MonthlyExpenseItem = {
  name: string;
  value: number;
};

export type MonthlyCategoryExpenseSum = {
  category: string;
  _sum: {
    amount: Prisma.Decimal | null;
  };
};

export type MonthlyExpenseSummary = {
  formatted: MonthlyExpenseItem[];
  month: string;
  year: number;
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

export type RecurringAccountUpdate = {
  balance: Prisma.Decimal;
  usedAmount: Prisma.Decimal;
};

export type CronQuery = {
  date?: string | string[];
};

export type ParsedCronQuery = {
  referenceDate?: Date;
};
