import type { Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  GRAPH_ERROR_MESSAGES,
  GRAPH_SUCCESS_MESSAGES,
} from "./graph.constants.js";
import { accountService, graphService } from "../../composition.js";
import { transactionSummaryQuerySchema } from "./graph.validators.js";
import type { AuthenticatedRequest } from "../auth/auth.types.js";
import { requireUserId } from "../auth/requireUserId.js";

export const getTransactionSummary = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const query = transactionSummaryQuerySchema.parse(req.query);
    await accountService.getSingle(query.accountId, userId);
    const result = await graphService.getTransactionSummary({
      ...query,
      userId,
    });

    return res.status(200).json({
      message: GRAPH_SUCCESS_MESSAGES.TRANSACTION_SUMMARY_FETCHED,
      data: result.summary,
      meta: result.meta,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      GRAPH_ERROR_MESSAGES.FETCH_TRANSACTION_SUMMARY_FAILED,
    );
  }
};

export const getCurrentMonthCategoryExpenses = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = requireUserId(req);
    const result = await graphService.getCurrentMonthCategoryExpenses(userId);

    return res.status(200).json({
      message: GRAPH_SUCCESS_MESSAGES.CATEGORY_EXPENSES_FETCHED,
      data: result.expenses,
      meta: result.meta,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      GRAPH_ERROR_MESSAGES.FETCH_CATEGORY_EXPENSES_FAILED,
    );
  }
};
