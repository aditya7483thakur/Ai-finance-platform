import { processRecurringTransactions } from "../jobs/processRecurringTransactions.js";

export const runRecurringTransactions = async (req, res) => {
  try {
    await processRecurringTransactions();
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
