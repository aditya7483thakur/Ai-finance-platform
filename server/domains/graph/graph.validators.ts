import { z } from "zod";
import { requiredQueryString } from "../../shared/utils/parseWithZod.js";
import { GRAPH_ERROR_MESSAGES, GraphFilter } from "./graph.constants.js";

export const graphFilterSchema = z.nativeEnum(GraphFilter, {
  errorMap: () => ({ message: GRAPH_ERROR_MESSAGES.INVALID_FILTER_OPTION }),
});

export const transactionSummaryQuerySchema = z.object({
  accountId: requiredQueryString(GRAPH_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED),
  filter: requiredQueryString(GRAPH_ERROR_MESSAGES.FILTER_REQUIRED).pipe(
    graphFilterSchema,
  ),
  // The client's Date#getTimezoneOffset() (minutes; IST is -330). Days on
  // the chart are the client's calendar days. Falls back to the server's.
  tzOffset: z.coerce
    .number({ invalid_type_error: GRAPH_ERROR_MESSAGES.INVALID_TZ_OFFSET })
    .int(GRAPH_ERROR_MESSAGES.INVALID_TZ_OFFSET)
    .min(-840, GRAPH_ERROR_MESSAGES.INVALID_TZ_OFFSET)
    .max(840, GRAPH_ERROR_MESSAGES.INVALID_TZ_OFFSET)
    .optional(),
});

export type TransactionSummaryQueryInput = z.infer<
  typeof transactionSummaryQuerySchema
> & {
  userId: string;
};
