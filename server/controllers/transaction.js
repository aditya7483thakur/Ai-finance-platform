import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      description,
      date,
      category,
      accountId,
      userId,
      isRecurring,
      recurringInterval,
    } = req.body;

    // Check if account exists
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found!" });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        description,
        date: new Date(date),
        category,
        accountId,
        userId,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
      },
    });

    // Update account balance if it's an expense or income
    let newBalance = account.balance;
    if (type === "INCOME") {
      newBalance = account.balance + amount;
    } else if (type === "EXPENSE") {
      newBalance = account.balance - amount;
    }

    await prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    return res.status(201).json({
      message: "Transaction created successfully!",
      transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
