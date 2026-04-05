import type { Account, Prisma, TransactionType, User } from "@prisma/client";

export type CreateAccountInput = {
  userId: string;
  name: string;
  balance: number;
  budget: number | null;
};

export type UpdateAccountInput = {
  id: string;
  name?: string;
  budget?: number | null;
};

export type UpdateAccountData = {
  name?: string;
  budget?: Prisma.Decimal | null;
};

export type AccountWithUser = Account & {
  user: User;
};

export type SendBudgetAlertInput = {
  account: AccountWithUser;
  userId: string;
  accountId: string;
  newUsedAmount: Prisma.Decimal;
  type: TransactionType;
};
