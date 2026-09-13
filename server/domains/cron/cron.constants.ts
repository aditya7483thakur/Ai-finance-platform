export const CRON_SUCCESS_MESSAGES = {
  RECURRING_TRANSACTIONS_PROCESSED:
    "Recurring transactions processed successfully",
  MONTHLY_SUMMARIES_SENT: "Monthly summaries run completed",
} as const;

export const CRON_ERROR_MESSAGES = {
  RUN_RECURRING_TRANSACTIONS_FAILED: "Error running recurring transactions:",
  SEND_MONTHLY_SUMMARIES_FAILED: "Error running monthly summaries:",
  NEXT_RECURRING_DATE_REQUIRED: "Recurring transaction is missing next date",
  INVALID_DATE_QUERY: "Invalid date query parameter",
  ACCOUNT_NOT_FOUND: "Account not found for recurring transaction",
  SECRET_NOT_CONFIGURED: "Cron secret is not configured",
  UNAUTHORIZED: "Unauthorized: Invalid cron secret",
} as const;

export const CRON_SECRET_HEADER = "x-cron-secret";
