import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import { RecurringInterval } from "../../shared/types/recurring.js";

export const getNextRecurringDate = (
  transactionDate: Date,
  isRecurring: boolean,
  recurringInterval: `${RecurringInterval}` | null,
): Date | null => {
  if (!isRecurring || !recurringInterval) {
    return null;
  }

  switch (recurringInterval) {
    case RecurringInterval.DAILY:
      return addDays(transactionDate, 1);
    case RecurringInterval.WEEKLY:
      return addWeeks(transactionDate, 1);
    case RecurringInterval.MONTHLY:
      return addMonths(transactionDate, 1);
    case RecurringInterval.YEARLY:
      return addYears(transactionDate, 1);
    default:
      return null;
  }
};
