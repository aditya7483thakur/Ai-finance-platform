import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../shared/types/errors.js";
import { AUTH_ERROR_MESSAGES } from "./auth.constants.js";
import type { AccessTokenPayload, PublicAuthUser } from "./auth.types.js";

export const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(AUTH_ERROR_MESSAGES.JWT_SECRET_NOT_CONFIGURED);
  }

  return jwtSecret;
};

export const toPublicUser = (passwordUser: User): PublicAuthUser => {
  const { password, ...publicUser } = passwordUser;
  return publicUser;
};

export const signToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const verifyAccessTokenPayload = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;

  if (
    !decoded ||
    typeof decoded !== "object" ||
    typeof decoded.userId !== "string" ||
    typeof decoded.email !== "string"
  ) {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.UNAUTHORIZED_INVALID_TOKEN);
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
  };
};
