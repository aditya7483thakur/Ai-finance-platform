import { Prisma, type Account, type User } from "@prisma/client";
import prisma from "../../config/prisma.js";
import type { CreateAccountInput, UpdateAccountData } from "./account.types.js";
import { ACCOUNT_BUDGET_ALERT } from "./account.constants.js";

type DbClient = typeof prisma | Prisma.TransactionClient;

export const findUserById = async (
  userId: string,
  db: DbClient = prisma,
): Promise<User | null> => {
  return db.user.findUnique({ where: { id: userId } });
};

export const createAccountRecord = async (
  data: CreateAccountInput,
  db: DbClient = prisma,
): Promise<Account> => {
  return db.account.create({
    data: {
      name: data.name,
      balance: new Prisma.Decimal(data.balance),
      budget: data.budget === null ? null : new Prisma.Decimal(data.budget),
      usedAmount: new Prisma.Decimal(0),
      userId: data.userId,
    },
  });
};

export const findAccountById = async (
  accountId: string,
  db: DbClient = prisma,
): Promise<Account | null> => {
  return db.account.findUnique({ where: { id: accountId } });
};

export const findAccountByIdWithTransactions = async (
  accountId: string,
  db: DbClient = prisma,
) => {
  return db.account.findUnique({
    where: { id: accountId },
    include: {
      transactions: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const findAccountsByUserId = async (
  userId: string,
  db: DbClient = prisma,
): Promise<Account[]> => {
  return db.account.findMany({ where: { userId } });
};

export const updateAccountById = async (
  accountId: string,
  data: UpdateAccountData,
  db: DbClient = prisma,
): Promise<Account> => {
  return db.account.update({
    where: { id: accountId },
    data,
  });
};

export const deleteAccountById = async (
  accountId: string,
  db: DbClient = prisma,
): Promise<Account> => {
  return db.account.delete({ where: { id: accountId } });
};

export const findBudgetAlertSentTodayByAccountId = async (
  accountId: string,
  today: Date,
  db: DbClient = prisma,
) => {
  return db.scheduledEmail.findFirst({
    where: {
      accountId,
      type: ACCOUNT_BUDGET_ALERT.TYPE,
      createdAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    },
  });
};

export const createBudgetAlertSentRecord = async (
  userId: string,
  accountId: string,
  db: DbClient = prisma,
) => {
  return db.scheduledEmail.create({
    data: {
      userId,
      accountId,
      type: ACCOUNT_BUDGET_ALERT.TYPE,
      status: ACCOUNT_BUDGET_ALERT.STATUS_SENT,
    },
  });
};
