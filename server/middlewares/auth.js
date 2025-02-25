import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// Middleware to verify JWT token from Clerk
const clerkAuthMiddleware = ClerkExpressWithAuth();

export default clerkAuthMiddleware;
