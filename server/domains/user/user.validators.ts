import { BadRequestError } from "../../shared/types/errors.js";
import { USER_ERROR_MESSAGES } from "./user.constants.js";
import type { AuthUserPayload } from "./user.types.js";

const parseAuthUserPayload = (payload: unknown): AuthUserPayload => {
  const data = payload as Record<string, unknown>;

  if (!data || typeof data !== "object") {
    throw new BadRequestError(USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD);
  }

  const id = data.id;
  const email = data.email;

  if (typeof id !== "string" || !id) {
    throw new BadRequestError(USER_ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  if (typeof email !== "string" || !email) {
    throw new BadRequestError(USER_ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  return {
    id,
    email,
    first_name:
      typeof data.first_name === "string" || data.first_name === null
        ? data.first_name
        : undefined,
    last_name:
      typeof data.last_name === "string" || data.last_name === null
        ? data.last_name
        : undefined,
    image_url:
      typeof data.image_url === "string" || data.image_url === null
        ? data.image_url
        : undefined,
  };
};

export const parseCreateAuthUserPayload = (
  payload: unknown,
): AuthUserPayload => {
  return parseAuthUserPayload(payload);
};

export const parseUpdateAuthUserPayload = (
  payload: unknown,
): AuthUserPayload => {
  return parseAuthUserPayload(payload);
};

export const parseDeleteAuthUserPayload = (payload: unknown): string => {
  const data = payload as Record<string, unknown>;
  const id = data?.id;

  if (typeof id !== "string" || !id) {
    throw new BadRequestError(USER_ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  return id;
};

export const parseUserIdParam = (
  userId: string | string[] | undefined,
): string => {
  const parsedId = Array.isArray(userId) ? userId[0] : userId;
  if (!parsedId) {
    throw new BadRequestError(USER_ERROR_MESSAGES.USER_ID_REQUIRED_CAPITALIZED);
  }
  return parsedId;
};
