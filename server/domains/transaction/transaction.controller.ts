import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  TRANSACTION_ERROR_MESSAGES,
  TRANSACTION_SUCCESS_MESSAGES,
} from "./transaction.constants.js";
import {
  aiFormReceiptService,
  createTransactionService,
  deleteMultipleTransactionsService,
  deleteTransactionService,
  getFilteredTransactionsService,
  updateTransactionService,
} from "./transaction.service.js";
import { BadRequestError } from "../../shared/types/errors.js";
import {
  parseCreateTransactionPayload,
  parseDeleteManyPayload,
  parseFilterQuery,
  parseTransactionIdParam,
  parseUpdateTransactionPayload,
} from "./transaction.validators.js";

type ReceiptRequest = Request & {
  file?: Express.Multer.File;
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const input = parseCreateTransactionPayload(req.body);
    const transaction = await createTransactionService(input);
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

export const editTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = parseTransactionIdParam(req.params.transactionId);
    const input = parseUpdateTransactionPayload(req.body);
    const transaction = await updateTransactionService(transactionId, input);

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

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = parseTransactionIdParam(req.params.transactionId);
    await deleteTransactionService(transactionId);

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
  req: Request,
  res: Response,
) => {
  try {
    const transactionIds = parseDeleteManyPayload(req.body);
    const deletedCount =
      await deleteMultipleTransactionsService(transactionIds);

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

export const getFilteredTransactions = async (req: Request, res: Response) => {
  try {
    const filters = parseFilterQuery(req.query);
    const result = await getFilteredTransactionsService(filters);

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

    const parsedReceipt = await aiFormReceiptService(
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
