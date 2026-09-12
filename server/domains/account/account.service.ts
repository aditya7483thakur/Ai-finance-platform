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
import type {
  Account,
  CreateAccountInput,
  SendBudgetAlertInput,
  UpdateAccountInput,
} from "./account.types.js";
import type { AccountRepository } from "./account.port.js";
import { accountPrismaRepository } from "./account.repository.prisma.js";
import type { UserRepository } from "../user/user.port.js";
import { userPrismaRepository } from "../user/user.repository.prisma.js";

export class AccountService {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly users: UserRepository,
  ) {}

  async create(input: CreateAccountInput): Promise<Account> {
    const user = await this.users.findUserById(input.userId);

    if (!user) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.accounts.createAccountRecord(input);
  }

  async getSingle(accountId: string): Promise<Account> {
    const account = await this.accounts.findAccountById(accountId);

    if (!account) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    return account;
  }

  async getAll(userId: string): Promise<Account[]> {
    const user = await this.users.findUserById(userId);

    if (!user) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.accounts.findAccountsByUserId(userId);
  }

  async update(input: UpdateAccountInput): Promise<Account> {
    const existingAccount = await this.accounts.findAccountById(input.id);

    if (!existingAccount) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const data = mapUpdateAccountData(input);

    if (!hasUpdateAccountData(data)) {
      throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.UPDATE_FIELDS_REQUIRED);
    }

    return this.accounts.updateAccountById(input.id, data);
  }

  async delete(accountId: string): Promise<void> {
    const account = await this.accounts.findAccountByIdWithTransactions(accountId);

    if (!account) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    if (!canDeleteAccount(account.transactions.length)) {
      throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_HAS_TRANSACTIONS);
    }

    await this.accounts.deleteAccountById(accountId);
  }

  async sendBudgetAlertIfNeeded(input: SendBudgetAlertInput): Promise<void> {
    if (
      input.type !== "EXPENSE" ||
      !input.account.budget ||
      !input.account.user.email
    ) {
      return;
    }

    const threshold = Number(input.account.budget) * 0.9;
    if (input.newUsedAmount < threshold) {
      return;
    }

    const today = new Date();
    const alreadySent = await this.accounts.findBudgetAlertSentTodayByAccountId(
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

    await this.accounts.createBudgetAlertSentRecord(input.userId, input.accountId);
  }
}

export const accountService = new AccountService(
  accountPrismaRepository,
  userPrismaRepository,
);
