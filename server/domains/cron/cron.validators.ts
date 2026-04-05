import { BadRequestError } from "../../shared/types/errors.js";
import { CRON_ERROR_MESSAGES } from "./cron.constants.js";
import type { CronQuery, ParsedCronQuery } from "./cron.types.js";

export const parseCronQuery = (query: unknown): ParsedCronQuery => {
  const rawQuery = query as CronQuery;
  const dateValue = Array.isArray(rawQuery.date)
    ? rawQuery.date[0]
    : rawQuery.date;

  if (!dateValue) {
    return {};
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new BadRequestError(CRON_ERROR_MESSAGES.INVALID_DATE_QUERY);
  }

  return { referenceDate: parsedDate };
};
