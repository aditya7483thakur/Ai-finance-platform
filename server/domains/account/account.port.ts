import type { Account, Prisma } from "@prisma/client";
import type { DbClient } from "../../config/prisma.js";
import type {
  AccountWithUser,
  CreateAccountInput,
  UpdateAccountData,
} from "./account.types.js";

export type AccountRepository = {
  createAccountRecord: (
    data: CreateAccountInput,
    db?: DbClient,
  ) => Promise<Account>;
  findAccountById: (accountId: string, db?: DbClient) => Promise<Account | null>;
  findAccountByIdWithTransactions: (
    accountId: string,
    db?: DbClient,
  ) => Promise<(Account & { transactions: { id: string }[] }) | null>;
  findAccountsByUserId: (userId: string, db?: DbClient) => Promise<Account[]>;
  updateAccountById: (
    accountId: string,
    data: UpdateAccountData,
    db?: DbClient,
  ) => Promise<Account>;
  updateAccountAmounts: (
    accountId: string,
    balance: Prisma.Decimal,
    usedAmount: Prisma.Decimal,
    db?: DbClient,
  ) => Promise<Account>;
  deleteAccountById: (accountId: string, db?: DbClient) => Promise<Account>;
  findAccountWithUserById: (
    accountId: string,
    db?: DbClient,
  ) => Promise<AccountWithUser | null>;
  findBudgetAlertSentTodayByAccountId: (
    accountId: string,
    today: Date,
    db?: DbClient,
  ) => Promise<{ id: string } | null>;
  createBudgetAlertSentRecord: (
    userId: string,
    accountId: string,
    db?: DbClient,
  ) => Promise<unknown>;
};
