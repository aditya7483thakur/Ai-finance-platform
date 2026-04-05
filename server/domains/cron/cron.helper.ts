import { addDays, addMonths, addWeeks, addYears, isBefore } from "date-fns";
import type { RecurringInterval } from "@prisma/client";
import type { MonthlyExpenseItem } from "./cron.types.js";

export const getNextRecurringDate = (
  currentDate: Date,
  today: Date,
  recurringInterval: RecurringInterval | null,
): Date => {
  let nextDate = currentDate;

  while (isBefore(nextDate, today) || nextDate.getTime() === today.getTime()) {
    switch (recurringInterval) {
      case "DAILY":
        nextDate = addDays(nextDate, 1);
        break;
      case "WEEKLY":
        nextDate = addWeeks(nextDate, 1);
        break;
      case "MONTHLY":
        nextDate = addMonths(nextDate, 1);
        break;
      case "YEARLY":
        nextDate = addYears(nextDate, 1);
        break;
      default:
        nextDate = addMonths(nextDate, 1);
        break;
    }
  }

  return nextDate;
};

export const buildMonthlySummaryHtml = (
  formatted: MonthlyExpenseItem[],
  month: string,
  year: number,
  tip: string,
): string => {
  return `
    <h2>Your ${month} ${year} Expense Summary</h2>
    <ul>
      ${formatted
        .map(
          (item) =>
            `<li><strong>${item.name}</strong>: $${item.value.toFixed(2)}</li>`,
        )
        .join("")}
    </ul>
    <h3>Smart Tip:</h3>
    <p>${tip}</p>
    <br/>
    <em>Stay financially wise with Budgetly</em>
  `;
};
