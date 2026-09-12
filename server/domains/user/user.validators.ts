import { z } from "zod";
import { routeParam } from "../../shared/utils/parseWithZod.js";
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

export const deleteAuthUserSchema = z.object(
  {
    id: z.string().trim().min(1, USER_ERROR_MESSAGES.USER_ID_REQUIRED),
  },
  {
    required_error: USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
    invalid_type_error: USER_ERROR_MESSAGES.MISSING_USER_PAYLOAD,
  },
);

export const userIdParamSchema = routeParam(
  USER_ERROR_MESSAGES.USER_ID_REQUIRED_CAPITALIZED,
);

export type AuthUserPayload = z.infer<typeof authUserPayloadSchema>;
