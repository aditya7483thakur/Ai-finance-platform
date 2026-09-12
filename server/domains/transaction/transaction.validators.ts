import { z } from "zod";
import {
  parseWithZod,
  queryString,
  routeParam,
} from "../../shared/utils/parseWithZod.js";
import { TRANSACTION_ERROR_MESSAGES } from "./transaction.constants.js";

export const transactionTypeSchema = z.enum(["INCOME", "EXPENSE"], {
  errorMap: () => ({
    message: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_TYPE,
  }),
});

export const recurringIntervalSchema = z.enum(
  ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
  {
    errorMap: () => ({
      message: TRANSACTION_ERROR_MESSAGES.INVALID_RECURRING_INTERVAL,
    }),
  },
);

export const transactionCategorySchema = z.enum(
  [
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
  ],
  {
    errorMap: () => ({
      message: TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_CATEGORY,
    }),
  },
);

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
      userId: z
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

const deleteManySchema = z.object(
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

const filterQuerySchema = z
  .object({
    category: optionalFilterValue,
    type: optionalFilterValue,
    isRecurring: optionalFilterValue,
    description: optionalFilterValue,
    accountId: optionalFilterValue,
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
      filter: {
        ...(query.category && query.category !== "ALL"
          ? {
              category: parseWithZod<TransactionCategory>(
                transactionCategorySchema,
                query.category,
                TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_CATEGORY,
              ),
            }
          : {}),
        ...(query.type && query.type !== "ALL"
          ? {
              type: parseWithZod<TransactionType>(
                transactionTypeSchema,
                query.type,
                TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_TYPE,
              ),
            }
          : {}),
        ...(query.isRecurring && query.isRecurring !== "ALL"
          ? { isRecurring: query.isRecurring === "true" }
          : {}),
        ...(query.description ? { description: query.description } : {}),
        ...(query.accountId ? { accountId: query.accountId } : {}),
      },
      page,
      limit,
    };
  });

const transactionIdParamSchema = routeParam(
  TRANSACTION_ERROR_MESSAGES.TRANSACTION_ID_REQUIRED,
);

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type RecurringInterval = z.infer<typeof recurringIntervalSchema>;
export type TransactionCategory = z.infer<typeof transactionCategorySchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionInputSchema>;
export type ParsedTransactionFilters = z.infer<typeof filterQuerySchema>;

export const parseTransactionIdParam = (
  value: string | string[] | undefined,
): string => {
  return parseWithZod<string>(
    transactionIdParamSchema,
    value,
    TRANSACTION_ERROR_MESSAGES.TRANSACTION_ID_REQUIRED,
  );
};

export const parseCreateTransactionPayload = (
  payload: unknown,
): CreateTransactionInput => {
  return parseWithZod<CreateTransactionInput>(
    createTransactionInputSchema,
    payload,
    TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
  );
};

export const parseUpdateTransactionPayload = (
  payload: unknown,
): UpdateTransactionInput => {
  return parseWithZod<UpdateTransactionInput>(
    updateTransactionInputSchema,
    payload,
    TRANSACTION_ERROR_MESSAGES.MISSING_REQUIRED_FIELDS,
  );
};

export const parseDeleteManyPayload = (payload: unknown): string[] => {
  return parseWithZod<{ transactionIds: string[] }>(
    deleteManySchema,
    payload,
    TRANSACTION_ERROR_MESSAGES.INVALID_TRANSACTION_IDS,
  ).transactionIds;
};

export const parseFilterQuery = (query: unknown): ParsedTransactionFilters => {
  return parseWithZod<ParsedTransactionFilters>(
    filterQuerySchema,
    query,
    TRANSACTION_ERROR_MESSAGES.FETCH_FILTERED_TRANSACTIONS_FAILED,
  );
};
