import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import { userService } from "../../composition.js";
import {
  USER_ERROR_MESSAGES,
  USER_SUCCESS_MESSAGES,
} from "./user.constants.js";
import type { AuthenticatedRequest } from "./user.types.js";
import {
  authenticatedUserIdSchema,
  signinInputSchema,
  signupInputSchema,
} from "./user.validators.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const input = signupInputSchema.parse(req.body);
    const data = await userService.signup(input);
    return res.status(201).json({
      message: USER_SUCCESS_MESSAGES.USER_CREATED,
      data,
    });
  } catch (error) {
    return handleControllerError(res, error, USER_ERROR_MESSAGES.SIGNUP_FAILED);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const input = signinInputSchema.parse(req.body);
    const data = await userService.signin(input);
    return res.status(200).json({
      message: USER_SUCCESS_MESSAGES.SIGNIN_SUCCESSFUL,
      data,
    });
  } catch (error) {
    return handleControllerError(res, error, USER_ERROR_MESSAGES.SIGNIN_FAILED);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = authenticatedUserIdSchema.parse(req.userId);
    const user = await userService.getUserProfile(userId);
    return res.status(200).json({
      message: USER_SUCCESS_MESSAGES.USER_FETCHED,
      data: { user },
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      USER_ERROR_MESSAGES.FETCH_USER_FAILED,
    );
  }
};
