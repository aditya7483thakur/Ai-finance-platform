import { Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { accountService } from "../account/account.service.js";
import { sendEmail } from "../../shared/integrations/email/sendEmail.js";
import { generateFinancialTipWithGemini } from "../../shared/integrations/ai/gemini.js";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import { CRON_ERROR_MESSAGES } from "./cron.constants.js";
import {
  buildMonthlySummaryHtml,
  getNextRecurringDate,
} from "./cron.helper.js";
import type {
  RunRecurringTransactionsResult,
  SendMonthlySummariesResult,
} from "./cron.types.js";
import { runInTransaction } from "../../config/prisma.js";
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
  ) {}

  async runRecurringTransactions(
    referenceDate: Date = new Date(),
  ): Promise<RunRecurringTransactionsResult> {
    const dueTransactions = await this.transactions.findDueRecurringTransactions(
      referenceDate,
    );

    for (const transaction of dueTransactions) {
      let newUsedAmount = new Prisma.Decimal(0);

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

        let newBalance = new Prisma.Decimal(account.balance);
        newUsedAmount = new Prisma.Decimal(account.usedAmount);

        if (transaction.type === "INCOME") {
          newBalance = newBalance.plus(transaction.amount);
        } else {
          newBalance = newBalance.minus(transaction.amount);
          newUsedAmount = newUsedAmount.plus(transaction.amount);
        }

        await this.accounts.updateAccountAmounts(
          transaction.accountId,
          newBalance,
          newUsedAmount,
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
        newUsedAmount,
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
          value: Number(item._sum.amount),
        }));

        if (!formatted || formatted.length === 0) {
          skippedCount += 1;
          continue;
        }

        const tip = await generateFinancialTipWithGemini(formatted);
        const html = buildMonthlySummaryHtml(formatted, month, year, tip);

        await sendEmail({
          to: user.email,
          subject: `Your ${month} Summary + Tip from Budgetly`,
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
);
