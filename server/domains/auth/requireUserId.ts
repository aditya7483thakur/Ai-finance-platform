import type { AuthenticatedRequest } from "./auth.types.js";
import { authenticatedUserIdSchema } from "./auth.validators.js";

export const requireUserId = (req: AuthenticatedRequest): string => {
  return authenticatedUserIdSchema.parse(req.userId);
};
