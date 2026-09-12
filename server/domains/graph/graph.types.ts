export type {
  CategoryExpensesQueryInput,
  GraphFilter,
  TransactionSummaryQueryInput,
} from "./graph.validators.js";

export type GraphTransactionType = "INCOME" | "EXPENSE";

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
  type: GraphTransactionType;
  amount: number;
};
