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
      account: newAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
