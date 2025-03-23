import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.js";
import transactionRouter from "./routes/transaction.js";
import accountRouter from "./routes/account.js";

// Load environment variables
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

// Sample Route
app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Prisma with Express is running! 🚀");
});

app.use("/users", userRouter);
app.use("/accounts", accountRouter);
app.use("/transactions", transactionRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
