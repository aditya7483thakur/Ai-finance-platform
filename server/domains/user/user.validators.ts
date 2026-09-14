import { z } from "zod";
import { USER_ERROR_MESSAGES } from "./user.constants.js";

const objectPayload = {
  required_error: USER_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
  invalid_type_error: USER_ERROR_MESSAGES.INVALID_REQUEST_PAYLOAD,
};

export const signupInputSchema = z.object(
  {
    name: z
      .string()
      .trim()
      .min(1, USER_ERROR_MESSAGES.NAME_EMAIL_PASSWORD_REQUIRED),
    email: z
      .string()
      .trim()
      .min(1, USER_ERROR_MESSAGES.NAME_EMAIL_PASSWORD_REQUIRED),
    password: z
      .string()
      .trim()
      .min(1, USER_ERROR_MESSAGES.NAME_EMAIL_PASSWORD_REQUIRED),
  },
  objectPayload,
);

export const signinInputSchema = z.object(
  {
    email: z
      .string()
      .trim()
      .min(1, USER_ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED),
    password: z
      .string()
      .trim()
      .min(1, USER_ERROR_MESSAGES.EMAIL_PASSWORD_REQUIRED),
  },
  objectPayload,
);

export const authenticatedUserIdSchema = z
  .string({
    required_error: USER_ERROR_MESSAGES.USER_ID_REQUIRED,
    invalid_type_error: USER_ERROR_MESSAGES.USER_ID_REQUIRED,
  })
  .trim()
  .min(1, USER_ERROR_MESSAGES.USER_ID_REQUIRED);

export type SignupInput = z.infer<typeof signupInputSchema>;
export type SigninInput = z.infer<typeof signinInputSchema>;
