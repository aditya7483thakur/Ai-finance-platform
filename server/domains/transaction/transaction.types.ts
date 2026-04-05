import type {
  Prisma,
  RecurringInterval,
  TransactionCategory,
  TransactionType,
} from "@prisma/client";

export type TransactionId = string;

export type CreateTransactionInput = {
  type: TransactionType;
  amount: number;
  description?: string;
  date: Date;
  category: TransactionCategory;
  accountId: string;
  userId: string;
  isRecurring: boolean;
  recurringInterval: RecurringInterval | null;
};

export type UpdateTransactionInput = {
  type: TransactionType;
  amount: number;
  description?: string;
  date: Date;
  category: TransactionCategory;
  isRecurring: boolean;
  recurringInterval: RecurringInterval | null;
};

export type TransactionFilterQuery = {
  category?: string;
  type?: string;
  isRecurring?: string;
  description?: string;
  accountId?: string;
  page?: string;
  limit?: string;
};

export type ParsedTransactionFilters = {
  where: Prisma.TransactionWhereInput;
  page: number;
  limit: number;
};

export type FilteredTransactionsResult<T> = {
  transactions: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalTransactions: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type AiReceiptResult = {
  type?: "INCOME" | "EXPENSE";
  amount?: string;
  category?:
    | "SALARY"
    | "INVESTMENTS"
    | "FOOD"
    | "TRANSPORT"
    | "HOUSING"
    | "ENTERTAINMENT"
    | "TRAVEL"
    | "HEALTH"
    | "SHOPPING"
    | "MISCELLANEOUS";
  date?: string;
  description?: string;
};
