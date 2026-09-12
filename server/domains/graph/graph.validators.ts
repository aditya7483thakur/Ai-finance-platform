import { z } from "zod";
import {
  parseWithZod,
  requiredQueryString,
} from "../../shared/utils/parseWithZod.js";
import { GRAPH_ERROR_MESSAGES } from "./graph.constants.js";

export const graphFilterSchema = z.enum(
  ["last_7_days", "last_month", "last_6_months"],
  {
    errorMap: () => ({ message: GRAPH_ERROR_MESSAGES.INVALID_FILTER_OPTION }),
  },
);

export const transactionSummaryQuerySchema = z.object({
  accountId: requiredQueryString(GRAPH_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED),
  filter: requiredQueryString(GRAPH_ERROR_MESSAGES.FILTER_REQUIRED).pipe(
    graphFilterSchema,
  ),
});

export const categoryExpensesQuerySchema = z.object({
  userId: requiredQueryString(GRAPH_ERROR_MESSAGES.USER_ID_REQUIRED),
});

export type GraphFilter = z.infer<typeof graphFilterSchema>;
export type TransactionSummaryQueryInput = z.infer<
  typeof transactionSummaryQuerySchema
>;
export type CategoryExpensesQueryInput = z.infer<
  typeof categoryExpensesQuerySchema
>;

export const parseTransactionSummaryQuery = (
  query: unknown,
): TransactionSummaryQueryInput => {
  return parseWithZod<TransactionSummaryQueryInput>(
    transactionSummaryQuerySchema,
    query,
    GRAPH_ERROR_MESSAGES.FILTER_REQUIRED,
  );
};

export const parseCategoryExpensesQuery = (
  query: unknown,
): CategoryExpensesQueryInput => {
  return parseWithZod<CategoryExpensesQueryInput>(
    categoryExpensesQuerySchema,
    query,
    GRAPH_ERROR_MESSAGES.USER_ID_REQUIRED,
  );
};
