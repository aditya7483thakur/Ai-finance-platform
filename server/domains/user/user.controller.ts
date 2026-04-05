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
import {
  parseCreateAuthUserPayload,
  parseDeleteAuthUserPayload,
  parseUpdateAuthUserPayload,
  parseUserIdParam,
} from "./user.validators.js";

const toPublicUser = (user: User): Omit<User, "password"> => {
  const { password, ...publicUser } = user;
  return publicUser;
};

export const createAuthUser = async (req: Request, res: Response) => {
  try {
    const payload = parseCreateAuthUserPayload(req.body?.data);
    const user = await createAuthUserService(payload);
    return res.status(201).json({
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
    const payload = parseUpdateAuthUserPayload(req.body?.data);
    const user = await updateAuthUserService(payload);
    return res.status(200).json({
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
    const userId = parseDeleteAuthUserPayload(req.body?.data);
    const user = await deleteAuthUserService(userId);
    return res.status(200).json({
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

type GetAuthUserParams = {
  userId: string;
};

export const getAuthUser = async (
  req: Request<GetAuthUserParams>,
  res: Response,
) => {
  try {
    const userId = parseUserIdParam(req.params.userId);
    const user = await getAuthUserService(userId);
    return res.status(200).json({
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
