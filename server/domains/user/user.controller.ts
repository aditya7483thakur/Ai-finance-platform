import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import {
  createAuthUserService,
  deleteAuthUserService,
  getAuthUserService,
  updateAuthUserService,
} from "./user.service.js";
import { DomainError } from "../../shared/types/errors.js";

const handleControllerError = (
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

const toPublicUser = (user: User): Omit<User, "password"> => {
  const { password, ...publicUser } = user;
  return publicUser;
};

export const createAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await createAuthUserService(req.body?.data);
    return res
      .status(201)
      .json({ message: "User created successfully", data: toPublicUser(user) });
  } catch (error) {
    return handleControllerError(res, error, "Error saving user:");
  }
};

export const updateAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await updateAuthUserService(req.body?.data);
    return res
      .status(200)
      .json({ message: "User updated successfully", data: toPublicUser(user) });
  } catch (error) {
    return handleControllerError(res, error, "Error updating user:");
  }
};

export const deleteAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await deleteAuthUserService(req.body?.data);
    return res
      .status(200)
      .json({ message: "User deleted successfully", data: toPublicUser(user) });
  } catch (error) {
    return handleControllerError(res, error, "Error deleting user:");
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await getAuthUserService(req.params?.userId || "");
    return res
      .status(200)
      .json({ message: "User found", data: toPublicUser(user) });
  } catch (error) {
    return handleControllerError(res, error, "Error fetching user:");
  }
};
