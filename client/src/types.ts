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
  | "SALARY"
  | "INVESTMENTS"
  | "FOOD"
  | "TRANSPORT"
  | "HOUSING"
  | "ENTERTAINMENT"
  | "TRAVEL"
  | "HEALTH"
  | "SHOPPING"
  | "MISCELLANEOUS";

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

export type CreateAccountData = {
  name: string;
  balance: string;
  budget?: string;
  userId: string;
};

export type updateAccountData = {
  id: string;
} & ({ name: string; budget?: string } | { name?: string; budget: string });
