import { addDays, addWeeks, addMonths, addYears, isBefore } from "date-fns";
import prisma from "../utils/prisma.js";

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
      await prisma.transaction.create({
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
