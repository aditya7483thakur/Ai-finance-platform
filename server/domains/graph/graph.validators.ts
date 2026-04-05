import { BadRequestError } from "../../shared/types/errors.js";
import { GRAPH_ERROR_MESSAGES } from "./graph.constants.js";
import type {
  CategoryExpensesQueryInput,
  GraphFilter,
  TransactionSummaryQueryInput,
} from "./graph.types.js";

const GRAPH_FILTERS: GraphFilter[] = [
  "last_7_days",
  "last_month",
  "last_6_months",
];

const parseStringField = (value: unknown, missingMessage: string): string => {
  const parsedValue = Array.isArray(value) ? value[0] : value;
  if (typeof parsedValue !== "string" || !parsedValue.trim()) {
    throw new BadRequestError(missingMessage);
  }

  return parsedValue.trim();
};

const parseFilter = (value: unknown): GraphFilter => {
  const parsedFilter = parseStringField(
    value,
    GRAPH_ERROR_MESSAGES.FILTER_REQUIRED,
  );
  if (!GRAPH_FILTERS.includes(parsedFilter as GraphFilter)) {
    throw new BadRequestError(GRAPH_ERROR_MESSAGES.INVALID_FILTER_OPTION);
  }

  return parsedFilter as GraphFilter;
};

export const parseTransactionSummaryQuery = (
  query: unknown,
): TransactionSummaryQueryInput => {
  const data = query as Record<string, unknown>;

  return {
    accountId: parseStringField(
      data.accountId,
      GRAPH_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED,
    ),
    filter: parseFilter(data.filter),
  };
};

export const parseCategoryExpensesQuery = (
  query: unknown,
): CategoryExpensesQueryInput => {
  const data = query as Record<string, unknown>;

  return {
    userId: parseStringField(
      data.userId,
      GRAPH_ERROR_MESSAGES.USER_ID_REQUIRED,
    ),
  };
};
