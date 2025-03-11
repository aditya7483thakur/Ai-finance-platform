import { PrismaClient, AccountType } from "@prisma/client";

const prisma = new PrismaClient();

export const createAccount = async (req, res) => {
  try {
    const { userId, name, type, initialBalance, isDefault } = req.body;
    console.log(req.body);

    // Validate required fields
    if (!userId || !name || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate AccountType (Ensure type is one of the defined enums)
    if (!Object.values(AccountType).includes(type)) {
      return res.status(400).json({ error: "Invalid account type" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If isDefault is true, make other accounts non-default
    if (isDefault) {
      await prisma.account.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // Create the new account
    const newAccount = await prisma.account.create({
      data: {
        name,
        type,
        balance: initialBalance || 0,
        isDefault: isDefault || false,
        userId,
      },
    });

    res.status(201).json({
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    return res.status(200).json({
      message: "Accounts fetched successfully",
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // Extract only 'name'

  if (!name) {
    return res.status(400).json({ error: "Name is required for update" });
  }

  try {
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: { name }, // Only updating name
    });

    res.json({ message: "Account name updated successfully", updatedAccount });
  } catch (error) {
    res.status(400).json({ error: "Account update failed" });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Fetch account details first
    const account = await prisma.account.findUnique({
      where: { id },
      include: { transactions: true }, // Fetch related transactions
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.transactions.length > 0) {
      return res.status(400).json({
        error: "Cannot delete account with existing transactions",
      });
    }

    await prisma.account.delete({ where: { id } });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Account deletion failed", details: error });
  }
};
