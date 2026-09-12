import { z } from "zod";
import { routeParam } from "../../shared/utils/parseWithZod.js";
import { ACCOUNT_ERROR_MESSAGES } from "./account.constants.js";

const objectPayload = {
  required_error: ACCOUNT_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
  invalid_type_error: ACCOUNT_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
};

const optionalFiniteNumber = (message: string) =>
  z.preprocess((value) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? value : numericValue;
  }, z.number({ invalid_type_error: message }).finite({ message }).optional());

const nullableFiniteNumber = (message: string) =>
  z.preprocess((value) => {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === "string" && value.trim() === "") {
      return null;
    }

    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? value : numericValue;
  }, z.union([z.null(), z.number({ invalid_type_error: message }).finite({ message })]));

export const createAccountInputSchema = z.object(
  {
    userId: z
      .string()
      .trim()
      .min(1, ACCOUNT_ERROR_MESSAGES.USER_ID_REQUIRED),
    name: z
      .string()
      .trim()
      .min(1, ACCOUNT_ERROR_MESSAGES.ACCOUNT_NAME_REQUIRED),
    balance: optionalFiniteNumber(ACCOUNT_ERROR_MESSAGES.INVALID_BALANCE),
    budget: nullableFiniteNumber(ACCOUNT_ERROR_MESSAGES.INVALID_BUDGET),
  },
  objectPayload,
).transform((data) => ({
  userId: data.userId,
  name: data.name,
  balance: data.balance ?? 0,
  budget: data.budget ?? null,
}));

export const updateAccountInputSchema = z
  .object(
    {
      id: z.string().trim().min(1, ACCOUNT_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED),
      name: z
        .string()
        .trim()
        .min(1, ACCOUNT_ERROR_MESSAGES.ACCOUNT_NAME_REQUIRED)
        .optional(),
      budget: z
        .union([
          z.null(),
          optionalFiniteNumber(ACCOUNT_ERROR_MESSAGES.INVALID_BUDGET),
        ])
        .optional(),
    },
    objectPayload,
  )
  .refine(
    (data) => data.name !== undefined || data.budget !== undefined,
    ACCOUNT_ERROR_MESSAGES.UPDATE_FIELDS_REQUIRED,
  );

export const accountIdParamSchema = routeParam(
  ACCOUNT_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED,
);
export const userIdParamSchema = routeParam(ACCOUNT_ERROR_MESSAGES.USER_ID_REQUIRED);

export type CreateAccountInput = z.infer<typeof createAccountInputSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountInputSchema>;
