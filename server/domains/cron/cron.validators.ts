import { z } from "zod";
import { queryString } from "../../shared/utils/parseWithZod.js";
import { CRON_ERROR_MESSAGES } from "./cron.constants.js";

export const parsedCronQuerySchema = z
  .object({
    date: queryString.optional(),
  })
  .transform((query, ctx) => {
    if (!query.date) {
      return {};
    }

    const parsedDate = new Date(query.date);
    if (Number.isNaN(parsedDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date"],
        message: CRON_ERROR_MESSAGES.INVALID_DATE_QUERY,
      });
      return z.NEVER;
    }

    return { referenceDate: parsedDate };
  });

export type ParsedCronQuery = z.infer<typeof parsedCronQuerySchema>;
