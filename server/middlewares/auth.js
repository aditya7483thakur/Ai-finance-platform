import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// Middleware to verify JWT token from Clerk
const clerkAuthMiddleware = ClerkExpressWithAuth({
  // Your Clerk secret key from environment variables
  secretKey: process.env.CLERK_SECRET_KEY,
});

export default clerkAuthMiddleware;
