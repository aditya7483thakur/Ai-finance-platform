import express from "express";
import cors from "cors";
import "./config/env.js";
import authRouter from "./domains/auth/auth.routes.js";
import transactionRouter from "./domains/transaction/transaction.routes.js";
import graphRouter from "./domains/graph/graph.routes.js";
import accountRouter from "./domains/account/account.routes.js";
import cronRoutes from "./domains/cron/cron.routes.js";
import userRouter from "./domains/user/user.routes.js";
import aiRouter from "./domains/ai/ai.routes.js";
import { requireAuth } from "./domains/auth/requireAuth.middleware.js";

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

// Sample Route
app.get("/", (req, res) => {
  res.send("Prisma with Express is running! 🚀");
});

// Auth routes (public)
app.use("/auth", authRouter);
app.use("/users", userRouter);

// Protected routes
app.use("/accounts", requireAuth, accountRouter);
app.use("/transactions", requireAuth, transactionRouter);
app.use("/graphs", requireAuth, graphRouter);
app.use("/ai", requireAuth, aiRouter);
app.use("/cron", cronRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
