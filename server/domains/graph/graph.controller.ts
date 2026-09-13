import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  GRAPH_ERROR_MESSAGES,
  GRAPH_SUCCESS_MESSAGES,
} from "./graph.constants.js";
import { graphService } from "../../composition.js";
import {
  categoryExpensesQuerySchema,
  transactionSummaryQuerySchema,
} from "./graph.validators.js";

export const getTransactionSummary = async (req: Request, res: Response) => {
  try {
    const input = transactionSummaryQuerySchema.parse(req.query);
    const result = await graphService.getTransactionSummary(input);

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
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = categoryExpensesQuerySchema.parse(req.query);
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
