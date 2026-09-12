export type TransactionType = "INCOME" | "EXPENSE";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type TransactionCategory =
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

export type TransactionListFilter = {
  category?: TransactionCategory;
  type?: TransactionType;
  isRecurring?: boolean;
  description?: string;
  accountId?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
};

export type ParsedTransactionFilters = {
  filter: TransactionListFilter;
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
  type?: TransactionType;
  amount?: string;
  category?: TransactionCategory;
  date?: string;
  description?: string;
};

export type GroupedTransactionByDateRow = {
  date: Date;
  type: TransactionType;
  amount: string;
};

export type GroupedCategoryExpenseRow = {
  category: string;
  amount: string;
};
