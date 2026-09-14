import jwt from "jsonwebtoken";
import { BadRequestError } from "../../shared/types/errors.js";
import { USER_ERROR_MESSAGES } from "./user.constants.js";
import type { AccessTokenPayload, PublicUser, User } from "./user.types.js";

export const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error(USER_ERROR_MESSAGES.JWT_SECRET_NOT_CONFIGURED);
  }

  return jwtSecret;
};

export const toPublicUser = (passwordUser: User): PublicUser => {
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
    throw new BadRequestError(USER_ERROR_MESSAGES.UNAUTHORIZED_INVALID_TOKEN);
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
  };
};
