import { PrismaClient } from "@prisma/client";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";
import { Prisma } from "@prisma/client";

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

    // ✅ Validate required fields
    if (!type || !amount || !date || !accountId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Ensure amount is positive
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // ✅ Check if account exists
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found!" });
    }

    // ✅ Calculate nextRecurringDate only if transaction is recurring
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
          break;
      }
    }

    // ✅ Ensure atomicity using Prisma transaction
    const transaction = await prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.transaction.create({
        data: {
          type,
          amount: new Prisma.Decimal(amount), // Ensuring decimal precision
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

      // ✅ Update balance and usedAmount correctly
      let newBalance = new Prisma.Decimal(account.balance);
      let newUsedAmount = new Prisma.Decimal(account.usedAmount);

      if (type === "INCOME") {
        newBalance = newBalance.plus(amount);
      } else {
        newBalance = newBalance.minus(amount);
        newUsedAmount = newUsedAmount.plus(amount);
      }

      await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: newBalance,
          usedAmount: newUsedAmount, // ✅ Updating usedAmount for expenses
        },
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

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Adjust balance if amount or type has changed
    let newBalance = Number(account.balance);
    let newUsedAmount = Number(account.usedAmount);

    // Revert old transaction effect
    if (existingTransaction.type === "INCOME") {
      newBalance -= Number(existingTransaction.amount);
    } else {
      newBalance += Number(existingTransaction.amount);
      newUsedAmount -= Number(existingTransaction.amount); // Reduce old expense from usedAmount
    }

    // Apply new transaction effect
    if (type === "INCOME") {
      newBalance += Number(amount);
    } else {
      newBalance -= Number(amount);
      newUsedAmount += Number(amount); // Increase new expense in usedAmount
    }

    // Ensure `usedAmount` doesn't go negative
    newUsedAmount = Math.max(newUsedAmount, 0);

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

    // Perform atomic transaction to update both the transaction and account
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
        data: { balance: newBalance, usedAmount: newUsedAmount },
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

export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Fetch the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Fetch the associated account
    const account = await prisma.account.findUnique({
      where: { id: transaction.accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Adjust balance and usedAmount
    let newBalance = Number(account.balance);
    let newUsedAmount = Number(account.usedAmount);

    if (transaction.type === "INCOME") {
      newBalance -= Number(transaction.amount); // Deduct income from balance
    } else {
      newBalance += Number(transaction.amount); // Add back expense
      newUsedAmount -= Number(transaction.amount); // Reduce usedAmount
    }

    // Ensure `usedAmount` is not negative
    newUsedAmount = Math.max(newUsedAmount, 0);

    // Perform transaction deletion and account update atomically
    await prisma.$transaction([
      // Step 1: Delete the transaction
      prisma.transaction.delete({
        where: { id: transactionId },
      }),

      // Step 2: Update the account balance and usedAmount
      prisma.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: newBalance, // Update balance after deletion
          usedAmount: newUsedAmount, // Update usedAmount for expenses
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

    // Compute balance & usedAmount updates per account
    const accountUpdates = {};

    transactions.forEach((txn) => {
      if (!accountUpdates[txn.accountId]) {
        accountUpdates[txn.accountId] = { balance: 0, usedAmount: 0 };
      }

      if (txn.type === "INCOME") {
        accountUpdates[txn.accountId].balance -= Number(txn.amount); // Deduct income from balance
      } else {
        accountUpdates[txn.accountId].balance += Number(txn.amount); // Add back expense
        accountUpdates[txn.accountId].usedAmount -= Number(txn.amount); // Reduce usedAmount
      }
    });

    // Convert updates to Prisma queries
    const accountUpdatesArray = Object.keys(accountUpdates).map(
      async (accountId) => {
        const { balance, usedAmount } = accountUpdates[accountId];

        // Ensure usedAmount doesn't go negative
        const account = await prisma.account.findUnique({
          where: { id: accountId },
        });

        const newUsedAmount = Math.max(
          Number(account.usedAmount) + usedAmount,
          0
        );

        return prisma.account.update({
          where: { id: accountId },
          data: {
            balance: { increment: balance }, // Update balance
            usedAmount: newUsedAmount, // Update usedAmount
          },
        });
      }
    );

    // Execute deletion and balance update in a single Prisma transaction
    await prisma.$transaction(async (prisma) => {
      // Delete all transactions
      await prisma.transaction.deleteMany({
        where: { id: { in: transactionIds } },
      });

      // Update all affected accounts
      await Promise.all(accountUpdatesArray);
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

export const getFilteredTransactions = async (req, res) => {
  try {
    let {
      category,
      type,
      isRecurring,
      description,
      accountId,
      page = 1,
      limit = 10,
    } = req.query;

    // Convert pagination values to numbers
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    // Build the filters object dynamically
    let filters = {};
    if (category && category !== "ALL") filters.category = category;
    if (type && type !== "ALL") filters.type = type;
    if (isRecurring && isRecurring !== "ALL")
      filters.isRecurring = isRecurring === "true";
    if (description)
      filters.description = { contains: description, mode: "insensitive" };
    if (accountId) filters.accountId = accountId; // Ensure only transactions for a specific account are fetched

    // Get total transaction count for pagination
    const totalCount = await prisma.transaction.count({ where: filters });

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Fetch transactions with applied filters and pagination
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: { date: "desc" },
      skip: offset,
      take: limit,
    });

    return res.status(200).json({
      message: "Filtered transactions fetched successfully",
      data: transactions,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTransactions: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching filtered transactions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
