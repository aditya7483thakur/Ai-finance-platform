import type { PersistenceContext } from "../../shared/types/persistence.js";
import type {
  Account,
  AccountWithTransactionIds,
  AccountWithUser,
  CreateAccountInput,
  UpdateAccountData,
} from "./account.types.js";

export type AccountRepository = {
  createAccountRecord: (
    data: CreateAccountInput,
    ctx?: PersistenceContext,
  ) => Promise<Account>;
  findAccountById: (
    accountId: string,
    ctx?: PersistenceContext,
  ) => Promise<Account | null>;
  findAccountByIdWithTransactions: (
    accountId: string,
    ctx?: PersistenceContext,
  ) => Promise<AccountWithTransactionIds | null>;
  findAccountsByUserId: (
    userId: string,
    ctx?: PersistenceContext,
  ) => Promise<Account[]>;
  updateAccountById: (
    accountId: string,
    data: UpdateAccountData,
    ctx?: PersistenceContext,
  ) => Promise<Account>;
  updateAccountAmounts: (
    accountId: string,
    balance: string,
    usedAmount: string,
    ctx?: PersistenceContext,
  ) => Promise<Account>;
  deleteAccountById: (
    accountId: string,
    ctx?: PersistenceContext,
  ) => Promise<Account>;
  findAccountWithUserById: (
    accountId: string,
    ctx?: PersistenceContext,
  ) => Promise<AccountWithUser | null>;
  findBudgetAlertSentTodayByAccountId: (
    accountId: string,
    today: Date,
    ctx?: PersistenceContext,
  ) => Promise<{ id: string } | null>;
  createBudgetAlertSentRecord: (
    userId: string,
    accountId: string,
    ctx?: PersistenceContext,
  ) => Promise<void>;
};
