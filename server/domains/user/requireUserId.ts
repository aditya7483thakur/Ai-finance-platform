import type { AuthenticatedRequest } from "./user.types.js";
import { authenticatedUserIdSchema } from "./user.validators.js";

export const requireUserId = (req: AuthenticatedRequest): string => {
  return authenticatedUserIdSchema.parse(req.userId);
};
