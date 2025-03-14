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

    // ensures both operations succeed or fail together (atomicity)
    const transaction = await prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.transaction.create({
        data: {
          type,
          amount,
          description,
          date: new Date(date),
          category,
          accountId,
          userId,
          isRecurring: Boolean(isRecurring),
          recurringInterval: isRecurring ? recurringInterval : null,
          nextRecurringDate,
        },
      });

      let newBalance = Number(account.balance);
      newBalance =
        type === "INCOME" ? newBalance + amount : newBalance - amount;

      await prisma.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
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

export const updateTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      description,
      date,
      category,
      isRecurring,
      recurringInterval,
    } = req.body;

    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Fetch the existing transaction
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Fetch the related account
    const account = await prisma.account.findUnique({
      where: { id: existingTransaction.accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Adjust balance if amount or type has changed
    let newBalance = Number(account.balance);

    if (existingTransaction.type === "INCOME") {
      newBalance -= Number(existingTransaction.amount);
    } else {
      newBalance += Number(existingTransaction.amount);
    }

    if (type === "INCOME") {
      newBalance += Number(amount);
    } else {
      newBalance -= Number(amount);
    }

    // Calculate nextRecurringDate if it's a recurring transaction
    let nextRecurringDate = existingTransaction.nextRecurringDate;
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
    } else {
      nextRecurringDate = null; // If not recurring, reset
    }

    // Perform atomic transaction to update both the transaction and account balance
    const updatedTransaction = await prisma.$transaction(async (prisma) => {
      const transactionUpdate = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          type,
          amount: Number(amount),
          description,
          date: new Date(date),
          category,
          isRecurring: Boolean(isRecurring),
          recurringInterval: isRecurring ? recurringInterval : null,
          nextRecurringDate,
        },
      });

      await prisma.account.update({
        where: { id: existingTransaction.accountId },
        data: { balance: newBalance },
      });

      return transactionUpdate;
    });

    return res.status(200).json({
      message: "Transaction updated successfully!",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
