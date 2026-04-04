import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import {
  createAuthUserService,
  deleteAuthUserService,
  getAuthUserService,
  updateAuthUserService,
} from "./user.service.js";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  USER_ERROR_MESSAGES,
  USER_SUCCESS_MESSAGES,
} from "./user.constants.js";

const toPublicUser = (user: User): Omit<User, "password"> => {
  const { password, ...publicUser } = user;
  return publicUser;
};

export const createAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await createAuthUserService(req.body?.data);
    return res
      .status(201)
      .json({
        message: USER_SUCCESS_MESSAGES.USER_CREATED,
        data: toPublicUser(user),
      });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      USER_ERROR_MESSAGES.SAVE_USER_FAILED,
    );
  }
};

export const updateAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await updateAuthUserService(req.body?.data);
    return res
      .status(200)
      .json({
        message: USER_SUCCESS_MESSAGES.USER_UPDATED,
        data: toPublicUser(user),
      });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      USER_ERROR_MESSAGES.UPDATE_USER_FAILED,
    );
  }
};

export const deleteAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await deleteAuthUserService(req.body?.data);
    return res
      .status(200)
      .json({
        message: USER_SUCCESS_MESSAGES.USER_DELETED,
        data: toPublicUser(user),
      });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      USER_ERROR_MESSAGES.DELETE_USER_FAILED,
    );
  }
};

export const getAuthUser = async (req: Request, res: Response) => {
  try {
    const user = await getAuthUserService(req.params?.userId || "");
    return res
      .status(200)
      .json({
        message: USER_SUCCESS_MESSAGES.USER_FOUND,
        data: toPublicUser(user),
      });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      USER_ERROR_MESSAGES.FETCH_USER_FAILED,
    );
  }
};
