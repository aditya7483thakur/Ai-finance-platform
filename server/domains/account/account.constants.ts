export const ACCOUNT_SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: "Account created successfully",
  ACCOUNT_FETCHED: "Account fetched successfully",
  ACCOUNTS_FETCHED: "Accounts fetched successfully",
  ACCOUNT_UPDATED: "Account updated successfully",
  ACCOUNT_DELETED: "Account deleted successfully",
} as const;

export const ACCOUNT_ERROR_MESSAGES = {
  INVALID_REQUEST_PAYLOAD: "Invalid request payload",
  USER_ID_REQUIRED: "User ID is required",
  ACCOUNT_ID_REQUIRED: "Account ID is required",
  ACCOUNT_NAME_REQUIRED: "Account name is required",
  INVALID_BALANCE: "Balance must be a valid number",
  INVALID_BUDGET: "Budget must be a valid number",
  UPDATE_FIELDS_REQUIRED: "At least one field (name or budget) is required",
  USER_NOT_FOUND: "User not found",
  ACCOUNT_NOT_FOUND: "Account not found",
  ACCOUNT_HAS_TRANSACTIONS: "Cannot delete account with existing transactions",
  CREATE_ACCOUNT_FAILED: "Error creating account:",
  FETCH_ACCOUNT_FAILED: "Error fetching account:",
  FETCH_ACCOUNTS_FAILED: "Error fetching accounts:",
  UPDATE_ACCOUNT_FAILED: "Error updating account:",
  DELETE_ACCOUNT_FAILED: "Error deleting account:",
} as const;
