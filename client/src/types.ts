export type AccountType = {
  id: string;
  name: string;
  balance: number; // Assuming Decimal is represented as number in TypeScript
  userId: string;
  budget?: number | null;
  usedAmount: number;
  createdAt: string; // DateTime can be represented as string (ISO format)
  updatedAt: string;
};

export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionCategory =
  | "FOOD"
  | "RENT"
  | "TRANSPORT"
  | "SALARY"
  | "INVESTMENT"
  | "OTHER";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  date: string;
  category: TransactionCategory;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  nextRecurringDate?: Date;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}
