// middlewares/rateLimiter.js
import arcjet, { tokenBucket } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track by IP address
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // 5 tokens every 10 seconds
      interval: 600, // interval in seconds
      capacity: 10, // max burst capacity
    }),
  ],
});

const rateLimiter = (tokens = 1) => {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      const decision = await aj.protect(req, {
        ip,
        requested: tokens,
      });

      console.log("Arcjet decision", decision);

      if (decision.isDenied()) {
        return res.status(429).json({
          error: "Too Many Requests",
          reason: decision.reason,
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      res.status(500).json({ error: "Rate limit check failed" });
    }
  };
};

export default rateLimiter;
