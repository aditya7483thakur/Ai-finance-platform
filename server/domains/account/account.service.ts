import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import type { EmailSender } from "../../shared/integrations/email/email.port.js";
import { buildBudgetAlertEmail } from "../../shared/integrations/email/email.templates.js";
import { ACCOUNT_ERROR_MESSAGES } from "./account.constants.js";
import {
  canDeleteAccount,
  hasUpdateAccountData,
  mapUpdateAccountData,
  shouldSendBudgetAlert,
} from "./account.helper.js";
import type {
  Account,
  CreateAccountInput,
  SendBudgetAlertInput,
  UpdateAccountInput,
} from "./account.types.js";
import type { AccountRepository } from "./account.port.js";
import type { UserRepository } from "../user/user.port.js";

export class AccountService {
  constructor(
    private readonly accounts: AccountRepository,
    private readonly users: UserRepository,
    private readonly mailer: EmailSender,
  ) {}

  async create(input: CreateAccountInput): Promise<Account> {
    const user = await this.users.findUserById(input.userId);

    if (!user) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.accounts.createAccountRecord(input);
  }

  async getSingle(accountId: string, userId: string): Promise<Account> {
    const account = await this.requireOwnedAccount(accountId, userId);
    return account;
  }

  async getAll(userId: string): Promise<Account[]> {
    const user = await this.users.findUserById(userId);

    if (!user) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.accounts.findAccountsByUserId(userId);
  }

  async update(input: UpdateAccountInput, userId: string): Promise<Account> {
    await this.requireOwnedAccount(input.id, userId);

    const data = mapUpdateAccountData(input);

    if (!hasUpdateAccountData(data)) {
      throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.UPDATE_FIELDS_REQUIRED);
    }

    return this.accounts.updateAccountById(input.id, data);
  }

  async delete(accountId: string, userId: string): Promise<void> {
    const account = await this.accounts.findAccountByIdWithTransactions(accountId);

    if (!account || account.userId !== userId) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    if (!canDeleteAccount(account.transactions.length)) {
      throw new BadRequestError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_HAS_TRANSACTIONS);
    }

    await this.accounts.deleteAccountById(accountId);
  }

  async sendBudgetAlertIfNeeded(input: SendBudgetAlertInput): Promise<void> {
    if (
      !shouldSendBudgetAlert({
        type: input.type,
        budget: input.account.budget,
        email: input.account.user.email,
        usedAmount: input.newUsedAmount,
      })
    ) {
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

    const { subject, html } = buildBudgetAlertEmail({
      userName: input.account.user.name,
      accountName: input.account.name,
    });

    await this.mailer.send({
      to: input.account.user.email,
      subject,
      html,
    });

    await this.accounts.createBudgetAlertSentRecord(input.userId, input.accountId);
  }

  private async requireOwnedAccount(
    accountId: string,
    userId: string,
  ): Promise<Account> {
    const account = await this.accounts.findAccountById(accountId);

    if (!account || account.userId !== userId) {
      throw new NotFoundError(ACCOUNT_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    return account;
  }
}
