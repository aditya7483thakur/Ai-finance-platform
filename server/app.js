import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.js";
import transactionRouter from "./routes/transaction.js";
import graphRouter from "./routes/graph.js";
import accountRouter from "./routes/account.js";
import cronRoutes from "./routes/cron.js";
import { requireAuth, clerkMiddleware } from "@clerk/express";

dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
// app.use(requireAuth());
app.use(clerkMiddleware({ debug: true }));

// Sample Route
app.get("/", (req, res) => {
  res.send("Prisma with Express is running! 🚀");
});

app.use("/users", requireAuth({ signInUrl: "/error" }), userRouter);
app.use("/accounts", requireAuth({ signInUrl: "/error" }), accountRouter);
app.use(
  "/transactions",
  requireAuth({ signInUrl: "/error" }),
  transactionRouter
);
app.use("/graphs", requireAuth({ signInUrl: "/error" }), graphRouter);
app.use("/cron", cronRoutes);

app.get("/error", (req, res) => {
  return res
    .status(401)
    .json({ message: "Unauthorized: Invalid or missing token" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
