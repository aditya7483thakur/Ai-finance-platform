import type { Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  ACCOUNT_ERROR_MESSAGES,
  ACCOUNT_SUCCESS_MESSAGES,
} from "./account.constants.js";
import { accountService } from "../../composition.js";
import {
  accountIdParamSchema,
  createAccountInputSchema,
  updateAccountInputSchema,
} from "./account.validators.js";
import type { AuthenticatedRequest } from "../user/user.types.js";
import { requireUserId } from "../user/requireUserId.js";

export const createAccount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const body = createAccountInputSchema.parse(req.body);
    const account = await accountService.create({ ...body, userId });

    return res.status(201).json({
      message: ACCOUNT_SUCCESS_MESSAGES.ACCOUNT_CREATED,
      data: account,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      ACCOUNT_ERROR_MESSAGES.CREATE_ACCOUNT_FAILED,
    );
  }
};

export const getSingleAccount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const accountId = accountIdParamSchema.parse(req.params.accountId);
    const account = await accountService.getSingle(accountId, userId);

    return res.status(200).json({
      message: ACCOUNT_SUCCESS_MESSAGES.ACCOUNT_FETCHED,
      data: account,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      ACCOUNT_ERROR_MESSAGES.FETCH_ACCOUNT_FAILED,
    );
  }
};

export const getAllAccounts = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const accounts = await accountService.getAll(userId);

    return res.status(200).json({
      message: ACCOUNT_SUCCESS_MESSAGES.ACCOUNTS_FETCHED,
      data: accounts,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      ACCOUNT_ERROR_MESSAGES.FETCH_ACCOUNTS_FAILED,
    );
  }
};

export const updateAccount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const input = updateAccountInputSchema.parse(req.body);
    const account = await accountService.update(input, userId);

    return res.status(200).json({
      message: ACCOUNT_SUCCESS_MESSAGES.ACCOUNT_UPDATED,
      data: account,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      ACCOUNT_ERROR_MESSAGES.UPDATE_ACCOUNT_FAILED,
    );
  }
};

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const accountId = accountIdParamSchema.parse(req.params.id);
    await accountService.delete(accountId, userId);

    return res.status(200).json({
      message: ACCOUNT_SUCCESS_MESSAGES.ACCOUNT_DELETED,
      data: { deleted: true },
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      ACCOUNT_ERROR_MESSAGES.DELETE_ACCOUNT_FAILED,
    );
  }
};
