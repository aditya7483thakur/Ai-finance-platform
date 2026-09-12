import { Prisma, type Account as PrismaAccount, type User } from "@prisma/client";
import prisma, { type DbClient } from "../../config/prisma.js";
import type { PersistenceContext } from "../../shared/types/persistence.js";
import { ACCOUNT_BUDGET_ALERT } from "./account.constants.js";
import type { AccountRepository } from "./account.port.js";
import type { Account, AccountUser, AccountWithUser } from "./account.types.js";

const dbOf = (ctx?: PersistenceContext): DbClient => {
  return (ctx as DbClient | undefined) ?? prisma;
};

const toAccount = (row: PrismaAccount): Account => ({
  id: row.id,
  name: row.name,
  balance: row.balance.toString(),
  budget: row.budget === null ? null : row.budget.toString(),
  usedAmount: row.usedAmount.toString(),
  userId: row.userId,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toAccountUser = (user: User): AccountUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

const toAccountWithUser = (
  row: PrismaAccount & { user: User },
): AccountWithUser => ({
  ...toAccount(row),
  user: toAccountUser(row.user),
});

export const accountPrismaRepository: AccountRepository = {
  createAccountRecord: async (data, ctx) => {
    const row = await dbOf(ctx).account.create({
      data: {
        name: data.name,
        balance: new Prisma.Decimal(data.balance),
        budget: data.budget === null ? null : new Prisma.Decimal(data.budget),
        usedAmount: new Prisma.Decimal(0),
        userId: data.userId,
      },
    });

    return toAccount(row);
  },
  findAccountById: async (accountId, ctx) => {
    const row = await dbOf(ctx).account.findUnique({ where: { id: accountId } });
    return row ? toAccount(row) : null;
  },
  findAccountByIdWithTransactions: async (accountId, ctx) => {
    const row = await dbOf(ctx).account.findUnique({
      where: { id: accountId },
      include: {
        transactions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!row) {
      return null;
    }

    return {
      ...toAccount(row),
      transactions: row.transactions,
    };
  },
  findAccountsByUserId: async (userId, ctx) => {
    const rows = await dbOf(ctx).account.findMany({ where: { userId } });
    return rows.map(toAccount);
  },
  updateAccountById: async (accountId, data, ctx) => {
    const row = await dbOf(ctx).account.update({
      where: { id: accountId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.budget !== undefined
          ? {
              budget:
                data.budget === null ? null : new Prisma.Decimal(data.budget),
            }
          : {}),
      },
    });

    return toAccount(row);
  },
  updateAccountAmounts: async (accountId, balance, usedAmount, ctx) => {
    const row = await dbOf(ctx).account.update({
      where: { id: accountId },
      data: {
        balance: new Prisma.Decimal(balance),
        usedAmount: new Prisma.Decimal(usedAmount),
      },
    });

    return toAccount(row);
  },
  deleteAccountById: async (accountId, ctx) => {
    const row = await dbOf(ctx).account.delete({ where: { id: accountId } });
    return toAccount(row);
  },
  findAccountWithUserById: async (accountId, ctx) => {
    const row = await dbOf(ctx).account.findUnique({
      where: { id: accountId },
      include: { user: true },
    });

    return row ? toAccountWithUser(row) : null;
  },
  findBudgetAlertSentTodayByAccountId: async (accountId, today, ctx) => {
    return dbOf(ctx).scheduledEmail.findFirst({
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
  createBudgetAlertSentRecord: async (userId, accountId, ctx) => {
    await dbOf(ctx).scheduledEmail.create({
      data: {
        userId,
        accountId,
        type: ACCOUNT_BUDGET_ALERT.TYPE,
        status: ACCOUNT_BUDGET_ALERT.STATUS_SENT,
      },
    });
  },
};
