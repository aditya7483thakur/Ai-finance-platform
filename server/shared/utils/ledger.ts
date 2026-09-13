import { LedgerEntryType, type LedgerAmounts } from "../types/ledger.js";
import type { Money } from "./money.js";

export const applyLedgerEntry = (
  current: LedgerAmounts,
  type: `${LedgerEntryType}`,
  amount: Money,
): LedgerAmounts => {
  if (type === LedgerEntryType.INCOME) {
    return {
      balance: current.balance.add(amount),
      usedAmount: current.usedAmount,
    };
  }

  return {
    balance: current.balance.subtract(amount),
    usedAmount: current.usedAmount.add(amount),
  };
};

export const reverseLedgerEntry = (
  current: LedgerAmounts,
  type: `${LedgerEntryType}`,
  amount: Money,
): LedgerAmounts => {
  if (type === LedgerEntryType.INCOME) {
    return {
      balance: current.balance.subtract(amount),
      usedAmount: current.usedAmount,
    };
  }

  return {
    balance: current.balance.add(amount),
    usedAmount: current.usedAmount.subtract(amount),
  };
};
