import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";

type DbClient = typeof prisma | Prisma.TransactionClient;

export const getGroupedTransactions = async (
  where: Prisma.TransactionWhereInput,
  db: DbClient = prisma,
) => {
  return db.transaction.groupBy({
    by: ["date", "type"],
    _sum: { amount: true },
    where,
    orderBy: { date: "asc" },
  });
};

export const getGroupedCategoryExpenses = async (
  userId: string,
  firstDayOfMonth: Date,
  lastDayOfMonth: Date,
  db: DbClient = prisma,
) => {
  return db.transaction.groupBy({
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
};
