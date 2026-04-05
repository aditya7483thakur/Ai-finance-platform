import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
} from "./auth.constants.js";
import {
  getUserProfileService,
  signinUserService,
  signupUserService,
} from "./auth.service.js";
import type { AuthenticatedRequest } from "./auth.types.js";
import {
  parseAuthenticatedUserId,
  parseSigninInput,
  parseSignupInput,
} from "./auth.validators.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const input = parseSignupInput(req.body);
    const data = await signupUserService(input);
    return res.status(201).json({
      message: AUTH_SUCCESS_MESSAGES.USER_CREATED,
      data,
    });
  } catch (error) {
    return handleControllerError(res, error, AUTH_ERROR_MESSAGES.SIGNUP_FAILED);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const input = parseSigninInput(req.body);
    const data = await signinUserService(input);
    return res.status(200).json({
      message: AUTH_SUCCESS_MESSAGES.SIGNIN_SUCCESSFUL,
      data,
    });
  } catch (error) {
    return handleControllerError(res, error, AUTH_ERROR_MESSAGES.SIGNIN_FAILED);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseAuthenticatedUserId(req.userId);
    const user = await getUserProfileService(userId);
    return res.status(200).json({
      message: AUTH_SUCCESS_MESSAGES.USER_FETCHED,
      data: { user },
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      AUTH_ERROR_MESSAGES.FETCH_USER_FAILED,
    );
  }
};
