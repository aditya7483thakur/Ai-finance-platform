import { Money } from "../../shared/utils/money.js";
import {
  buildCompleteDailySeries,
  buildDailySummaryMap,
  getDateRangeByFilter,
} from "./graph.helper.js";
import type {
  CategoryExpensesResult,
  GraphGroupedTransactionRow,
  TransactionSummaryQueryInput,
  TransactionSummaryResult,
} from "./graph.types.js";
import type { TransactionRepository } from "../transaction/transaction.port.js";
import { transactionPrismaRepository } from "../transaction/transaction.repository.prisma.js";

export class GraphService {
  constructor(private readonly transactions: TransactionRepository) {}

  async getTransactionSummary(
    input: TransactionSummaryQueryInput,
  ): Promise<TransactionSummaryResult> {
    const { startDate, endDate } = getDateRangeByFilter(input.filter);

    const rows = await this.transactions.getGroupedTransactions({
      accountId: input.accountId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    });

    const mappedRows: GraphGroupedTransactionRow[] = rows.map((row) => ({
      date: row.date,
      type: row.type,
      amount: row.amount,
    }));

    const summaryMap = buildDailySummaryMap(mappedRows);

    const summary = buildCompleteDailySeries(startDate, endDate, summaryMap);

    const totals = summary.reduce(
      (acc, day) => ({
        totalIncome: acc.totalIncome.add(Money.fromNumber(day.income)),
        totalExpense: acc.totalExpense.add(Money.fromNumber(day.expense)),
      }),
      { totalIncome: Money.zero(), totalExpense: Money.zero() },
    );

    return {
      summary,
      meta: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        count: summary.length,
        totalIncome: totals.totalIncome.toNumber(),
        totalExpense: totals.totalExpense.toNumber(),
        net: totals.totalIncome.subtract(totals.totalExpense).toNumber(),
      },
    };
  }

  async getCurrentMonthCategoryExpenses(
    userId: string,
  ): Promise<CategoryExpensesResult> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23, 59, 59, 999);

    const rows = await this.transactions.getGroupedCategoryExpenses(
      userId,
      firstDayOfMonth,
      lastDayOfMonth,
    );

    return {
      expenses: rows.map((row) => ({
        name: row.category,
        value: Money.fromString(row.amount).toNumber(),
      })),
      meta: {
        month: now.toLocaleString("default", { month: "long" }),
        year: now.getFullYear(),
        userId,
      },
    };
  }
}

export const graphService = new GraphService(transactionPrismaRepository);
