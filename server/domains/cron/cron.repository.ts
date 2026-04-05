import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import type {
  AccountWithUser,
  MonthlyCategoryExpenseSum,
  RecurringAccountUpdate,
  RecurringTransactionRecord,
} from "./cron.types.js";

type DbClient = typeof prisma | Prisma.TransactionClient;

export const findDueRecurringTransactions = async (
  today: Date,
  db: DbClient = prisma,
): Promise<RecurringTransactionRecord[]> => {
  return db.transaction.findMany({
    where: {
      isRecurring: true,
      nextRecurringDate: {
        lte: today,
      },
    },
  });
};

export const createRecurringTransactionRecord = async (
  transaction: RecurringTransactionRecord,
  date: Date,
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
};

export const findAccountById = async (
  accountId: string,
  db: DbClient = prisma,
) => {
  return db.account.findUnique({
    where: { id: accountId },
  });
};

export const updateAccountForRecurringTransaction = async (
  accountId: string,
  amounts: RecurringAccountUpdate,
  db: DbClient = prisma,
) => {
  return db.account.update({
    where: { id: accountId },
    data: {
      balance: amounts.balance,
      usedAmount: amounts.usedAmount,
    },
  });
};

export const updateTransactionNextRecurringDate = async (
  transactionId: string,
  nextRecurringDate: Date,
  db: DbClient = prisma,
) => {
  return db.transaction.update({
    where: { id: transactionId },
    data: { nextRecurringDate },
  });
};

export const findAccountWithUserById = async (
  accountId: string,
  db: DbClient = prisma,
): Promise<AccountWithUser | null> => {
  return db.account.findUnique({
    where: { id: accountId },
    include: { user: true },
  });
};

export const findUsersForMonthlySummary = async (db: DbClient = prisma) => {
  return db.user.findMany({
    include: {
      accounts: true,
    },
  });
};

export const findMonthlyCategoryExpenseSums = async (
  userId: string,
  from: Date,
  to: Date,
  db: DbClient = prisma,
): Promise<MonthlyCategoryExpenseSum[]> => {
  const categoryExpenses = await db.transaction.groupBy({
    by: ["category"],
    where: {
      userId,
      type: "EXPENSE",
      date: {
        gte: from,
        lte: to,
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

  return categoryExpenses as MonthlyCategoryExpenseSum[];
};
