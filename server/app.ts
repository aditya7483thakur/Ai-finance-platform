import express from "express";
import cors from "cors";
import "./config/env.js";
import userRouter from "./domains/user/user.routes.js";
import transactionRouter from "./domains/transaction/transaction.routes.js";
import graphRouter from "./domains/graph/graph.routes.js";
import accountRouter from "./domains/account/account.routes.js";
import cronRoutes from "./domains/cron/cron.routes.js";
import { requireCronSecret } from "./domains/cron/requireCronSecret.middleware.js";
import { requireAuth } from "./domains/user/requireAuth.js";

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
app.use("/auth", userRouter);

// Protected routes
app.use("/accounts", requireAuth, accountRouter);
app.use("/transactions", requireAuth, transactionRouter);
app.use("/graphs", requireAuth, graphRouter);
app.use("/cron", requireCronSecret, cronRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
