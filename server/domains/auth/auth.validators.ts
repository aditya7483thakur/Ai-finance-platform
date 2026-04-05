import { BadRequestError } from "../../shared/types/errors.js";
import { AUTH_ERROR_MESSAGES } from "./auth.constants.js";
import type { SigninInput, SignupInput } from "./auth.types.js";

const parsePayloadObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object") {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD);
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

export const parseSignupInput = (payload: unknown): SignupInput => {
  const data = parsePayloadObject(payload);
  const name = parseNonEmptyString(data.name);
  const email = parseNonEmptyString(data.email);
  const password = parseNonEmptyString(data.password);

  if (!name || !email || !password) {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.NAME_EMAIL_PASSWORD_REQUIRED);
  }

  return {
    name,
    email,
    password,
  };
};

export const parseSigninInput = (payload: unknown): SigninInput => {
  const data = parsePayloadObject(payload);
  const email = parseNonEmptyString(data.email);
  const password = parseNonEmptyString(data.password);

  if (!email || !password) {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED);
  }

  return {
    email,
    password,
  };
};

export const parseAuthenticatedUserId = (userId: unknown): string => {
  const parsedUserId = parseNonEmptyString(userId);

  if (!parsedUserId) {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  return parsedUserId;
};
