import { Prisma, type Transaction as PrismaTransaction } from "@prisma/client";
import prisma, { type DbClient } from "../../config/prisma.js";
import type { PersistenceContext } from "../../shared/types/persistence.js";
import type { TransactionRepository } from "./transaction.port.js";
import type {
  Transaction,
  TransactionListFilter,
} from "./transaction.types.js";

const dbOf = (ctx?: PersistenceContext): DbClient => {
  return (ctx as DbClient | undefined) ?? prisma;
};

const toTransaction = (row: PrismaTransaction): Transaction => ({
  id: row.id,
  type: row.type,
  amount: row.amount.toString(),
  description: row.description,
  date: row.date,
  category: row.category,
  receiptUrl: row.receiptUrl,
  isRecurring: row.isRecurring,
  recurringInterval: row.recurringInterval,
  nextRecurringDate: row.nextRecurringDate,
  userId: row.userId,
  accountId: row.accountId,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toPrismaWhere = (
  filter: TransactionListFilter,
): Prisma.TransactionWhereInput => {
  return {
    ...(filter.category ? { category: filter.category } : {}),
    ...(filter.type ? { type: filter.type } : {}),
    ...(filter.isRecurring !== undefined
      ? { isRecurring: filter.isRecurring }
      : {}),
    ...(filter.description
      ? {
          description: {
            contains: filter.description,
            mode: "insensitive",
          },
        }
      : {}),
    ...(filter.accountId ? { accountId: filter.accountId } : {}),
    ...(filter.date
      ? {
          date: {
            ...(filter.date.gte ? { gte: filter.date.gte } : {}),
            ...(filter.date.lte ? { lte: filter.date.lte } : {}),
          },
        }
      : {}),
  };
};

export const transactionPrismaRepository: TransactionRepository = {
  findTransactionById: async (id, ctx) => {
    const row = await dbOf(ctx).transaction.findUnique({ where: { id } });
    return row ? toTransaction(row) : null;
  },
  findTransactionsByIds: async (transactionIds, ctx) => {
    const rows = await dbOf(ctx).transaction.findMany({
      where: { id: { in: transactionIds } },
    });
    return rows.map(toTransaction);
  },
  createTransactionRecord: async (data, nextRecurringDate, ctx) => {
    const row = await dbOf(ctx).transaction.create({
      data: {
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        description: data.description,
        date: data.date,
        category: data.category,
        accountId: data.accountId,
        userId: data.userId,
        isRecurring: data.isRecurring,
        recurringInterval: data.recurringInterval,
        nextRecurringDate,
      },
    });
    return toTransaction(row);
  },
  createRecurringTransactionRecord: async (transaction, date, ctx) => {
    const row = await dbOf(ctx).transaction.create({
      data: {
        type: transaction.type,
        amount: new Prisma.Decimal(transaction.amount),
        description: transaction.description,
        date,
        category: transaction.category,
        accountId: transaction.accountId,
        userId: transaction.userId,
        isRecurring: false,
        receiptUrl: transaction.receiptUrl,
      },
    });
    return toTransaction(row);
  },
  updateTransactionById: async (
    transactionId,
    data,
    nextRecurringDate,
    ctx,
  ) => {
    const row = await dbOf(ctx).transaction.update({
      where: { id: transactionId },
      data: {
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        description: data.description,
        date: data.date,
        category: data.category,
        isRecurring: data.isRecurring,
        recurringInterval: data.recurringInterval,
        nextRecurringDate,
      },
    });
    return toTransaction(row);
  },
  updateTransactionNextRecurringDate: async (
    transactionId,
    nextRecurringDate,
    ctx,
  ) => {
    const row = await dbOf(ctx).transaction.update({
      where: { id: transactionId },
      data: { nextRecurringDate },
    });
    return toTransaction(row);
  },
  deleteTransactionById: async (transactionId, ctx) => {
    const row = await dbOf(ctx).transaction.delete({
      where: { id: transactionId },
    });
    return toTransaction(row);
  },
  deleteTransactionsByIds: async (transactionIds, ctx) => {
    return dbOf(ctx).transaction.deleteMany({
      where: { id: { in: transactionIds } },
    });
  },
  countTransactionsByFilter: async (filter, ctx) => {
    return dbOf(ctx).transaction.count({ where: toPrismaWhere(filter) });
  },
  findTransactionsByFilter: async (filter, skip, take, ctx) => {
    const rows = await dbOf(ctx).transaction.findMany({
      where: toPrismaWhere(filter),
      orderBy: { date: "desc" },
      skip,
      take,
    });
    return rows.map(toTransaction);
  },
  findDueRecurringTransactions: async (today, ctx) => {
    const rows = await dbOf(ctx).transaction.findMany({
      where: {
        isRecurring: true,
        nextRecurringDate: {
          lte: today,
        },
      },
    });
    return rows.map(toTransaction);
  },
  getGroupedTransactions: async (filter, ctx) => {
    const rows = await dbOf(ctx).transaction.groupBy({
      by: ["date", "type"],
      _sum: { amount: true },
      where: toPrismaWhere(filter),
      orderBy: { date: "asc" },
    });

    return rows.map((row) => ({
      date: row.date,
      type: row.type,
      amount: (row._sum.amount ?? new Prisma.Decimal(0)).toString(),
    }));
  },
  getGroupedCategoryExpenses: async (
    userId,
    firstDayOfMonth,
    lastDayOfMonth,
    ctx,
  ) => {
    const rows = await dbOf(ctx).transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    return rows.map((row) => ({
      category: row.category,
      amount: (row._sum.amount ?? new Prisma.Decimal(0)).toString(),
    }));
  },
};
