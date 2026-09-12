import type { Prisma, Transaction } from "@prisma/client";
import type { DbClient } from "../../config/prisma.js";
import type {
  CreateTransactionInput,
  GroupedCategoryExpenseRow,
  GroupedTransactionByDateRow,
  UpdateTransactionInput,
} from "./transaction.types.js";

export type TransactionRepository = {
  findTransactionById: (id: string, db?: DbClient) => Promise<Transaction | null>;
  findTransactionsByIds: (
    transactionIds: string[],
    db?: DbClient,
  ) => Promise<Transaction[]>;
  createTransactionRecord: (
    data: CreateTransactionInput,
    nextRecurringDate: Date | null,
    db?: DbClient,
  ) => Promise<Transaction>;
  createRecurringTransactionRecord: (
    transaction: Transaction,
    date: Date,
    db?: DbClient,
  ) => Promise<Transaction>;
  updateTransactionById: (
    transactionId: string,
    data: UpdateTransactionInput,
    nextRecurringDate: Date | null,
    db?: DbClient,
  ) => Promise<Transaction>;
  updateTransactionNextRecurringDate: (
    transactionId: string,
    nextRecurringDate: Date,
    db?: DbClient,
  ) => Promise<Transaction>;
  deleteTransactionById: (transactionId: string, db?: DbClient) => Promise<Transaction>;
  deleteTransactionsByIds: (
    transactionIds: string[],
    db?: DbClient,
  ) => Promise<{ count: number }>;
  countTransactionsByFilter: (
    where: Prisma.TransactionWhereInput,
    db?: DbClient,
  ) => Promise<number>;
  findTransactionsByFilter: (
    where: Prisma.TransactionWhereInput,
    skip: number,
    take: number,
    db?: DbClient,
  ) => Promise<Transaction[]>;
  findDueRecurringTransactions: (
    today: Date,
    db?: DbClient,
  ) => Promise<Transaction[]>;
  getGroupedTransactions: (
    where: Prisma.TransactionWhereInput,
    db?: DbClient,
  ) => Promise<GroupedTransactionByDateRow[]>;
  getGroupedCategoryExpenses: (
    userId: string,
    firstDayOfMonth: Date,
    lastDayOfMonth: Date,
    db?: DbClient,
  ) => Promise<GroupedCategoryExpenseRow[]>;
};
