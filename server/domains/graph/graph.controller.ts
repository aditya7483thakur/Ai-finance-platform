import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  GRAPH_ERROR_MESSAGES,
  GRAPH_SUCCESS_MESSAGES,
} from "./graph.constants.js";
import {
  getCurrentMonthCategoryExpensesService,
  getTransactionSummaryService,
} from "./graph.service.js";
import {
  parseCategoryExpensesQuery,
  parseTransactionSummaryQuery,
} from "./graph.validators.js";

export const getTransactionSummary = async (req: Request, res: Response) => {
  try {
    const input = parseTransactionSummaryQuery(req.query);
    const result = await getTransactionSummaryService(input);

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
    const { userId } = parseCategoryExpensesQuery(req.query);
    const result = await getCurrentMonthCategoryExpensesService(userId);

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
