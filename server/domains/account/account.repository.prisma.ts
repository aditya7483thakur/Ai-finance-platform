import { Prisma } from "@prisma/client";
import prisma, { type DbClient } from "../../config/prisma.js";
import { ACCOUNT_BUDGET_ALERT } from "./account.constants.js";
import type { AccountRepository } from "./account.port.js";

export const accountPrismaRepository: AccountRepository = {
  createAccountRecord: async (data, db: DbClient = prisma) => {
    return db.account.create({
      data: {
        name: data.name,
        balance: new Prisma.Decimal(data.balance),
        budget: data.budget === null ? null : new Prisma.Decimal(data.budget),
        usedAmount: new Prisma.Decimal(0),
        userId: data.userId,
      },
    });
  },
  findAccountById: async (accountId, db: DbClient = prisma) => {
    return db.account.findUnique({ where: { id: accountId } });
  },
  findAccountByIdWithTransactions: async (accountId, db: DbClient = prisma) => {
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
  },
  findAccountsByUserId: async (userId, db: DbClient = prisma) => {
    return db.account.findMany({ where: { userId } });
  },
  updateAccountById: async (accountId, data, db: DbClient = prisma) => {
    return db.account.update({
      where: { id: accountId },
      data,
    });
  },
  updateAccountAmounts: async (
    accountId,
    balance,
    usedAmount,
    db: DbClient = prisma,
  ) => {
    return db.account.update({
      where: { id: accountId },
      data: {
        balance,
        usedAmount,
      },
    });
  },
  deleteAccountById: async (accountId, db: DbClient = prisma) => {
    return db.account.delete({ where: { id: accountId } });
  },
  findAccountWithUserById: async (accountId, db: DbClient = prisma) => {
    return db.account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });
  },
  findBudgetAlertSentTodayByAccountId: async (
    accountId,
    today,
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
      select: { id: true },
    });
  },
  createBudgetAlertSentRecord: async (
    userId,
    accountId,
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
  },
};
