import { z } from "zod";
import {
  parseWithZod,
  routeParam,
} from "../../shared/utils/parseWithZod.js";
import { USER_ERROR_MESSAGES } from "./user.constants.js";

const nullableString = z.union([z.string(), z.null()]).optional();

export const authUserPayloadSchema = z.object(
  {
    id: z.string().trim().min(1, USER_ERROR_MESSAGES.USER_ID_REQUIRED),
    email: z.string().trim().min(1, USER_ERROR_MESSAGES.EMAIL_REQUIRED),
    first_name: nullableString,
    last_name: nullableString,
    image_url: nullableString,
  },
  {
    required_error: USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
    invalid_type_error: USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
  },
);

const deleteAuthUserSchema = z.object(
  {
    id: z.string().trim().min(1, USER_ERROR_MESSAGES.USER_ID_REQUIRED),
  },
  {
    required_error: USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
    invalid_type_error: USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
  },
);

const userIdParamSchema = routeParam(
  USER_ERROR_MESSAGES.USER_ID_REQUIRED_CAPITALIZED,
);

export type AuthUserPayload = z.infer<typeof authUserPayloadSchema>;

export const parseCreateAuthUserPayload = (
  payload: unknown,
): AuthUserPayload => {
  return parseWithZod<AuthUserPayload>(
    authUserPayloadSchema,
    payload,
    USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
  );
};

export const parseUpdateAuthUserPayload = (
  payload: unknown,
): AuthUserPayload => {
  return parseWithZod<AuthUserPayload>(
    authUserPayloadSchema,
    payload,
    USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
  );
};

export const parseDeleteAuthUserPayload = (payload: unknown): string => {
  return parseWithZod<{ id: string }>(
    deleteAuthUserSchema,
    payload,
    USER_ERROR_MESSAGES.USER_ID_REQUIRED,
  ).id;
};

export const parseUserIdParam = (
  userId: string | string[] | undefined,
): string => {
  return parseWithZod<string>(
    userIdParamSchema,
    userId,
    USER_ERROR_MESSAGES.USER_ID_REQUIRED_CAPITALIZED,
  );
};
