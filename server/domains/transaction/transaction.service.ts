import fs from "fs/promises";
import {
  extractReceiptDataWithGemini,
  GEMINI_API_MISSING_ERROR,
} from "../../shared/integrations/ai/gemini.js";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import { accountService } from "../account/account.service.js";
import { accountPrismaRepository } from "../account/account.repository.prisma.js";
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
import { transactionPrismaRepository } from "./transaction.repository.prisma.js";
import type { AccountRepository } from "../account/account.port.js";
import { runInTransaction } from "../../config/prisma.js";
import {
  ensureNotNegativeAmount,
  getNextRecurringDate,
  parseGeminiJson,
} from "./transaction.helper.js";

export class TransactionService {
  constructor(
    private readonly transactions: TransactionRepository,
    private readonly accounts: AccountRepository,
  ) {}

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const account = await this.accounts.findAccountWithUserById(input.accountId);

    if (!account) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const nextRecurringDate = getNextRecurringDate(
      input.date,
      input.isRecurring,
      input.recurringInterval,
    );

    let newUsedAmount = Number(account.usedAmount);

    const createdTransaction = await runInTransaction(async (tx) => {
      const record = await this.transactions.createTransactionRecord(
        input,
        nextRecurringDate,
        tx,
      );

      let newBalance = Number(account.balance);
      newUsedAmount = Number(account.usedAmount);

      if (input.type === "INCOME") {
        newBalance += input.amount;
      } else {
        newBalance -= input.amount;
        newUsedAmount += input.amount;
      }

      await this.accounts.updateAccountAmounts(
        input.accountId,
        String(newBalance),
        String(newUsedAmount),
        tx,
      );
      return record;
    });

    await accountService.sendBudgetAlertIfNeeded({
      account,
      userId: input.userId,
      accountId: input.accountId,
      newUsedAmount,
      type: input.type,
    });

    return createdTransaction;
  }

  async update(
    transactionId: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactions.findTransactionById(
      transactionId,
    );
    if (!existingTransaction) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
    }
    const account = await this.accounts.findAccountWithUserById(
      existingTransaction.accountId,
    );

    if (!account) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    let newBalance = Number(account.balance);
    let newUsedAmount = Number(account.usedAmount);
    const existingAmount = Number(existingTransaction.amount);

    if (existingTransaction.type === "INCOME") {
      newBalance -= existingAmount;
    } else {
      newBalance += existingAmount;
      newUsedAmount -= existingAmount;
    }

    if (input.type === "INCOME") {
      newBalance += input.amount;
    } else {
      newBalance -= input.amount;
      newUsedAmount += input.amount;
    }

    newUsedAmount = ensureNotNegativeAmount(newUsedAmount);

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
        String(newBalance),
        String(newUsedAmount),
        tx,
      );
      return record;
    });

    await accountService.sendBudgetAlertIfNeeded({
      account,
      userId: existingTransaction.userId,
      accountId: existingTransaction.accountId,
      newUsedAmount,
      type: input.type,
    });

    return updatedTransaction;
  }

  async delete(transactionId: string): Promise<void> {
    const existingTransaction = await this.transactions.findTransactionById(
      transactionId,
    );
    if (!existingTransaction) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
    }

    const account = await this.accounts.findAccountById(
      existingTransaction.accountId,
    );
    if (!account) {
      throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    let newBalance = Number(account.balance);
    let newUsedAmount = Number(account.usedAmount);
    const existingAmount = Number(existingTransaction.amount);

    if (existingTransaction.type === "INCOME") {
      newBalance -= existingAmount;
    } else {
      newBalance += existingAmount;
      newUsedAmount -= existingAmount;
    }

    newUsedAmount = ensureNotNegativeAmount(newUsedAmount);

    await runInTransaction(async (tx) => {
      await this.transactions.deleteTransactionById(transactionId, tx);
      await this.accounts.updateAccountAmounts(
        existingTransaction.accountId,
        String(newBalance),
        String(newUsedAmount),
        tx,
      );
    });
  }

  async deleteMany(transactionIds: string[]): Promise<number> {
    const transactions = await this.transactions.findTransactionsByIds(
      transactionIds,
    );
    if (transactions.length !== transactionIds.length) {
      throw new NotFoundError(
        TRANSACTION_ERROR_MESSAGES.SOME_TRANSACTIONS_NOT_FOUND,
      );
    }

    const accountDeltas = new Map<
      string,
      { balanceDelta: number; usedAmountDelta: number }
    >();

    for (const txn of transactions) {
      const current = accountDeltas.get(txn.accountId) ?? {
        balanceDelta: 0,
        usedAmountDelta: 0,
      };
      const amount = Number(txn.amount);

      if (txn.type === "INCOME") {
        current.balanceDelta -= amount;
      } else {
        current.balanceDelta += amount;
        current.usedAmountDelta -= amount;
      }

      accountDeltas.set(txn.accountId, current);
    }

    await runInTransaction(async (tx) => {
      for (const [accountId, delta] of accountDeltas.entries()) {
        const account = await this.accounts.findAccountById(accountId, tx);
        if (!account) {
          throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
        }

        const newBalance = Number(account.balance) + delta.balanceDelta;
        const newUsedAmount = ensureNotNegativeAmount(
          Number(account.usedAmount) + delta.usedAmountDelta,
        );

        await this.accounts.updateAccountAmounts(
          accountId,
          String(newBalance),
          String(newUsedAmount),
          tx,
        );
      }

      await this.transactions.deleteTransactionsByIds(transactionIds, tx);
    });

    return transactionIds.length;
  }

  async getFiltered(
    filters: ParsedTransactionFilters,
  ): Promise<FilteredTransactionsResult<Transaction>> {
    const { filter, page, limit } = filters;
    const totalCount = await this.transactions.countTransactionsByFilter(filter);
    const offset = (page - 1) * limit;
    const transactions = await this.transactions.findTransactionsByFilter(
      filter,
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
      const extractedText = await extractReceiptDataWithGemini(
        mimeType,
        base64Image,
      );
      const parsed = parseGeminiJson(extractedText);
      return parsed;
    } catch (error) {
      if (error instanceof Error && error.message === GEMINI_API_MISSING_ERROR) {
        throw new BadRequestError(
          TRANSACTION_ERROR_MESSAGES.GEMINI_API_KEY_MISSING,
        );
      }

      console.error(TRANSACTION_ERROR_MESSAGES.PARSE_RECEIPT_FAILED, error);
      throw new BadRequestError(TRANSACTION_ERROR_MESSAGES.RECEIPT_PARSE_FAILED);
    } finally {
      await fs.unlink(filePath).catch(() => undefined);
    }
  }
}

export const transactionService = new TransactionService(
  transactionPrismaRepository,
  accountPrismaRepository,
);
