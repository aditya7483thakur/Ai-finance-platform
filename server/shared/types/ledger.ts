import type { Money } from "../utils/money.js";

export enum LedgerEntryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export type LedgerAmounts = {
  balance: Money;
  usedAmount: Money;
};
