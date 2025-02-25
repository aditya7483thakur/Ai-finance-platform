import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user.js";
import accountRouter from "./routes/account.js";

// Load environment variables
dotenv.config();
console.log(process.env.CLERK_SECRET_KEY);

// Initialize Express
const app = express();

const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Sample Route
app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Prisma with Express is running! 🚀");
});

app.use("/users", userRouter);
app.use("/accounts", accountRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
