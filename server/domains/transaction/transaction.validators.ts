import { z } from "zod";
import { TransactionCategory as TransactionCategoryEnum } from "../../shared/types/category.js";
import { LedgerEntryType } from "../../shared/types/ledger.js";
import { RecurringInterval as RecurringIntervalEnum } from "../../shared/types/recurring.js";
import { queryString, routeParam } from "../../shared/utils/parseWithZod.js";
import {
  TRANSACTION_ERROR_MESSAGES,
  TRANSACTION_FILTER_ALL,
} from "./transaction.constants.js";

export const transactionTypeSchema = z.nativeEnum(LedgerEntryType, {
  errorMap: () => ({
    message: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_TYPE,
  }),
});

export const recurringIntervalSchema = z.nativeEnum(RecurringIntervalEnum, {
  errorMap: () => ({
    message: TRANSACTION_ERROR_MESSAGES.INVALID_RECURRING_INTERVAL,
  }),
});

export const transactionCategorySchema = z.nativeEnum(TransactionCategoryEnum, {
  errorMap: () => ({
    message: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_CATEGORY,
  }),
});

const objectPayload = {
  required_error: TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
  invalid_type_error: TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
};

const amountSchema = z.coerce
  .number({
    invalid_type_error: TRANSACTION_ERROR_MESSAGES.INVALID_AMOUNT,
    required_error: TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
  })
  .positive({ message: TRANSACTION_ERROR_MESSAGES.INVALID_AMOUNT });

const dateSchema = z.coerce.date({
  errorMap: () => ({ message: TRANSACTION_ERROR_MESSAGES.INVALID_DATE }),
});

const descriptionSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return String(value);
}, z.string().optional());

const isRecurringSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .optional()
  .transform((value) => value === true || value === "true");

const recurringIntervalField = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return value;
}, recurringIntervalSchema.nullable());

const withRecurringRules = <T extends z.ZodTypeAny>(schema: T) =>
  schema
    .superRefine((data, ctx) => {
      if (data.isRecurring && !data.recurringInterval) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurringInterval"],
          message: TRANSACTION_ERROR_MESSAGES.INVALID_RECURRING_INTERVAL,
        });
      }
    })
    .transform((data) => ({
      ...data,
      recurringInterval: data.isRecurring ? data.recurringInterval : null,
    }));

const transactionWriteFields = {
  type: transactionTypeSchema,
  amount: amountSchema,
  description: descriptionSchema,
  date: dateSchema,
  category: transactionCategorySchema,
  isRecurring: isRecurringSchema,
  recurringInterval: recurringIntervalField,
};

export const createTransactionInputSchema = withRecurringRules(
  z.object(
    {
      ...transactionWriteFields,
      accountId: z
        .string()
        .trim()
        .min(1, TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS),
    },
    objectPayload,
  ),
);

export const updateTransactionInputSchema = withRecurringRules(
  z.object(transactionWriteFields, objectPayload),
);

export const deleteManyTransactionsSchema = z.object(
  {
    transactionIds: z
      .array(z.string().min(1), {
        invalid_type_error: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
        required_error: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
      })
      .nonempty(TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS),
  },
  {
    required_error: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
    invalid_type_error: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
  },
);

const optionalFilterValue = queryString.optional();

const dayOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

const invalidDateError = (path: "startDate" | "endDate"): z.ZodError =>
  new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      message: TRANSACTION_ERROR_MESSAGES.INVALID_DATE,
      path: [path],
    },
  ]);

const parseDayBoundary = (
  value: string,
  endOfDay: boolean,
  path: "startDate" | "endDate",
): Date => {
  const dayOnly = value.match(dayOnlyPattern);
  if (dayOnly) {
    const year = Number(dayOnly[1]);
    const month = Number(dayOnly[2]) - 1;
    const day = Number(dayOnly[3]);
    return endOfDay
      ? new Date(year, month, day, 23, 59, 59, 999)
      : new Date(year, month, day, 0, 0, 0, 0);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw invalidDateError(path);
  }

  return parsed;
};

const filterQueryFields = {
  category: optionalFilterValue,
  type: optionalFilterValue,
  isRecurring: optionalFilterValue,
  description: optionalFilterValue,
  accountId: optionalFilterValue,
  startDate: optionalFilterValue,
  endDate: optionalFilterValue,
};

const toListFilter = (query: {
  category?: string;
  type?: string;
  isRecurring?: string;
  description?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const startDate = query.startDate
    ? parseDayBoundary(query.startDate, false, "startDate")
    : undefined;
  const endDate = query.endDate
    ? parseDayBoundary(query.endDate, true, "endDate")
    : undefined;

  if (startDate && endDate && startDate > endDate) {
    throw new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        message: TRANSACTION_ERROR_MESSAGES.INVALID_DATE_RANGE,
        path: ["endDate"],
      },
    ]);
  }

  return {
    ...(query.category && query.category !== TRANSACTION_FILTER_ALL
      ? {
          category: transactionCategorySchema.parse(query.category),
        }
      : {}),
    ...(query.type && query.type !== TRANSACTION_FILTER_ALL
      ? {
          type: transactionTypeSchema.parse(query.type),
        }
      : {}),
    ...(query.isRecurring && query.isRecurring !== TRANSACTION_FILTER_ALL
      ? { isRecurring: query.isRecurring === "true" }
      : {}),
    ...(query.description ? { description: query.description } : {}),
    ...(query.accountId ? { accountId: query.accountId } : {}),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          },
        }
      : {}),
  };
};

export const filterQuerySchema = z
  .object({
    ...filterQueryFields,
    page: optionalFilterValue,
    limit: optionalFilterValue,
  })
  .transform((query) => {
    let page = Number(query.page ?? 1);
    let limit = Number(query.limit ?? 10);

    if (Number.isNaN(page) || page < 1) {
      page = 1;
    }

    if (Number.isNaN(limit) || limit < 1) {
      limit = 10;
    }

    return {
      filter: toListFilter(query),
      page,
      limit,
    };
  });

export const summaryQuerySchema = z
  .object(filterQueryFields)
  .transform((query) => toListFilter(query));

export const transactionIdParamSchema = routeParam(
  TRANSACTION_ERROR_MESSAGES.TRANSACTION_ID_REQUIRED,
);

export type TransactionType = `${LedgerEntryType}`;
export type RecurringInterval = `${RecurringIntervalEnum}`;
export type TransactionCategory = `${TransactionCategoryEnum}`;
export type CreateTransactionBody = z.infer<typeof createTransactionInputSchema>;
export type CreateTransactionInput = CreateTransactionBody & { userId: string };
export type UpdateTransactionInput = z.infer<typeof updateTransactionInputSchema>;
export type ParsedTransactionFilters = z.infer<typeof filterQuerySchema>;
export type ParsedTransactionSummaryFilter = z.infer<typeof summaryQuerySchema>;
