export const AUTH_SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  SIGNIN_SUCCESSFUL: "Sign in successful",
  USER_FETCHED: "User fetched successfully",
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_REQUEST_PAYLOAD: "Invalid request payload",
  NAME_EMAIL_PASSWORD_REQUIRED: "Name, email, and password are required",
  EMAIL_PASSWORD_REQUIRED: "Email and password are required",
  USER_ID_REQUIRED: "Authenticated user id is required",
  USER_ALREADY_EXISTS: "User with this email already exists",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  JWT_SECRET_NOT_CONFIGURED: "JWT secret is not configured",
  UNAUTHORIZED_NO_TOKEN: "Unauthorized: No token provided",
  UNAUTHORIZED_TOKEN_EXPIRED: "Unauthorized: Token has expired",
  UNAUTHORIZED_INVALID_TOKEN: "Unauthorized: Invalid token",
  SIGNUP_FAILED: "Error during signup:",
  SIGNIN_FAILED: "Error during signin:",
  FETCH_USER_FAILED: "Error fetching user:",
  AUTH_MIDDLEWARE_FAILED: "Auth middleware error:",
} as const;
