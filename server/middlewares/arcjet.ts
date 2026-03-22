// middleware/arcjetMiddleware.js
import arcjet, { detectBot } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    detectBot({
      mode: "LIVE", // Use "DRY_RUN" for logging only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow search engine crawlers
        // "CATEGORY:MONITOR",
        // "CATEGORY:PREVIEW",
      ],
    }),
  ],
});

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    // Log the decision (optional for debugging)
    // console.log("Arcjet decision", decision);

    if (decision.isDenied() || decision.results.some(isSpoofedBot)) {
      return res.status(403).json({ error: "Forbidden - bot detected" });
    }

    next();
  } catch (err) {
    console.error("Arcjet error:", err);
    next(); // Allow request through if Arcjet fails to avoid blocking users
  }
};
