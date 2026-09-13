import { LedgerEntryType } from "../../shared/types/ledger.js";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import { Money } from "../../shared/utils/money.js";
import type { EmailSender } from "../../shared/integrations/email/email.port.js";
import { emailNodemailerAdapter } from "../../shared/integrations/email/email.adapter.nodemailer.js";
import { buildBudgetAlertEmail } from "../../shared/integrations/email/email.templates.js";
import { ACCOUNT_ERROR_MESSAGES } from "./account.constants.js";
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
    private readonly mailer: EmailSender,
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
      input.type !== LedgerEntryType.EXPENSE ||
      !input.account.budget ||
      !input.account.user.email
    ) {
      return;
    }

    const used = Money.fromString(input.newUsedAmount);
    const threshold = Money.fromString(input.account.budget).multiply("0.9");
    if (used.isLessThan(threshold)) {
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
}

export const accountService = new AccountService(
  accountPrismaRepository,
  userPrismaRepository,
  emailNodemailerAdapter,
);
