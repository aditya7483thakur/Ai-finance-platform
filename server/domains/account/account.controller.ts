import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  ACCOUNT_ERROR_MESSAGES,
  ACCOUNT_SUCCESS_MESSAGES,
} from "./account.constants.js";
import {
  createAccountService,
  deleteAccountService,
  getAllAccountsService,
  getSingleAccountService,
  updateAccountService,
} from "./account.service.js";
import {
  parseAccountIdParam,
  parseCreateAccountPayload,
  parseDeleteAccountIdParam,
  parseUpdateAccountPayload,
  parseUserIdParam,
} from "./account.validators.js";

export const createAccount = async (req: Request, res: Response) => {
  try {
    const input = parseCreateAccountPayload(req.body);
    const account = await createAccountService(input);

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

export const getSingleAccount = async (req: Request, res: Response) => {
  try {
    const accountId = parseAccountIdParam(req.params.accountId);
    const account = await getSingleAccountService(accountId);

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

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const userId = parseUserIdParam(req.params.userId);
    const accounts = await getAllAccountsService(userId);

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

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const input = parseUpdateAccountPayload(req.body);
    const account = await updateAccountService(input);

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

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const accountId = parseDeleteAccountIdParam(req.params.id);
    await deleteAccountService(accountId);

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
