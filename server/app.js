import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Sample Route
app.get("/", (req, res) => {
  res.send("Prisma with Express is running! 🚀");
});

// Example: Fetch all users from the database
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
