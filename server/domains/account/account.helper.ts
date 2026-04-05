import { Prisma } from "@prisma/client";
import type { UpdateAccountData, UpdateAccountInput } from "./account.types.js";

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
    data.budget =
      input.budget === null ? null : new Prisma.Decimal(input.budget);
  }

  return data;
};

export const hasUpdateAccountData = (data: UpdateAccountData): boolean => {
  return data.name !== undefined || data.budget !== undefined;
};
