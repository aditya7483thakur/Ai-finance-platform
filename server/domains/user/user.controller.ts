import type { Request, Response } from "express";
import { userService } from "./user.service.js";
import type { User } from "./user.types.js";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  USER_ERROR_MESSAGES,
  USER_SUCCESS_MESSAGES,
} from "./user.constants.js";
import {
  authUserPayloadSchema,
  deleteAuthUserSchema,
  userIdParamSchema,
} from "./user.validators.js";

const toPublicUser = (user: User): Omit<User, "password"> => {
  const { password, ...publicUser } = user;
  return publicUser;
};

export const createAuthUser = async (req: Request, res: Response) => {
  try {
    const payload = authUserPayloadSchema.parse(req.body?.data);
    const user = await userService.createAuthUser(payload);
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
    const payload = authUserPayloadSchema.parse(req.body?.data);
    const user = await userService.updateAuthUser(payload);
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
    const userId = deleteAuthUserSchema.parse(req.body?.data).id;
    const user = await userService.deleteAuthUser(userId);
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
    const userId = userIdParamSchema.parse(req.params.userId);
    const user = await userService.getAuthUser(userId);
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
