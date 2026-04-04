import type { Response } from "express";
import { DomainError } from "../types/errors.js";

export const handleControllerError = (
  res: Response,
  error: unknown,
  message: string,
) => {
  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error(message, error);
  return res.status(500).json({ error: "Internal server error" });
};
