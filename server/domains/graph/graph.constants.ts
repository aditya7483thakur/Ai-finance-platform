export const GRAPH_SUCCESS_MESSAGES = {
  TRANSACTION_SUMMARY_FETCHED: "Transaction summary fetched successfully",
  CATEGORY_EXPENSES_FETCHED: "Category expenses fetched successfully",
} as const;

export const GRAPH_ERROR_MESSAGES = {
  ACCOUNT_ID_REQUIRED: "Valid accountId is required",
  USER_ID_REQUIRED: "Valid userId is required",
  FILTER_REQUIRED: "Valid filter is required",
  INVALID_FILTER_OPTION: "Invalid filter option",
  FETCH_TRANSACTION_SUMMARY_FAILED: "Error fetching transaction summary:",
  FETCH_CATEGORY_EXPENSES_FAILED: "Error fetching category expenses:",
} as const;
