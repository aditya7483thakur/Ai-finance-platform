import { z } from "zod";

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
