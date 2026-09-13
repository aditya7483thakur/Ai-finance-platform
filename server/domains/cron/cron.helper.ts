import { addDays, addMonths, addWeeks, addYears, isBefore } from "date-fns";
import { RecurringInterval } from "../../shared/types/recurring.js";
export const getNextRecurringDate = (
  currentDate: Date,
  today: Date,
  recurringInterval: `${RecurringInterval}` | null,
): Date => {
  let nextDate = currentDate;

  while (isBefore(nextDate, today) || nextDate.getTime() === today.getTime()) {
    switch (recurringInterval) {
      case RecurringInterval.DAILY:
        nextDate = addDays(nextDate, 1);
        break;
      case RecurringInterval.WEEKLY:
        nextDate = addWeeks(nextDate, 1);
        break;
      case RecurringInterval.MONTHLY:
        nextDate = addMonths(nextDate, 1);
        break;
      case RecurringInterval.YEARLY:
        nextDate = addYears(nextDate, 1);
        break;
      default:
        nextDate = addMonths(nextDate, 1);
        break;
    }
  }

  return nextDate;
};
