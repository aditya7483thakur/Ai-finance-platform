import { LedgerEntryType } from "../../shared/types/ledger.js";
import { Money } from "../../shared/utils/money.js";
import type {
  ShouldSendBudgetAlertInput,
  UpdateAccountData,
  UpdateAccountInput,
} from "./account.types.js";

export const canDeleteAccount = (transactionCount: number): boolean => {
  return transactionCount === 0;
};

export const mapUpdateAccountData = (
  input: UpdateAccountInput,
): UpdateAccountData => {
  const data: UpdateAccountData = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }

  if (input.budget !== undefined) {
    data.budget = input.budget;
  }

  return data;
};

export const hasUpdateAccountData = (data: UpdateAccountData): boolean => {
  return data.name !== undefined || data.budget !== undefined;
};

export const shouldSendBudgetAlert = (
  input: ShouldSendBudgetAlertInput,
): boolean => {
  if (
    input.type !== LedgerEntryType.EXPENSE ||
    !input.budget ||
    !input.email
  ) {
    return false;
  }

  const used = Money.fromString(input.usedAmount);
  const threshold = Money.fromString(input.budget).multiply("0.9");
  return !used.isLessThan(threshold);
};
