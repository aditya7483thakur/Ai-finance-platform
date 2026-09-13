import { endOfMonth, startOfMonth } from "date-fns";
import { accountService } from "../account/account.service.js";
import type { AiClient } from "../../shared/integrations/ai/ai.port.js";
import { aiGeminiAdapter } from "../../shared/integrations/ai/ai.adapter.gemini.js";
import type { EmailSender } from "../../shared/integrations/email/email.port.js";
import { emailNodemailerAdapter } from "../../shared/integrations/email/email.adapter.nodemailer.js";
import { buildMonthlySummaryEmail } from "../../shared/integrations/email/email.templates.js";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import { CRON_ERROR_MESSAGES } from "./cron.constants.js";
import { getNextRecurringDate } from "./cron.helper.js";
import type {
  RunRecurringTransactionsResult,
  SendMonthlySummariesResult,
} from "./cron.types.js";
import { runInTransaction } from "../../config/prisma.js";
import { applyLedgerEntry } from "../../shared/utils/ledger.js";
import { Money } from "../../shared/utils/money.js";
import type { TransactionRepository } from "../transaction/transaction.port.js";
import { transactionPrismaRepository } from "../transaction/transaction.repository.prisma.js";
import type { AccountRepository } from "../account/account.port.js";
import { accountPrismaRepository } from "../account/account.repository.prisma.js";
import type { UserRepository } from "../user/user.port.js";
import { userPrismaRepository } from "../user/user.repository.prisma.js";

export class CronService {
  constructor(
    private readonly transactions: TransactionRepository,
    private readonly accounts: AccountRepository,
    private readonly users: UserRepository,
    private readonly ai: AiClient,
    private readonly mailer: EmailSender,
  ) {}

  async runRecurringTransactions(
    referenceDate: Date = new Date(),
  ): Promise<RunRecurringTransactionsResult> {
    const dueTransactions = await this.transactions.findDueRecurringTransactions(
      referenceDate,
    );

    for (const transaction of dueTransactions) {
      let newUsedAmount = Money.zero();

      await runInTransaction(async (tx) => {
        await this.transactions.createRecurringTransactionRecord(
          transaction,
          referenceDate,
          tx,
        );

        const account = await this.accounts.findAccountById(transaction.accountId, tx);
        if (!account) {
          throw new NotFoundError(CRON_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
        }

        const next = applyLedgerEntry(
          {
            balance: Money.fromString(account.balance),
            usedAmount: Money.fromString(account.usedAmount),
          },
          transaction.type,
          Money.fromString(transaction.amount),
        );
        newUsedAmount = next.usedAmount;

        await this.accounts.updateAccountAmounts(
          transaction.accountId,
          next.balance.toString(),
          next.usedAmount.toString(),
          tx,
        );

        if (!transaction.nextRecurringDate) {
          throw new BadRequestError(
            CRON_ERROR_MESSAGES.NEXT_RECURRING_DATE_REQUIRED,
          );
        }

        const nextRecurringDate = getNextRecurringDate(
          transaction.nextRecurringDate,
          referenceDate,
          transaction.recurringInterval,
        );

        await this.transactions.updateTransactionNextRecurringDate(
          transaction.id,
          nextRecurringDate,
          tx,
        );
      });

      const accountWithUser = await this.accounts.findAccountWithUserById(
        transaction.accountId,
      );
      if (!accountWithUser) {
        continue;
      }

      await accountService.sendBudgetAlertIfNeeded({
        account: accountWithUser,
        userId: transaction.userId,
        accountId: transaction.accountId,
        newUsedAmount: newUsedAmount.toString(),
        type: transaction.type,
      });
    }

    return {
      processedCount: dueTransactions.length,
    };
  }

  async sendMonthlySummaries(): Promise<SendMonthlySummariesResult> {
    const users = await this.users.findUsersForMonthlySummary();
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    let sentCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const user of users) {
      if (!user.email || user.email.trim() === "") {
        skippedCount += 1;
        continue;
      }

      try {
        const categoryExpenses = await this.transactions.getGroupedCategoryExpenses(
          user.id,
          firstDayOfMonth,
          lastDayOfMonth,
        );

        const formatted = categoryExpenses.map((item) => ({
          name: item.category,
          value: Money.fromString(item.amount).toNumber(),
        }));

        if (!formatted || formatted.length === 0) {
          skippedCount += 1;
          continue;
        }

        const tip = await this.ai.writeTips(formatted);
        const { subject, html } = buildMonthlySummaryEmail({
          expenses: formatted,
          month,
          year,
          tip,
        });

        await this.mailer.send({
          to: user.email,
          subject,
          html,
        });

        sentCount += 1;
      } catch {
        failedCount += 1;
      }
    }

    return {
      totalUsers: users.length,
      sentCount,
      skippedCount,
      failedCount,
    };
  }
}

export const cronService = new CronService(
  transactionPrismaRepository,
  accountPrismaRepository,
  userPrismaRepository,
  aiGeminiAdapter,
  emailNodemailerAdapter,
);
