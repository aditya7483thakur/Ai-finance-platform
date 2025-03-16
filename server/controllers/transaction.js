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

export const editTransaction = async (req, res) => {
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

//pagination pending
export const getAccountTransactions = async (req, res) => {
  try {
    const { accountId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!accountId) {
      return res.status(400).json({ message: "Account Id is required" });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const totalCount = await prisma.transaction.count({
      where: { accountId },
    });

    const offset = (page - 1) * limit;

    const transactions = await prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: "desc" },
      skip: offset,
      take: limit,
    });

    return res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTransactions: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount, // Check if there's a next page
        hasPrevPage: page > 1, // Check if there's a previous page
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Get account details
    const account = await prisma.account.findUnique({
      where: { id: transaction.accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Adjust balance
    let newBalance = Number(account.balance);
    if (transaction.type === "INCOME") {
      newBalance -= transaction.amount; // Deduct income
    } else {
      newBalance += transaction.amount; // Add back expense
    }

    // Perform transaction deletion and balance update atomically
    await prisma.$transaction([
      // Step 1: Delete the transaction
      prisma.transaction.delete({
        where: { id: transactionId },
      }),

      // Step 2: Update the account balance
      prisma.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: newBalance, // Update balance after transaction removal
        },
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMultipleTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        message: "Invalid request. Provide an array of transaction IDs.",
      });
    }

    // Fetch all transactions to be deleted
    const transactions = await prisma.transaction.findMany({
      where: { id: { in: transactionIds } },
    });

    if (transactions.length !== transactionIds.length) {
      return res.status(404).json({ message: "Some transactions not found" });
    }

    // Compute balance updates per account
    const accountUpdates = {};
    transactions.forEach((txn) => {
      if (!accountUpdates[txn.accountId]) {
        accountUpdates[txn.accountId] = 0;
      }
      // Reverse the transaction effect on balance
      accountUpdates[txn.accountId] +=
        txn.type === "INCOME" ? -txn.amount : txn.amount;
    });

    // Convert updates to Prisma queries
    const accountUpdatesArray = Object.keys(accountUpdates).map(
      (accountId) => ({
        where: { id: accountId },
        data: { balance: { increment: accountUpdates[accountId] } },
      })
    );

    // Execute deletion and balance update in a single Prisma transaction
    await prisma.$transaction(async (prisma) => {
      // Delete all transactions
      await prisma.transaction.deleteMany({
        where: { id: { in: transactionIds } },
      });

      // Update all affected accounts
      for (const update of accountUpdatesArray) {
        await prisma.account.update(update);
      }
    });

    return res.status(200).json({
      message: "Transactions deleted successfully",
      deletedCount: transactionIds.length,
    });
  } catch (error) {
    console.error("Error deleting transactions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
