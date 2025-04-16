// // middlewares/rateLimiter.js
// import { tokenBucket } from "@arcjet/node";
// import { getAuth } from "@clerk/clerk-sdk-node"; // Clerk's SDK for server-side

// export const RateLimiter = async (req, res, next) => {
//   const { userId } = getAuth(req); // Get userId from Clerk's authentication

//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   // Define rate limiting logic using Arcjet's tokenBucket
//   const rateLimitDecision = await tokenBucket({
//     mode: "LIVE",
//     refillRate: 5, // Refill 5 tokens every interval
//     interval: 10, // Refill every 10 seconds
//     capacity: 10, // Bucket capacity of 10 tokens
//   }).protect(req, { userId, requested: 5 });

//   if (rateLimitDecision.isDenied()) {
//     return res.status(429).json({ error: "Too Many Requests" });
//   }

//   next(); // Continue to the next middleware or route handler
// };
