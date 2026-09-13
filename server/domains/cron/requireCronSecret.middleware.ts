import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import {
  CRON_ERROR_MESSAGES,
  CRON_SECRET_HEADER,
} from "./cron.constants.js";

const secretsEqual = (provided: string, expected: string): boolean => {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
};

export const requireCronSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return res.status(500).json({
      error: CRON_ERROR_MESSAGES.SECRET_NOT_CONFIGURED,
    });
  }

  const header = req.headers[CRON_SECRET_HEADER];
  const provided = Array.isArray(header) ? header[0] : header;

  if (!provided || !secretsEqual(provided, expected)) {
    return res.status(401).json({
      error: CRON_ERROR_MESSAGES.UNAUTHORIZED,
    });
  }

  next();
};
