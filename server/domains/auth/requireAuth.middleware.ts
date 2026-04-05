import type { NextFunction, Response } from "express";
import { AUTH_ERROR_MESSAGES } from "./auth.constants.js";
import { verifyAccessToken } from "./auth.service.js";
import type { AuthenticatedRequest } from "./auth.types.js";

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: AUTH_ERROR_MESSAGES.UNAUTHORIZED_NO_TOKEN,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: AUTH_ERROR_MESSAGES.UNAUTHORIZED_TOKEN_EXPIRED });
    }

    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: AUTH_ERROR_MESSAGES.UNAUTHORIZED_INVALID_TOKEN });
    }

    console.error(AUTH_ERROR_MESSAGES.AUTH_MIDDLEWARE_FAILED, error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
