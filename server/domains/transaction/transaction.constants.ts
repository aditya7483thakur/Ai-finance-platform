export const TRANSACTION_SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: "Transaction created successfully!",
  TRANSACTION_UPDATED: "Transaction updated successfully!",
  TRANSACTION_DELETED: "Transaction deleted successfully",
  TRANSACTIONS_DELETED: "Transactions deleted successfully",
  TRANSACTIONS_FILTERED: "Filtered transactions fetched successfully",
  RECEIPT_PARSED: "Receipt parsed successfully",
} as const;

export const TRANSACTION_ERROR_MESSAGES = {
  MISSING_REQUIRED_FIELDS: "Missing required fields",
  INVALID_AMOUNT: "Amount must be greater than 0",
  INVALID_DATE: "Invalid transaction date",
  INVALID_TRANSACTION_TYPE: "Invalid transaction type",
  INVALID_TRANSACTION_CATEGORY: "Invalid transaction category",
  INVALID_RECURRING_INTERVAL: "Invalid recurring interval",
  TRANSACTION_ID_REQUIRED: "Transaction ID is required",
  TRANSACTION_NOT_FOUND: "Transaction not found",
  ACCOUNT_NOT_FOUND: "Account not found",
  INVALID_TRANSACTION_IDS:
    "Invalid request. Provide an array of transaction IDs.",
  SOME_TRANSACTIONS_NOT_FOUND: "Some transactions not found",
  GEMINI_API_KEY_MISSING: "GEMINI_API is missing in environment variables",
  RECEIPT_FILE_REQUIRED: "Receipt file is required",
  RECEIPT_PARSE_FAILED: "Failed to parse receipt",
  CREATE_TRANSACTION_FAILED: "Error creating transaction:",
  UPDATE_TRANSACTION_FAILED: "Error updating transaction:",
  DELETE_TRANSACTION_FAILED: "Error deleting transaction:",
  DELETE_MULTIPLE_TRANSACTIONS_FAILED: "Error deleting transactions:",
  FETCH_FILTERED_TRANSACTIONS_FAILED: "Error fetching filtered transactions:",
  PARSE_RECEIPT_FAILED: "Gemini Error:",
} as const;
