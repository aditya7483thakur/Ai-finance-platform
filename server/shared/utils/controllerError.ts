import type { Response } from "express";
import { ZodError } from "zod";
import { DomainError } from "../types/errors.js";

export const handleControllerError = (
  res: Response,
  error: unknown,
  message: string,
) => {
  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: error.issues[0]?.message ?? "Invalid request payload",
    });
  }

  console.error(message, error);
  return res.status(500).json({ error: "Internal server error" });
};
