import { startOfMonth, endOfMonth } from "date-fns";
import prisma from "./prisma.js";

export const getMonthlyCategoryExpenses = async (userId) => {
  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);

  const categoryExpenses = await prisma.transaction.groupBy({
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

  return {
    formatted: categoryExpenses.map((item) => ({
      name: item.category,
      value: Number(item._sum.amount),
    })),
    raw: categoryExpenses,
    month: now.toLocaleString("default", { month: "long" }),
    year: now.getFullYear(),
  };
};
