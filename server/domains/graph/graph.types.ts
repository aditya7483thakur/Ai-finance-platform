import type { Prisma, TransactionType } from "@prisma/client";

export type GraphFilter = "last_7_days" | "last_month" | "last_6_months";

export type TransactionSummaryQueryInput = {
  accountId: string;
  filter: GraphFilter;
};

export type CategoryExpensesQueryInput = {
  userId: string;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type DailySummaryAmounts = {
  income: number;
  expense: number;
};

export type DailyTransactionSummaryItem = {
  date: string;
  income: number;
  expense: number;
};

export type TransactionSummaryMeta = {
  startDate: string;
  endDate: string;
  count: number;
  totalIncome: number;
  totalExpense: number;
  net: number;
};

export type TransactionSummaryResult = {
  summary: DailyTransactionSummaryItem[];
  meta: TransactionSummaryMeta;
};

export type CategoryExpenseItem = {
  name: string;
  value: number;
};

export type CategoryExpensesMeta = {
  month: string;
  year: number;
  userId: string;
};

export type CategoryExpensesResult = {
  expenses: CategoryExpenseItem[];
  meta: CategoryExpensesMeta;
};

export type GraphGroupedTransactionRow = {
  date: Date;
  type: TransactionType;
  _sum: {
    amount: Prisma.Decimal | null;
  };
};

export type GraphGroupedCategoryExpenseRow = {
  category: string;
  _sum: {
    amount: Prisma.Decimal | null;
  };
};
