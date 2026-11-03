import { LedgerEntryType } from "../../shared/types/ledger.js";
import { Money } from "../../shared/utils/money.js";
import {
  GraphFilter,
  type DailySummaryAmounts,
  type DailyTransactionSummaryItem,
  type DateRange,
  type GraphGroupedTransactionRow,
} from "./graph.types.js";

const MINUTE_MS = 60_000;

// Calendar days are handled as Date objects at UTC midnight, so day maths
// (setUTCDate, setUTCMonth) never depends on the server's timezone.
const dayKey = (day: Date): string => day.toISOString().slice(0, 10);

// The client's calendar day that an instant falls on. offsetMinutes is
// Date#getTimezoneOffset() from the client (IST = -330, so +5:30 is added).
export const toClientDay = (instant: Date, offsetMinutes: number): Date => {
  const shifted = new Date(instant.getTime() - offsetMinutes * MINUTE_MS);
  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate(),
    ),
  );
};

// The instant the client's calendar day starts.
const clientDayStart = (day: Date, offsetMinutes: number): Date =>
  new Date(day.getTime() + offsetMinutes * MINUTE_MS);

export const getDateRangeByFilter = (
  filter: GraphFilter,
  offsetMinutes: number,
  now: Date = new Date(),
): DateRange => {
  const endDay = toClientDay(now, offsetMinutes);
  const startDay = new Date(endDay);

  switch (filter) {
    case GraphFilter.LAST_7_DAYS:
      startDay.setUTCDate(startDay.getUTCDate() - 6);
      break;
    case GraphFilter.LAST_MONTH:
      startDay.setUTCMonth(startDay.getUTCMonth() - 1);
      break;
    case GraphFilter.LAST_6_MONTHS:
      startDay.setUTCMonth(startDay.getUTCMonth() - 5, 1);
      break;
  }

  const dayAfterEnd = new Date(endDay);
  dayAfterEnd.setUTCDate(dayAfterEnd.getUTCDate() + 1);

  return {
    startDate: clientDayStart(startDay, offsetMinutes),
    // Last millisecond of the client's "today".
    endDate: new Date(clientDayStart(dayAfterEnd, offsetMinutes).getTime() - 1),
    startDay,
    endDay,
  };
};

export const buildDailySummaryMap = (
  rows: GraphGroupedTransactionRow[],
  offsetMinutes: number,
): Record<string, DailySummaryAmounts> => {
  const totals: Record<string, { income: Money; expense: Money }> = {};

  for (const row of rows) {
    // Bucket by the client's calendar day, the same keys the series uses.
    const dateKey = dayKey(toClientDay(row.date, offsetMinutes));
    if (!totals[dateKey]) {
      totals[dateKey] = { income: Money.zero(), expense: Money.zero() };
    }

    const amount = Money.fromString(row.amount);
    if (row.type === LedgerEntryType.INCOME) {
      totals[dateKey].income = totals[dateKey].income.add(amount);
    } else {
      totals[dateKey].expense = totals[dateKey].expense.add(amount);
    }
  }

  const summaryMap: Record<string, DailySummaryAmounts> = {};
  for (const [dateKey, day] of Object.entries(totals)) {
    summaryMap[dateKey] = {
      income: day.income.toNumber(),
      expense: day.expense.toNumber(),
    };
  }

  return summaryMap;
};

export const buildCompleteDailySeries = (
  startDay: Date,
  endDay: Date,
  summaryMap: Record<string, DailySummaryAmounts>,
): DailyTransactionSummaryItem[] => {
  const result: DailyTransactionSummaryItem[] = [];
  const currentDay = new Date(startDay);

  while (currentDay <= endDay) {
    const dateKey = dayKey(currentDay);
    result.push({
      date: dateKey,
      income: summaryMap[dateKey]?.income ?? 0,
      expense: summaryMap[dateKey]?.expense ?? 0,
    });

    currentDay.setUTCDate(currentDay.getUTCDate() + 1);
  }

  return result;
};
