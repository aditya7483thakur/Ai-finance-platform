import type { Request, Response } from "express";
import { handleControllerError } from "../../shared/utils/controllerError.js";
import {
  CRON_ERROR_MESSAGES,
  CRON_SUCCESS_MESSAGES,
} from "./cron.constants.js";
import {
  runRecurringTransactionsService,
  sendMonthlySummariesService,
} from "./cron.service.js";
import { parseCronQuery } from "./cron.validators.js";

export const runRecurringTransactions = async (req: Request, res: Response) => {
  try {
    const { referenceDate } = parseCronQuery(req.query);
    const result = await runRecurringTransactionsService(referenceDate);

    return res.status(200).json({
      message: CRON_SUCCESS_MESSAGES.RECURRING_TRANSACTIONS_PROCESSED,
      data: result,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      CRON_ERROR_MESSAGES.RUN_RECURRING_TRANSACTIONS_FAILED,
    );
  }
};

export const sendMonthlySummaries = async (req: Request, res: Response) => {
  try {
    parseCronQuery(req.query);
    const result = await sendMonthlySummariesService();

    return res.status(200).json({
      message: CRON_SUCCESS_MESSAGES.MONTHLY_SUMMARIES_SENT,
      data: result,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      CRON_ERROR_MESSAGES.SEND_MONTHLY_SUMMARIES_FAILED,
    );
  }
};
