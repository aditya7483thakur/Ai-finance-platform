import arcjet, { tokenBucket } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 600,
      capacity: 10,
    }),
  ],
});

const rateLimiter = (tokens = 1) => {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      const decision = await aj.protect(
        req as any,
        {
          ip,
          requested: tokens,
        } as any,
      );

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
