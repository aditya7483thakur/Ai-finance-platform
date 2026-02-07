import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Unauthorized: Token has expired",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Unauthorized: Invalid token",
      });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
