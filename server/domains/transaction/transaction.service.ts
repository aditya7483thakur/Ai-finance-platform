import fs from "fs/promises";
import type { AiClient } from "../../shared/integrations/ai/ai.port.js";
import { AI_API_MISSING_ERROR } from "../../shared/integrations/ai/ai.types.js";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import type { BudgetAlerter } from "../account/account.types.js";
import { TRANSACTION_ERROR_MESSAGES } from "./transaction.constants.js";
import type {
  AiReceiptResult,
  CreateTransactionInput,
  FilteredTransactionsResult,
  ParsedTransactionFilters,
  Transaction,
  UpdateTransactionInput,
} from "./transaction.types.js";
import type { TransactionRepository } from "./transaction.port.js";
import type { AccountRepository } from "../account/account.port.js";
import { runInTransaction } from "../../config/prisma.js";
import {
  applyLedgerEntry,
  reverseLedgerEntry,
} from "../../shared/utils/ledger.js";
import { Money } from "../../shared/utils/money.js";
import { getNextRecurringDate } from "./transaction.helper.js";

export class TransactionService {
  constructor(
    private readonly transactions: TransactionRepository,
    private readonly accounts: AccountRepository,
    private readonly ai: AiClient,
    private readonly budgetAlerter: BudgetAlerter,
  ) {}

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const account = await this.accounts.findAccountWithUserById(input.accountId);

    if (!account || account.userId !== input.userId) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const nextRecurringDate = getNextRecurringDate(
      input.date,
      input.isRecurring,
      input.recurringInterval,
    );

    let newUsedAmount = Money.fromString(account.usedAmount);

    const createdTransaction = await runInTransaction(async (tx) => {
      const record = await this.transactions.createTransactionRecord(
        input,
        nextRecurringDate,
        tx,
      );

      const next = applyLedgerEntry(
        {
          balance: Money.fromString(account.balance),
          usedAmount: Money.fromString(account.usedAmount),
        },
        input.type,
        Money.fromNumber(input.amount),
      );
      newUsedAmount = next.usedAmount;

      await this.accounts.updateAccountAmounts(
        input.accountId,
        next.balance.toString(),
        next.usedAmount.toString(),
        tx,
      );
      return record;
    });

    await this.budgetAlerter.sendBudgetAlertIfNeeded({
      account,
      userId: input.userId,
      accountId: input.accountId,
      newUsedAmount: newUsedAmount.toString(),
      type: input.type,
    });

