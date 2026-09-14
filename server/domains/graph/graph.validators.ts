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
});

export type TransactionSummaryQueryInput = z.infer<
  typeof transactionSummaryQuerySchema
> & {
  userId: string;
};
