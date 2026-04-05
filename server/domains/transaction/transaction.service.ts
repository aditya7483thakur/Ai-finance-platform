import { Prisma, type Transaction } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import { BadRequestError, NotFoundError } from "../../shared/types/errors.js";
import checkAndSendBudgetAlert from "../../utils/checkAndSendBudgetAlert.js";
import {
  countTransactionsByFilter,
  createTransactionRecord,
  deleteTransactionById,
  deleteTransactionsByIds,
  findAccountById,
  findAccountWithUserById,
  findTransactionById,
  findTransactionsByFilter,
  findTransactionsByIds,
  updateAccountAmounts,
  updateTransactionById,
} from "./transaction.repository.js";
import { TRANSACTION_ERROR_MESSAGES } from "./transaction.constants.js";
import type {
  AiReceiptResult,
  CreateTransactionInput,
  FilteredTransactionsResult,
  ParsedTransactionFilters,
  UpdateTransactionInput,
} from "./transaction.types.js";
import prisma from "../../config/prisma.js";
import {
  ensureNotNegativeDecimal,
  getNextRecurringDate,
  parseGeminiJson,
} from "./transaction.helper.js";

export const createTransactionService = async (
  input: CreateTransactionInput,
): Promise<Transaction> => {
  const account = await findAccountWithUserById(input.accountId);

  if (!account) {
    throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  const nextRecurringDate = getNextRecurringDate(
    input.date,
    input.isRecurring,
    input.recurringInterval,
  );

  let newUsedAmount = new Prisma.Decimal(account.usedAmount);

  const createdTransaction = await prisma.$transaction(async (tx) => {
    const record = await createTransactionRecord(input, nextRecurringDate, tx);

    let newBalance = new Prisma.Decimal(account.balance);
    newUsedAmount = new Prisma.Decimal(account.usedAmount);

    if (input.type === "INCOME") {
      newBalance = newBalance.plus(input.amount);
    } else {
      newBalance = newBalance.minus(input.amount);
      newUsedAmount = newUsedAmount.plus(input.amount);
    }

    await updateAccountAmounts(input.accountId, newBalance, newUsedAmount, tx);
    return record;
  });

  await checkAndSendBudgetAlert({
    account,
    userId: input.userId,
    accountId: input.accountId,
    newUsedAmount,
    type: input.type,
  });

  return createdTransaction;
};

export const updateTransactionService = async (
  transactionId: string,
  input: UpdateTransactionInput,
): Promise<Transaction> => {
  const existingTransaction = await findTransactionById(transactionId);
  if (!existingTransaction) {
    throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
  }
  const account = await findAccountWithUserById(existingTransaction.accountId);

  if (!account) {
    throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  let newBalance = new Prisma.Decimal(account.balance);
  let newUsedAmount = new Prisma.Decimal(account.usedAmount);

  if (existingTransaction.type === "INCOME") {
    newBalance = newBalance.minus(existingTransaction.amount);
  } else {
    newBalance = newBalance.plus(existingTransaction.amount);
    newUsedAmount = newUsedAmount.minus(existingTransaction.amount);
  }

  if (input.type === "INCOME") {
    newBalance = newBalance.plus(input.amount);
  } else {
    newBalance = newBalance.minus(input.amount);
    newUsedAmount = newUsedAmount.plus(input.amount);
  }

  newUsedAmount = ensureNotNegativeDecimal(newUsedAmount);

  const nextRecurringDate = getNextRecurringDate(
    input.date,
    input.isRecurring,
    input.recurringInterval,
  );

  const updatedTransaction = await prisma.$transaction(async (tx) => {
    const record = await updateTransactionById(
      transactionId,
      input,
      nextRecurringDate,
      tx,
    );

    await updateAccountAmounts(
      existingTransaction.accountId,
      newBalance,
      newUsedAmount,
      tx,
    );
    return record;
  });

  await checkAndSendBudgetAlert({
    account,
    userId: existingTransaction.userId,
    accountId: existingTransaction.accountId,
    newUsedAmount,
    type: input.type,
  });

  return updatedTransaction;
};

export const deleteTransactionService = async (
  transactionId: string,
): Promise<void> => {
  const existingTransaction = await findTransactionById(transactionId);
  if (!existingTransaction) {
    throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
  }

  const account = await findAccountById(existingTransaction.accountId);
  if (!account) {
    throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  let newBalance = new Prisma.Decimal(account.balance);
  let newUsedAmount = new Prisma.Decimal(account.usedAmount);

  if (existingTransaction.type === "INCOME") {
    newBalance = newBalance.minus(existingTransaction.amount);
  } else {
    newBalance = newBalance.plus(existingTransaction.amount);
    newUsedAmount = newUsedAmount.minus(existingTransaction.amount);
  }

  newUsedAmount = ensureNotNegativeDecimal(newUsedAmount);

  await prisma.$transaction(async (tx) => {
    await deleteTransactionById(transactionId, tx);
    await updateAccountAmounts(
      existingTransaction.accountId,
      newBalance,
      newUsedAmount,
      tx,
    );
  });
};

export const deleteMultipleTransactionsService = async (
  transactionIds: string[],
): Promise<number> => {
  const transactions = await findTransactionsByIds(transactionIds);
  if (transactions.length !== transactionIds.length) {
    throw new NotFoundError(
      TRANSACTION_ERROR_MESSAGES.SOME_TRANSACTIONS_NOT_FOUND,
    );
  }

  const accountDeltas = new Map<
    string,
    { balanceDelta: Prisma.Decimal; usedAmountDelta: Prisma.Decimal }
  >();

  for (const txn of transactions) {
    const current = accountDeltas.get(txn.accountId) ?? {
      balanceDelta: new Prisma.Decimal(0),
      usedAmountDelta: new Prisma.Decimal(0),
    };

    if (txn.type === "INCOME") {
      current.balanceDelta = current.balanceDelta.minus(txn.amount);
    } else {
      current.balanceDelta = current.balanceDelta.plus(txn.amount);
      current.usedAmountDelta = current.usedAmountDelta.minus(txn.amount);
    }

    accountDeltas.set(txn.accountId, current);
  }

  await prisma.$transaction(async (tx) => {
    for (const [accountId, delta] of accountDeltas.entries()) {
      const account = await findAccountById(accountId, tx);
      if (!account) {
        throw new NotFoundError(TRANSACTION_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
      }

      const newBalance = new Prisma.Decimal(account.balance).plus(
        delta.balanceDelta,
      );
      const newUsedAmount = ensureNotNegativeDecimal(
        new Prisma.Decimal(account.usedAmount).plus(delta.usedAmountDelta),
      );

      await updateAccountAmounts(accountId, newBalance, newUsedAmount, tx);
    }

    await deleteTransactionsByIds(transactionIds, tx);
  });

  return transactionIds.length;
};

export const getFilteredTransactionsService = async (
  filters: ParsedTransactionFilters,
): Promise<FilteredTransactionsResult<Transaction>> => {
  const { where, page, limit } = filters;
  const totalCount = await countTransactionsByFilter(where);
  const offset = (page - 1) * limit;
  const transactions = await findTransactionsByFilter(where, offset, limit);

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
};

export const aiFormReceiptService = async (
  filePath: string,
  mimeType: string,
): Promise<AiReceiptResult> => {
  if (!process.env.GEMINI_API) {
    throw new BadRequestError(
      TRANSACTION_ERROR_MESSAGES.GEMINI_API_KEY_MISSING,
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
  const fileBuffer = await fs.readFile(filePath);
  const base64Image = fileBuffer.toString("base64");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
			You're a smart assistant that extracts fields from receipts.
			From the uploaded image, return this object:
			{
				"type": "INCOME" or "EXPENSE",
				"amount": "number as string",
				"category": "One of: SALARY, INVESTMENTS, FOOD, TRANSPORT, HOUSING, ENTERTAINMENT, TRAVEL, HEALTH, SHOPPING, MISCELLANEOUS",
				"date": "yyyy-mm-dd",
				"description": "short merchant or transaction description"
			}
			If it's not a receipt, return an empty object {}
		`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const parsed = parseGeminiJson(result.response.text().trim());
    return parsed;
  } catch (error) {
    console.error(TRANSACTION_ERROR_MESSAGES.PARSE_RECEIPT_FAILED, error);
    throw new BadRequestError(TRANSACTION_ERROR_MESSAGES.RECEIPT_PARSE_FAILED);
  } finally {
    await fs.unlink(filePath).catch(() => undefined);
  }
};
