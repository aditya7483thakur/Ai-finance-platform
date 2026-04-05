import { BadRequestError } from "../../shared/types/errors.js";
import { ACCOUNT_ERROR_MESSAGES } from "./account.constants.js";
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "./account.types.js";

const parsePayloadObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object") {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD);
  }

  return payload as Record<string, unknown>;
};

const parseNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const parseNumericValue = (
  value: unknown,
  errorMessage: string,
): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    throw new BadRequestError(errorMessage);
  }

  return numericValue;
};

const parseAccountId = (value: string | string[] | undefined): string => {
  const accountId = Array.isArray(value) ? value[0] : value;

  if (!accountId) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED);
  }

  return accountId;
};

const parseUserId = (value: string | string[] | undefined): string => {
  const userId = Array.isArray(value) ? value[0] : value;

  if (!userId) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  return userId;
};

export const parseCreateAccountPayload = (
  payload: unknown,
): CreateAccountInput => {
  const data = parsePayloadObject(payload);

  const userId = parseNonEmptyString(data.userId);
  const name = parseNonEmptyString(data.name);
  const balance =
    parseNumericValue(data.balance, ACCOUNT_ERROR_MESSAGES.INVALID_BALANCE) ??
    0;
  const parsedBudget = parseNumericValue(
    data.budget,
    ACCOUNT_ERROR_MESSAGES.INVALID_BUDGET,
  );

  if (!userId) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  if (!name) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NAME_REQUIRED);
  }

  return {
    userId,
    name,
    balance,
    budget: parsedBudget ?? null,
  };
};

export const parseUpdateAccountPayload = (
  payload: unknown,
): UpdateAccountInput => {
  const data = parsePayloadObject(payload);

  const id = parseNonEmptyString(data.id);
  const name = parseNonEmptyString(data.name);
  let budget: number | null | undefined;

  if (Object.prototype.hasOwnProperty.call(data, "budget")) {
    budget =
      data.budget === null
        ? null
        : parseNumericValue(data.budget, ACCOUNT_ERROR_MESSAGES.INVALID_BUDGET);
  }

  if (!id) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_ID_REQUIRED);
  }

  if (name === undefined && budget === undefined) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.UPDATE_FIELDS_REQUIRED);
  }

  return {
    id,
    ...(name !== undefined ? { name } : {}),
    ...(budget !== undefined ? { budget } : {}),
  };
};

export const parseAccountIdParam = (
  accountId: string | string[] | undefined,
): string => {
  return parseAccountId(accountId);
};

export const parseDeleteAccountIdParam = (
  accountId: string | string[] | undefined,
): string => {
  return parseAccountId(accountId);
};

export const parseUserIdParam = (
  userId: string | string[] | undefined,
): string => {
  return parseUserId(userId);
};
