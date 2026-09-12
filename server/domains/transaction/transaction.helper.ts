import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import type { AiReceiptResult, RecurringInterval } from "./transaction.types.js";

export const getNextRecurringDate = (
  transactionDate: Date,
  isRecurring: boolean,
  recurringInterval: RecurringInterval | null,
): Date | null => {
  if (!isRecurring || !recurringInterval) {
    return null;
  }

  switch (recurringInterval) {
    case "DAILY":
      return addDays(transactionDate, 1);
    case "WEEKLY":
      return addWeeks(transactionDate, 1);
    case "MONTHLY":
      return addMonths(transactionDate, 1);
    case "YEARLY":
      return addYears(transactionDate, 1);
    default:
      return null;
  }
};

export const ensureNotNegativeAmount = (value: number): number => {
  return Math.max(value, 0);
};

export const parseGeminiJson = (rawText: string): AiReceiptResult => {
  const cleanText = rawText.replace(/```(json)?/g, "").trim();
  const parsed = JSON.parse(cleanText) as AiReceiptResult;
  return parsed;
};
