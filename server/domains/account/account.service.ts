import { Prisma, type Account } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import { sendEmail } from "../../shared/integrations/email/sendEmail.js";
import {
  ACCOUNT_BUDGET_ALERT,
  ACCOUNT_ERROR_MESSAGES,
} from "./account.constants.js";
import {
  canDeleteAccount,
  hasUpdateAccountData,
  mapUpdateAccountData,
} from "./account.helper.js";
import {
  createBudgetAlertSentRecord,
  createAccountRecord,
  deleteAccountById,
  findBudgetAlertSentTodayByAccountId,
  findAccountById,
  findAccountByIdWithTransactions,
  findAccountsByUserId,
  findUserById,
  updateAccountById,
} from "./account.repository.js";
import type {
  CreateAccountInput,
  SendBudgetAlertInput,
  UpdateAccountInput,
} from "./account.types.js";

export const createAccountService = async (
  input: CreateAccountInput,
): Promise<Account> => {
  const user = await findUserById(input.userId);

  if (!user) {
    throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return createAccountRecord(input);
};

export const getSingleAccountService = async (
  accountId: string,
): Promise<Account> => {
  const account = await findAccountById(accountId);

  if (!account) {
    throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  return account;
};

export const getAllAccountsService = async (
  userId: string,
): Promise<Account[]> => {
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return findAccountsByUserId(userId);
};

export const updateAccountService = async (
  input: UpdateAccountInput,
): Promise<Account> => {
  const existingAccount = await findAccountById(input.id);

  if (!existingAccount) {
    throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  const data = mapUpdateAccountData(input);

  if (!hasUpdateAccountData(data)) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.UPDATE_FIELDS_REQUIRED);
  }

  return updateAccountById(input.id, data);
};

export const deleteAccountService = async (
  accountId: string,
): Promise<void> => {
  const account = await findAccountByIdWithTransactions(accountId);

  if (!account) {
    throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  if (!canDeleteAccount(account.transactions.length)) {
    throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_HAS_TRANSACTIONS);
  }

  await deleteAccountById(accountId);
};

export const sendBudgetAlertIfNeededService = async (
  input: SendBudgetAlertInput,
): Promise<void> => {
  if (
    input.type !== "EXPENSE" ||
    !input.account.budget ||
    !input.account.user.email
  ) {
    return;
  }

  const threshold = new Prisma.Decimal(input.account.budget).mul(0.9);
  if (!input.newUsedAmount.gte(threshold)) {
    return;
  }

  const today = new Date();
  const alreadySent = await findBudgetAlertSentTodayByAccountId(
    input.accountId,
    today,
  );
  if (alreadySent) {
    return;
  }

  await sendEmail({
    to: input.account.user.email,
    subject: `${ACCOUNT_BUDGET_ALERT.SUBJECT_PREFIX} ${input.account.name}`,
    html: `Hi ${
      input.account.user.name || "there"
    },<br/><br/>You've used over 90% of your budget for <strong>${
      input.account.name
    }</strong>.<br/>Try to hold back a bit to avoid going over!`,
  });

  await createBudgetAlertSentRecord(input.userId, input.accountId);
};
