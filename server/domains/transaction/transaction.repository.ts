import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "./transaction.types.js";

type DbClient = typeof prisma | Prisma.TransactionClient;

export const findTransactionById = async (
  id: string,
  db: DbClient = prisma,
) => {
  return db.transaction.findUnique({ where: { id } });
};

export const findTransactionsByIds = async (
  transactionIds: string[],
  db: DbClient = prisma,
) => {
  return db.transaction.findMany({
    where: { id: { in: transactionIds } },
  });
};

export const createTransactionRecord = async (
  data: CreateTransactionInput,
  nextRecurringDate: Date | null,
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
};

export const updateTransactionById = async (
  transactionId: string,
  data: UpdateTransactionInput,
  nextRecurringDate: Date | null,
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
};

export const deleteTransactionById = async (
  transactionId: string,
  db: DbClient = prisma,
) => {
  return db.transaction.delete({ where: { id: transactionId } });
};

export const deleteTransactionsByIds = async (
  transactionIds: string[],
  db: DbClient = prisma,
) => {
  return db.transaction.deleteMany({ where: { id: { in: transactionIds } } });
};

export const findAccountById = async (
  accountId: string,
  db: DbClient = prisma,
) => {
  return db.account.findUnique({ where: { id: accountId } });
};

export const findAccountWithUserById = async (
  accountId: string,
  db: DbClient = prisma,
) => {
  return db.account.findUnique({
    where: { id: accountId },
    include: { user: true },
  });
};

export const updateAccountAmounts = async (
  accountId: string,
  balance: Prisma.Decimal,
  usedAmount: Prisma.Decimal,
  db: DbClient = prisma,
) => {
  return db.account.update({
    where: { id: accountId },
    data: {
      balance,
      usedAmount,
    },
  });
};

export const countTransactionsByFilter = async (
  where: Prisma.TransactionWhereInput,
  db: DbClient = prisma,
) => {
  return db.transaction.count({ where });
};

export const findTransactionsByFilter = async (
  where: Prisma.TransactionWhereInput,
  skip: number,
  take: number,
  db: DbClient = prisma,
) => {
  return db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    skip,
    take,
  });
};
