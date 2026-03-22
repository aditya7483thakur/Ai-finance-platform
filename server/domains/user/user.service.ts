import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import {
  createUser,
  deleteUserByClerkId,
  findUserByClerkId,
  findUserByEmail,
  updateUserByClerkId,
} from "./user.repository.js";
import {
  BadRequestError,
  ConflictError,
  type ClerkUserPayload,
  NotFoundError,
} from "./user.types.js";

const getNameFromClerkPayload = (firstName?: string, lastName?: string) => {
  return firstName ? `${firstName} ${lastName || ""}`.trim() : "Unknown User";
};

const getEmailFromPayload = (payload: ClerkUserPayload) => {
  return payload.email_addresses[0]?.email_address;
};

const validateClerkPayload = (
  payload: ClerkUserPayload | undefined,
): string => {
  if (!payload) {
    throw new BadRequestError("Missing Clerk payload");
  }

  if (!payload.id) {
    throw new BadRequestError("Clerk user id is required");
  }

  const email = getEmailFromPayload(payload);
  if (!email) {
    throw new BadRequestError("At least one email is required");
  }

  return email;
};

export const createClerkUserService = async (
  payload: ClerkUserPayload,
): Promise<User> => {
  const email = validateClerkPayload(payload);

  const existingById = await findUserByClerkId(payload.id);
  if (existingById) {
    throw new ConflictError("User already exists with this Clerk ID");
  }

  const existingByEmail = await findUserByEmail(email);
  if (existingByEmail) {
    throw new ConflictError("User already exists with this email");
  }

  const placeholderPassword = await bcrypt.hash(`clerk:${payload.id}`, 10);

  const newUser = await createUser({
    id: payload.id,
    email,
    name: getNameFromClerkPayload(
      payload.first_name || undefined,
      payload.last_name || undefined,
    ),
    imageUrl: payload.image_url || null,
    password: placeholderPassword,
  });

  return newUser;
};

export const updateClerkUserService = async (
  payload: ClerkUserPayload,
): Promise<User> => {
  const email = validateClerkPayload(payload);

  const existingUser = await findUserByClerkId(payload.id);
  if (!existingUser) {
    throw new NotFoundError("User not found in database");
  }

  const updatedUser = await updateUserByClerkId(payload.id, {
    email,
    name: getNameFromClerkPayload(
      payload.first_name || undefined,
      payload.last_name || undefined,
    ),
    imageUrl: payload.image_url || null,
  });

  return updatedUser;
};

export const deleteClerkUserService = async (
  payload: ClerkUserPayload,
): Promise<User> => {
  if (!payload?.id) {
    throw new BadRequestError("Clerk user id is required");
  }

  const existingUser = await findUserByClerkId(payload.id);
  if (!existingUser) {
    throw new NotFoundError("User not found in database");
  }

  const deletedUser = await deleteUserByClerkId(payload.id);
  return deletedUser;
};

export const getClerkUserService = async (
  clerkUserId: string,
): Promise<User> => {
  if (!clerkUserId) {
    throw new BadRequestError("User ID is required");
  }

  const userData = await findUserByClerkId(clerkUserId);
  if (!userData) {
    throw new NotFoundError("No user found");
  }

  return userData;
};
