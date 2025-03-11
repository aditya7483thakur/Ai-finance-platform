import { PrismaClient } from "@prisma/client";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

const prisma = new PrismaClient();

//cron job is needed to setup for this
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

    // Calculate nextRecurringDate if it's a recurring transaction
    let nextRecurringDate = null;
    if (isRecurring && recurringInterval) {
      const transactionDate = new Date(date);
      switch (recurringInterval) {
        case "DAILY":
          nextRecurringDate = addDays(transactionDate, 1);
          break;
        case "WEEKLY":
          nextRecurringDate = addWeeks(transactionDate, 1);
          break;
        case "MONTHLY":
          nextRecurringDate = addMonths(transactionDate, 1);
          break;
        case "YEARLY":
          nextRecurringDate = addYears(transactionDate, 1);
      }
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
        nextRecurringDate,
      },
    });

    // Update account balance
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
      data: transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
