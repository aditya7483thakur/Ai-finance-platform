import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import {
  createUser,
  deleteUserById,
  findUserById,
  findUserByEmail,
  updateUserById,
} from "./user.repository.js";
import { type AuthUserPayload } from "./user.types.js";
import { ConflictError, NotFoundError } from "../../shared/types/errors.js";
import { USER_ERROR_MESSAGES } from "./user.constants.js";

const getNameFromAuthPayload = (firstName?: string, lastName?: string) => {
  return firstName ? `${firstName} ${lastName || ""}`.trim() : "Unknown User";
};

export const createAuthUserService = async (
  payload: AuthUserPayload,
): Promise<User> => {
  const email = payload.email;

  const existingById = await findUserById(payload.id);
  if (existingById) {
    throw new ConflictError(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS_WITH_ID);
  }

  const existingByEmail = await findUserByEmail(email);
  if (existingByEmail) {
    throw new ConflictError(USER_ERROR_MESSAGES.USER_ALREADY_EXISTS_WITH_EMAIL);
  }

  const placeholderPassword = await bcrypt.hash(`auth:${payload.id}`, 10);

  const newUser = await createUser({
    id: payload.id,
    email,
    name: getNameFromAuthPayload(
      payload.first_name || undefined,
      payload.last_name || undefined,
    ),
    imageUrl: payload.image_url || null,
    password: placeholderPassword,
  });

  return newUser;
};

export const updateAuthUserService = async (
  payload: AuthUserPayload,
): Promise<User> => {
  const email = payload.email;

  const existingUser = await findUserById(payload.id);
  if (!existingUser) {
    throw new NotFoundError(USER_ERROR_MESSAGES.USER_NOT_FOUND_IN_DATABASE);
  }

  const updatedUser = await updateUserById(payload.id, {
    email,
    name: getNameFromAuthPayload(
      payload.first_name || undefined,
      payload.last_name || undefined,
    ),
    imageUrl: payload.image_url || null,
  });

  return updatedUser;
};

export const deleteAuthUserService = async (userId: string): Promise<User> => {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new NotFoundError(USER_ERROR_MESSAGES.USER_NOT_FOUND_IN_DATABASE);
  }

  const deletedUser = await deleteUserById(userId);
  return deletedUser;
};

export const getAuthUserService = async (userId: string): Promise<User> => {
  const userData = await findUserById(userId);
  if (!userData) {
    throw new NotFoundError(USER_ERROR_MESSAGES.NO_USER_FOUND);
  }

  return userData;
};
