import type { PersistenceContext } from "../../shared/types/persistence.js";
import type {
  CreateTransactionInput,
  GroupedCategoryExpenseRow,
  GroupedTransactionByDateRow,
  Transaction,
  TransactionAmountByTypeRow,
  TransactionListFilter,
  UpdateTransactionInput,
} from "./transaction.types.js";

export type TransactionRepository = {
  findTransactionById: (
    id: string,
    ctx?: PersistenceContext,
  ) => Promise<Transaction | null>;
  findTransactionsByIds: (
    transactionIds: string[],
    ctx?: PersistenceContext,
  ) => Promise<Transaction[]>;
  createTransactionRecord: (
    data: CreateTransactionInput,
    nextRecurringDate: Date | null,
    ctx?: PersistenceContext,
  ) => Promise<Transaction>;
  createRecurringTransactionRecord: (
    transaction: Transaction,
    date: Date,
    ctx?: PersistenceContext,
  ) => Promise<Transaction>;
  updateTransactionById: (
    transactionId: string,
    data: UpdateTransactionInput,
    nextRecurringDate: Date | null,
    ctx?: PersistenceContext,
  ) => Promise<Transaction>;
  updateTransactionNextRecurringDate: (
    transactionId: string,
    nextRecurringDate: Date,
    ctx?: PersistenceContext,
  ) => Promise<Transaction>;
  deleteTransactionById: (
    transactionId: string,
    ctx?: PersistenceContext,
  ) => Promise<Transaction>;
  deleteTransactionsByIds: (
    transactionIds: string[],
    ctx?: PersistenceContext,
  ) => Promise<{ count: number }>;
  countTransactionsByFilter: (
    filter: TransactionListFilter,
    ctx?: PersistenceContext,
  ) => Promise<number>;
  findTransactionsByFilter: (
    filter: TransactionListFilter,
    skip: number,
    take: number,
    ctx?: PersistenceContext,
  ) => Promise<Transaction[]>;
  findDueRecurringTransactions: (
    today: Date,
    ctx?: PersistenceContext,
  ) => Promise<Transaction[]>;
  getGroupedTransactions: (
    filter: TransactionListFilter,
    ctx?: PersistenceContext,
  ) => Promise<GroupedTransactionByDateRow[]>;
  getGroupedCategoryExpenses: (
    userId: string,
    firstDayOfMonth: Date,
    lastDayOfMonth: Date,
    ctx?: PersistenceContext,
  ) => Promise<GroupedCategoryExpenseRow[]>;
  sumAmountsByType: (
    filter: TransactionListFilter,
    ctx?: PersistenceContext,
  ) => Promise<TransactionAmountByTypeRow[]>;
  getTopExpenseCategory: (
    filter: TransactionListFilter,
    ctx?: PersistenceContext,
  ) => Promise<GroupedCategoryExpenseRow | null>;
};
