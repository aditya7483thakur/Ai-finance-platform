import type {
  Prisma,
  RecurringInterval,
  TransactionCategory,
  TransactionType,
} from "@prisma/client";
import { BadRequestError } from "../../shared/types/errors.js";
import { TRANSACTION_ERROR_MESSAGES } from "./transaction.constants.js";
import type {
  CreateTransactionInput,
  ParsedTransactionFilters,
  TransactionFilterQuery,
  UpdateTransactionInput,
} from "./transaction.types.js";

const parseAmount = (amount: unknown): number => {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new BadRequestError(TRANSACTION_ERROR_MESSAGES.INVALID_AMOUNT);
  }
  return numericAmount;
};

const parseDate = (value: unknown): Date => {
  const parsedDate = new Date(String(value));
  if (Number.isNaN(parsedDate.getTime())) {
    throw new BadRequestError(TRANSACTION_ERROR_MESSAGES.INVALID_DATE);
  }
  return parsedDate;
};

const parseTransactionType = (value: unknown): TransactionType => {
  if (value !== "INCOME" && value !== "EXPENSE") {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_TYPE,
    );
  }
  return value;
};

const parseTransactionCategory = (value: unknown): TransactionCategory => {
  const categories: TransactionCategory[] = [
    "SALARY",
    "INVESTMENTS",
    "FOOD",
    "TRANSPORT",
    "HOUSING",
    "ENTERTAINMENT",
    "TRAVEL",
    "HEALTH",
    "SHOPPING",
    "MISCELLANEOUS",
  ];

  if (!categories.includes(value as TransactionCategory)) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_CATEGORY,
    );
  }

  return value as TransactionCategory;
};

const parseRecurringInterval = (value: unknown): RecurringInterval | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const validIntervals: RecurringInterval[] = [
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
  ];

  if (!validIntervals.includes(value as RecurringInterval)) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.INVALID_RECURRING_INTERVAL,
    );
  }

  return value as RecurringInterval;
};

export const parseTransactionIdParam = (
  value: string | string[] | undefined,
): string => {
  const transactionId = Array.isArray(value) ? value[0] : value;
  if (!transactionId) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.TRANSACTION_ID_REQUIRED,
    );
  }
  return transactionId;
};

export const parseCreateTransactionPayload = (
  payload: unknown,
): CreateTransactionInput => {
  const data = payload as Record<string, unknown>;

  if (
    !data?.type ||
    !data?.amount ||
    !data?.date ||
    !data?.accountId ||
    !data?.userId
  ) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
    );
  }

  const isRecurring = Boolean(data.isRecurring);

  return {
    type: parseTransactionType(data.type),
    amount: parseAmount(data.amount),
    description: data.description ? String(data.description) : undefined,
    date: parseDate(data.date),
    category: parseTransactionCategory(data.category),
    accountId: String(data.accountId),
    userId: String(data.userId),
    isRecurring,
    recurringInterval: isRecurring
      ? parseRecurringInterval(data.recurringInterval)
      : null,
  };
};

export const parseUpdateTransactionPayload = (
  payload: unknown,
): UpdateTransactionInput => {
  const data = payload as Record<string, unknown>;
  const isRecurring = Boolean(data.isRecurring);

  return {
    type: parseTransactionType(data.type),
    amount: parseAmount(data.amount),
    description: data.description ? String(data.description) : undefined,
    date: parseDate(data.date),
    category: parseTransactionCategory(data.category),
    isRecurring,
    recurringInterval: isRecurring
      ? parseRecurringInterval(data.recurringInterval)
      : null,
  };
};

export const parseDeleteManyPayload = (payload: unknown): string[] => {
  const data = payload as Record<string, unknown>;
  const transactionIds = data?.transactionIds;

  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
    );
  }

  if (transactionIds.some((id) => typeof id !== "string" || !id)) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
    );
  }

  return transactionIds;
};

export const parseFilterQuery = (query: unknown): ParsedTransactionFilters => {
  const rawQuery = query as TransactionFilterQuery;
  let page = Number(rawQuery.page ?? 1);
  let limit = Number(rawQuery.limit ?? 10);

  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  const where: Prisma.TransactionWhereInput = {};

  if (rawQuery.category && rawQuery.category !== "ALL") {
    where.category = parseTransactionCategory(rawQuery.category);
  }

  if (rawQuery.type && rawQuery.type !== "ALL") {
    where.type = parseTransactionType(rawQuery.type);
  }

  if (rawQuery.isRecurring && rawQuery.isRecurring !== "ALL") {
    where.isRecurring = rawQuery.isRecurring === "true";
  }

  if (rawQuery.description) {
    where.description = {
      contains: rawQuery.description,
      mode: "insensitive",
    };
  }

  if (rawQuery.accountId) {
    where.accountId = rawQuery.accountId;
  }

  return {
    where,
    page,
    limit,
  };
};
