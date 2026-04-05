import type {
  DailySummaryAmounts,
  DailyTransactionSummaryItem,
  DateRange,
  GraphFilter,
  GraphGroupedTransactionRow,
} from "./graph.types.js";

export const getDateRangeByFilter = (filter: GraphFilter): DateRange => {
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

export const buildDailySummaryMap = (
  rows: GraphGroupedTransactionRow[],
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

export const buildCompleteDailySeries = (
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