    return createdTransaction;
  }

  async update(
    transactionId: string,
    input: UpdateTransactionInput,
    userId: string,
  ): Promise<Transaction> {
    const existingTransaction = await this.requireOwnedTransaction(
      transactionId,
      userId,
    );
    const account = await this.accounts.findAccountWithUserById(
      existingTransaction.accountId,
    );

    if (!account) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const undone = reverseLedgerEntry(
      {
        balance: Money.fromString(account.balance),
        usedAmount: Money.fromString(account.usedAmount),
      },
      existingTransaction.type,
      Money.fromString(existingTransaction.amount),
    );
    const next = applyLedgerEntry(
      undone,
      input.type,
      Money.fromNumber(input.amount),
    );
    const newBalance = next.balance;
    const newUsedAmount = next.usedAmount.clampNonNegative();

    const nextRecurringDate = getNextRecurringDate(
      input.date,
      input.isRecurring,
      input.recurringInterval,
    );

    const updatedTransaction = await runInTransaction(async (tx) => {
      const record = await this.transactions.updateTransactionById(
        transactionId,
        input,
        nextRecurringDate,
        tx,
      );

      await this.accounts.updateAccountAmounts(
        existingTransaction.accountId,
        newBalance.toString(),
        newUsedAmount.toString(),
        tx,
      );
      return record;
    });

    await this.budgetAlerter.sendBudgetAlertIfNeeded({
      account,
      userId: existingTransaction.userId,
      accountId: existingTransaction.accountId,
      newUsedAmount: newUsedAmount.toString(),
      type: input.type,
    });

    return updatedTransaction;
  }

  async delete(transactionId: string, userId: string): Promise<void> {
    const existingTransaction = await this.requireOwnedTransaction(
      transactionId,
      userId,
    );

    const account = await this.accounts.findAccountById(
      existingTransaction.accountId,
    );
    if (!account) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const next = reverseLedgerEntry(
      {
        balance: Money.fromString(account.balance),
        usedAmount: Money.fromString(account.usedAmount),
      },
      existingTransaction.type,
      Money.fromString(existingTransaction.amount),
    );
    const newBalance = next.balance;
    const newUsedAmount = next.usedAmount.clampNonNegative();

    await runInTransaction(async (tx) => {
      await this.transactions.deleteTransactionById(transactionId, tx);
      await this.accounts.updateAccountAmounts(
        existingTransaction.accountId,
        newBalance.toString(),
        newUsedAmount.toString(),
        tx,
      );
    });
  }

  async deleteMany(transactionIds: string[], userId: string): Promise<number> {
    const transactions = await this.transactions.findTransactionsByIds(
      transactionIds,
    );
    if (
      transactions.length !== transactionIds.length ||
      transactions.some((txn) => txn.userId !== userId)
    ) {
      throw new NotFoundError(
        TRANSACTION_ERROR_MESSAGES.SOME_TRANSACTIONS_NOT_FOUND,
      );
    }

    const accountDeltas = new Map<
      string,
      { balance: Money; usedAmount: Money }
    >();

    for (const txn of transactions) {
      const current = accountDeltas.get(txn.accountId) ?? {
        balance: Money.zero(),
        usedAmount: Money.zero(),
      };

      accountDeltas.set(
        txn.accountId,
        reverseLedgerEntry(current, txn.type, Money.fromString(txn.amount)),
      );
    }

    await runInTransaction(async (tx) => {
      for (const [accountId, delta] of accountDeltas.entries()) {
        const account = await this.accounts.findAccountById(accountId, tx);
        if (!account) {
          throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
        }

        const newBalance = Money.fromString(account.balance).add(delta.balance);
        const newUsedAmount = Money.fromString(account.usedAmount)
          .add(delta.usedAmount)
          .clampNonNegative();

        await this.accounts.updateAccountAmounts(
          accountId,
          newBalance.toString(),
          newUsedAmount.toString(),
          tx,
        );
      }

      await this.transactions.deleteTransactionsByIds(transactionIds, tx);
    });

    return transactionIds.length;
  }

  async getFiltered(
    filters: ParsedTransactionFilters,
    userId: string,
  ): Promise<FilteredTransactionsResult<Transaction>> {
    const { filter, page, limit } = filters;

    if (filter.accountId) {
      const account = await this.accounts.findAccountById(filter.accountId);
      if (!account || account.userId !== userId) {
        throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
      }
    }

    const scopedFilter = { ...filter, userId };
    const totalCount = await this.transactions.countTransactionsByFilter(
      scopedFilter,
    );
    const offset = (page - 1) * limit;
    const transactions = await this.transactions.findTransactionsByFilter(
      scopedFilter,
      offset,
      limit,
    );

    return {
      transactions,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTransactions: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    };
  }

  async aiFormReceipt(filePath: string, mimeType: string): Promise<AiReceiptResult> {
    const fileBuffer = await fs.readFile(filePath);
    const base64Image = fileBuffer.toString("base64");

    try {
      return this.ai.extractReceipt({
        mimeType,
        base64Image,
      });
    } catch (error) {
      if (error instanceof Error && error.message === AI_API_MISSING_ERROR) {
        throw new BadRequestError(
          TRANSACTION_ERROR_MESSAGES.AI_API_KEY_MISSING,
        );
      }

      console.error(TRANSACTION_ERROR_MESSAGES.PARSE_RECEIPT_FAILED, error);
      throw new BadRequestError(TRANSACTION_ERROR_MESSAGES.RECEIPT_PARSE_FAILED);
    } finally {
      await fs.unlink(filePath).catch(() => undefined);
    }
  }

  private async requireOwnedTransaction(
    transactionId: string,
    userId: string,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactions.findTransactionById(
      transactionId,
    );
    if (!existingTransaction || existingTransaction.userId !== userId) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
    }

    return existingTransaction;
  }
}
