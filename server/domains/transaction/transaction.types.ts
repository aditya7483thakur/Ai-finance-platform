import type {
  CreateTransactionInput,
  ParsedTransactionFilters,
  ParsedTransactionSummaryFilter,
  RecurringInterval,
  TransactionCategory,
  TransactionType,
  UpdateTransactionInput,
} from "./transaction.validators.js";

export type {
  CreateTransactionInput,
  ParsedTransactionFilters,
  ParsedTransactionSummaryFilter,
  RecurringInterval,
  TransactionCategory,
  TransactionType,
  UpdateTransactionInput,
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: string;
  description: string | null;
  date: Date;
  category: TransactionCategory;
  receiptUrl: string | null;
  isRecurring: boolean;
  recurringInterval: RecurringInterval | null;
  nextRecurringDate: Date | null;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionListFilter = {
  category?: TransactionCategory;
  type?: TransactionType;
  isRecurring?: boolean;
  description?: string;
  accountId?: string;
  userId?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
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

export type { AiReceiptResult } from "../../shared/integrations/ai/ai.types.js";

export type GroupedTransactionByDateRow = {
  date: Date;
  type: TransactionType;
  amount: string;
};

export type GroupedCategoryExpenseRow = {
  category: string;
  amount: string;
};

export type TransactionAmountByTypeRow = {
  type: TransactionType;
  amount: string;
};

export type TransactionSummaryResult = {
  income: number;
  expense: number;
  net: number;
  topExpenseCategory: {
    name: string;
    value: number;
    share: number;
  } | null;
};
