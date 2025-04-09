import { addDays, addWeeks, addMonths, addYears, isBefore } from "date-fns";
import prisma from "../utils/prisma.js";
import { Prisma } from "@prisma/client";
import checkAndSendBudgetAlert from "../utils/checkAndSendBudgetAlert.js";

export const runRecurringTransactions = async (req, res) => {
  try {
    const today = new Date();

    const dueTransactions = await prisma.transaction.findMany({
      where: {
        isRecurring: true,
        nextRecurringDate: {
          lte: today,
        },
      },
    });

    for (const txn of dueTransactions) {
      let newUsedAmount = new Prisma.Decimal(0); // declare here to use later

      await prisma.$transaction(async (prisma) => {
        // 1. Create the new transaction
        const newTransaction = await prisma.transaction.create({
          data: {
            type: txn.type,
            amount: txn.amount,
            description: txn.description,
            date: today,
            category: txn.category,
            accountId: txn.accountId,
            userId: txn.userId,
            isRecurring: false,
            receiptUrl: txn.receiptUrl,
          },
        });

        // 2. Update account balances
        const account = await prisma.account.findUnique({
          where: { id: txn.accountId },
        });

        if (account) {
          let newBalance = new Prisma.Decimal(account.balance);
          newUsedAmount = new Prisma.Decimal(account.usedAmount); // update outer variable here

          if (txn.type === "INCOME") {
            newBalance = newBalance.plus(txn.amount);
          } else {
            newBalance = newBalance.minus(txn.amount);
            newUsedAmount = newUsedAmount.plus(txn.amount);
          }

          await prisma.account.update({
            where: { id: txn.accountId },
            data: {
              balance: newBalance,
              usedAmount: newUsedAmount,
            },
          });
        }

        // 3. Update nextRecurringDate
        let nextDate = txn.nextRecurringDate;
        while (
          isBefore(nextDate, today) ||
          nextDate.getTime() === today.getTime()
        ) {
          switch (txn.recurringInterval) {
            case "DAILY":
              nextDate = addDays(nextDate, 1);
              break;
            case "WEEKLY":
              nextDate = addWeeks(nextDate, 1);
              break;
            case "MONTHLY":
              nextDate = addMonths(nextDate, 1);
              break;
            case "YEARLY":
              nextDate = addYears(nextDate, 1);
              break;
          }
        }

        await prisma.transaction.update({
          where: { id: txn.id },
          data: { nextRecurringDate: nextDate },
        });
      });

      // ✅ Outside transaction: safely access newUsedAmount and call budget alert
      const accountWithUser = await prisma.account.findUnique({
        where: { id: txn.accountId },
        include: { user: true },
      });

      if (accountWithUser) {
        await checkAndSendBudgetAlert({
          account: accountWithUser,
          userId: txn.userId,
          accountId: txn.accountId,
          newUsedAmount,
          type: txn.type,
        });
      }
    }

    res
      .status(200)
      .json({ message: "Recurring transactions processed successfully" });
  } catch (error) {
    console.error("Error running recurring transactions:", error);
    res
      .status(500)
      .json({ message: "Failed to process recurring transactions" });
  }
};
