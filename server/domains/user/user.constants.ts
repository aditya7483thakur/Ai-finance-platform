export const USER_SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_FOUND: "User found",
} as const;

export const USER_ERROR_MESSAGES = {
  MISSING_USER_PAYLOAD: "Missing user payload",
  USER_ID_REQUIRED: "User id is required",
  USER_ID_REQUIRED_CAPITALIZED: "User ID is required",
  EMAIL_REQUIRED: "Email is required",
  USER_ALREADY_EXISTS_WITH_ID: "User already exists with this ID",
  USER_ALREADY_EXISTS_WITH_EMAIL: "User already exists with this email",
  USER_NOT_FOUND_IN_DATABASE: "User not found in database",
  NO_USER_FOUND: "No user found",
  SAVE_USER_FAILED: "Error saving user:",
  UPDATE_USER_FAILED: "Error updating user:",
  DELETE_USER_FAILED: "Error deleting user:",
  FETCH_USER_FAILED: "Error fetching user:",
} as const;
