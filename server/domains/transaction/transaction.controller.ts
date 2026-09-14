import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  TRANSACTION_ERROR_MESSAGES,
  TRANSACTION_SUCCESS_MESSAGES,
} from "./transaction.constants.js";
import { transactionService } from "../../composition.js";
import { BadRequestError } from "../../shared/types/errors.js";
import {
  createTransactionInputSchema,
  deleteManyTransactionsSchema,
  filterQuerySchema,
  transactionIdParamSchema,
  updateTransactionInputSchema,
} from "./transaction.validators.js";
import type { AuthenticatedRequest } from "../user/user.types.js";
import { requireUserId } from "../user/requireUserId.js";

type ReceiptRequest = Request & {
  file?: Express.Multer.File;
};

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const body = createTransactionInputSchema.parse(req.body);
    const transaction = await transactionService.create({ ...body, userId });
    return res.status(201).json({
      message: TRANSACTION_SUCCESS_MESSAGES.TRANSACTION_CREATED,
      data: transaction,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      TRANSACTION_ERROR_MESSAGES.CREATE_TRANSACTION_FAILED,
    );
  }
};

export const editTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const transactionId = transactionIdParamSchema.parse(req.params.transactionId);
    const input = updateTransactionInputSchema.parse(req.body);
    const transaction = await transactionService.update(
      transactionId,
      input,
      userId,
    );

    return res.status(200).json({
      message: TRANSACTION_SUCCESS_MESSAGES.TRANSACTION_UPDATED,
      data: transaction,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      TRANSACTION_ERROR_MESSAGES.UPDATE_TRANSACTION_FAILED,
    );
  }
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const transactionId = transactionIdParamSchema.parse(req.params.transactionId);
    await transactionService.delete(transactionId, userId);

    return res.status(200).json({
      message: TRANSACTION_SUCCESS_MESSAGES.TRANSACTION_DELETED,
      data: { deleted: true },
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      TRANSACTION_ERROR_MESSAGES.DELETE_TRANSACTION_FAILED,
    );
  }
};

export const deleteMultipleTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const { transactionIds } = deleteManyTransactionsSchema.parse(req.body);
    const deletedCount = await transactionService.deleteMany(
      transactionIds,
      userId,
    );

    return res.status(200).json({
      message: TRANSACTION_SUCCESS_MESSAGES.TRANSACTIONS_DELETED,
      data: { deletedCount },
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      TRANSACTION_ERROR_MESSAGES.DELETE_MULTIPLE_TRANSACTIONS_FAILED,
    );
  }
};

export const getFilteredTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const filters = filterQuerySchema.parse(req.query);
    const result = await transactionService.getFiltered(filters, userId);

    return res.status(200).json({
      message: TRANSACTION_SUCCESS_MESSAGES.TRANSACTIONS_FILTERED,
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      TRANSACTION_ERROR_MESSAGES.FETCH_FILTERED_TRANSACTIONS_FAILED,
    );
  }
};

export const AiFormReceipt = async (req: Request, res: Response) => {
  try {
    const receiptReq = req as ReceiptRequest;
    if (!receiptReq.file) {
      throw new BadRequestError(
        TRANSACTION_ERROR_MESSAGES.RECEIPT_FILE_REQUIRED,
      );
    }

    const parsedReceipt = await transactionService.aiFormReceipt(
      receiptReq.file.path,
      receiptReq.file.mimetype,
    );

    return res.status(200).json({
      message: TRANSACTION_SUCCESS_MESSAGES.RECEIPT_PARSED,
      data: parsedReceipt,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      TRANSACTION_ERROR_MESSAGES.PARSE_RECEIPT_FAILED,
    );
  }
};
