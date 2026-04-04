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
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../shared/types/errors.js";

const getNameFromAuthPayload = (firstName?: string, lastName?: string) => {
  return firstName ? `${firstName} ${lastName || ""}`.trim() : "Unknown User";
};

const getEmailFromPayload = (payload: AuthUserPayload) => {
  return payload.email_addresses[0]?.email_address;
};

const validateAuthPayload = (payload: AuthUserPayload | undefined): string => {
  if (!payload) {
    throw new BadRequestError("Missing user payload");
  }

  if (!payload.id) {
    throw new BadRequestError("User id is required");
  }

  const email = getEmailFromPayload(payload);
  if (!email) {
    throw new BadRequestError("At least one email is required");
  }

  return email;
};

export const createAuthUserService = async (
  payload: AuthUserPayload,
): Promise<User> => {
  const email = validateAuthPayload(payload);

  const existingById = await findUserById(payload.id);
  if (existingById) {
    throw new ConflictError("User already exists with this ID");
  }

  const existingByEmail = await findUserByEmail(email);
  if (existingByEmail) {
    throw new ConflictError("User already exists with this email");
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
  const email = validateAuthPayload(payload);

  const existingUser = await findUserById(payload.id);
  if (!existingUser) {
    throw new NotFoundError("User not found in database");
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

export const deleteAuthUserService = async (
  payload: AuthUserPayload,
): Promise<User> => {
  if (!payload?.id) {
    throw new BadRequestError("User id is required");
  }

  const existingUser = await findUserById(payload.id);
  if (!existingUser) {
    throw new NotFoundError("User not found in database");
  }

  const deletedUser = await deleteUserById(payload.id);
  return deletedUser;
};

export const getAuthUserService = async (userId: string): Promise<User> => {
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  const userData = await findUserById(userId);
  if (!userData) {
    throw new NotFoundError("No user found");
  }

  return userData;
};
