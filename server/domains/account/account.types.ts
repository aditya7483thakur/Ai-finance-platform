import type { LedgerEntryType } from "../../shared/types/ledger.js";

export type Account = {
  id: string;
  name: string;
  balance: string;
  budget: string | null;
  usedAmount: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountUser = {
  id: string;
  email: string;
  name: string;
};

export type AccountWithUser = Account & {
  user: AccountUser;
};

export type AccountWithTransactionIds = Account & {
  transactions: { id: string }[];
};

export type {
  CreateAccountInput,
  UpdateAccountInput,
} from "./account.validators.js";

export type UpdateAccountData = {
  name?: string;
  budget?: number | null;
};

export type SendBudgetAlertInput = {
  account: AccountWithUser;
  userId: string;
  accountId: string;
  newUsedAmount: string;
  type: `${LedgerEntryType}`;
};

export type BudgetAlerter = {
  sendBudgetAlertIfNeeded: (input: SendBudgetAlertInput) => Promise<void>;
};
