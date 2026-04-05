import type { Prisma } from "@prisma/client";
import {
  getGroupedCategoryExpenses,
  getGroupedTransactions,
} from "./graph.repository.js";
import type {
  CategoryExpensesResult,
  DailySummaryAmounts,
  DailyTransactionSummaryItem,
  DateRange,
  GraphFilter,
  TransactionSummaryQueryInput,
  TransactionSummaryResult,
} from "./graph.types.js";

const getDateRangeByFilter = (filter: GraphFilter): DateRange => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  switch (filter) {
    case "last_7_days": {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      return { startDate, endDate: today };
    }
    case "last_month": {
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      return { startDate, endDate: today };
    }
    case "last_6_months": {
      const startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 5, 1);
      startDate.setHours(0, 0, 0, 0);
      return { startDate, endDate: today };
    }
  }
};

const buildDateKey = (date: Date): string => date.toISOString().split("T")[0];

const buildDailySummaryMap = (
  rows: {
    date: Date;
    type: "INCOME" | "EXPENSE";
    _sum: { amount: Prisma.Decimal | null };
  }[],
): Record<string, DailySummaryAmounts> => {
  const summaryMap: Record<string, DailySummaryAmounts> = {};

  for (const row of rows) {
    const dateKey = buildDateKey(row.date);
    if (!summaryMap[dateKey]) {
      summaryMap[dateKey] = { income: 0, expense: 0 };
    }

    const amount = Number(row._sum.amount ?? 0);
    if (row.type === "INCOME") {
      summaryMap[dateKey].income += amount;
    } else {
      summaryMap[dateKey].expense += amount;
    }
  }

  return summaryMap;
};

const buildCompleteDailySeries = (
  startDate: Date,
  endDate: Date,
  summaryMap: Record<string, DailySummaryAmounts>,
): DailyTransactionSummaryItem[] => {
  const result: DailyTransactionSummaryItem[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = buildDateKey(currentDate);
    result.push({
      date: dateKey,
      income: summaryMap[dateKey]?.income ?? 0,
      expense: summaryMap[dateKey]?.expense ?? 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

export const getTransactionSummaryService = async (
  input: TransactionSummaryQueryInput,
): Promise<TransactionSummaryResult> => {
  const { startDate, endDate } = getDateRangeByFilter(input.filter);

  const rows = await getGroupedTransactions({
    accountId: input.accountId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  });

  const summaryMap = buildDailySummaryMap(
    rows as {
      date: Date;
      type: "INCOME" | "EXPENSE";
      _sum: { amount: Prisma.Decimal | null };
    }[],
  );

  const summary = buildCompleteDailySeries(startDate, endDate, summaryMap);

  const totals = summary.reduce(
    (acc, day) => {
      acc.totalIncome += day.income;
      acc.totalExpense += day.expense;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 },
  );

  return {
    summary,
    meta: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      count: summary.length,
      totalIncome: totals.totalIncome,
      totalExpense: totals.totalExpense,
      net: totals.totalIncome - totals.totalExpense,
    },
  };
};

export const getCurrentMonthCategoryExpensesService = async (
  userId: string,
): Promise<CategoryExpensesResult> => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999);

  const rows = await getGroupedCategoryExpenses(
    userId,
    firstDayOfMonth,
    lastDayOfMonth,
  );

  return {
    expenses: rows.map((row) => ({
      name: row.category,
      value: Number(row._sum.amount ?? 0),
    })),
    meta: {
      month: now.toLocaleString("default", { month: "long" }),
      year: now.getFullYear(),
      userId,
    },
  };
};
