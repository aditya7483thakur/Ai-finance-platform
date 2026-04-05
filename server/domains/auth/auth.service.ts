import bcrypt from "bcrypt";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../shared/types/errors.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "./auth.repository.js";
import { AUTH_ERROR_MESSAGES } from "./auth.constants.js";
import type {
  AccessTokenPayload,
  AuthSessionData,
  PublicAuthUser,
  SigninInput,
  SignupInput,
} from "./auth.types.js";
import {
  signToken,
  toPublicUser,
  verifyAccessTokenPayload,
} from "./auth.helper.js";

const SALT_ROUNDS = 10;

export const signupUserService = async (
  input: SignupInput,
): Promise<AuthSessionData> => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new ConflictError(AUTH_ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const newUser = await createUser({ ...input, password: hashedPassword });
  const token = signToken({ userId: newUser.id, email: newUser.email });
  const user = toPublicUser(newUser);

  return { user, token };
};

export const signinUserService = async (
  input: SigninInput,
): Promise<AuthSessionData> => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new BadRequestError(AUTH_ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
  }

  const token = signToken({ userId: user.id, email: user.email });
  const publicUser = toPublicUser(user);

  return { user: publicUser, token };
};

export const getUserProfileService = async (
  userId: string,
): Promise<PublicAuthUser> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return toPublicUser(user);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return verifyAccessTokenPayload(token);
};
