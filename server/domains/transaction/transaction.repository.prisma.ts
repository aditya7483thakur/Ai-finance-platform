import { Prisma } from "@prisma/client";
import prisma, { type DbClient } from "../../config/prisma.js";
import type { TransactionRepository } from "./transaction.port.js";

export const transactionPrismaRepository: TransactionRepository = {
  findTransactionById: async (id, db: DbClient = prisma) => {
    return db.transaction.findUnique({ where: { id } });
  },
  findTransactionsByIds: async (transactionIds, db: DbClient = prisma) => {
    return db.transaction.findMany({
      where: { id: { in: transactionIds } },
    });
  },
  createTransactionRecord: async (
    data,
    nextRecurringDate,
    db: DbClient = prisma,
  ) => {
    return db.transaction.create({
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
  },
  createRecurringTransactionRecord: async (
    transaction,
    date,
    db: DbClient = prisma,
  ) => {
    return db.transaction.create({
      data: {
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date,
        category: transaction.category,
        accountId: transaction.accountId,
        userId: transaction.userId,
        isRecurring: false,
        receiptUrl: transaction.receiptUrl,
      },
    });
  },
  updateTransactionById: async (
    transactionId,
    data,
    nextRecurringDate,
    db: DbClient = prisma,
  ) => {
    return db.transaction.update({
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
  },
  updateTransactionNextRecurringDate: async (
    transactionId,
    nextRecurringDate,
    db: DbClient = prisma,
  ) => {
    return db.transaction.update({
      where: { id: transactionId },
      data: { nextRecurringDate },
    });
  },
  deleteTransactionById: async (transactionId, db: DbClient = prisma) => {
    return db.transaction.delete({ where: { id: transactionId } });
  },
  deleteTransactionsByIds: async (transactionIds, db: DbClient = prisma) => {
    return db.transaction.deleteMany({ where: { id: { in: transactionIds } } });
  },
  countTransactionsByFilter: async (where, db: DbClient = prisma) => {
    return db.transaction.count({ where });
  },
  findTransactionsByFilter: async (where, skip, take, db: DbClient = prisma) => {
    return db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take,
    });
  },
  findDueRecurringTransactions: async (today, db: DbClient = prisma) => {
    return db.transaction.findMany({
      where: {
        isRecurring: true,
        nextRecurringDate: {
          lte: today,
        },
      },
    });
  },
  getGroupedTransactions: async (where, db: DbClient = prisma) => {
    const rows = await db.transaction.groupBy({
      by: ["date", "type"],
      _sum: { amount: true },
      where,
      orderBy: { date: "asc" },
    });
    return rows;
  },
  getGroupedCategoryExpenses: async (
    userId,
    firstDayOfMonth,
    lastDayOfMonth,
    db: DbClient = prisma,
  ) => {
    const rows = await db.transaction.groupBy({
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
    return rows;
  },
};
