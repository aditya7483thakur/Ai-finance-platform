import { z } from "zod";
import { BadRequestError } from "../types/errors.js";

export const parseWithZod = <T>(
  schema: z.ZodTypeAny,
  payload: unknown,
  fallbackMessage: string,
): T => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new BadRequestError(
      result.error.issues[0]?.message ?? fallbackMessage,
    );
  }

  return result.data as T;
};

export const queryString = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => (Array.isArray(value) ? value[0] : value));

export const requiredQueryString = (message: string) =>
  queryString.pipe(z.string().trim().min(1, { message }));

export const routeParam = (message: string) =>
  z.preprocess(
    (value) => (Array.isArray(value) ? value[0] : value),
    z
      .string({ required_error: message, invalid_type_error: message })
      .trim()
      .min(1, { message }),
  );
