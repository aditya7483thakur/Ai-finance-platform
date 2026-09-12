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
      amount: Number(row.amount),
    }));

    const summaryMap = buildDailySummaryMap(mappedRows);

    const summary = buildCompleteDailySeries(startDate, endDate, summaryMap);

    const totals = summary.reduce(
      (acc, day) => {
        acc.totalIncome += day.income;
        acc.totalExpense += day.expense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 },
    );

    return {
      summary,
      meta: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        count: summary.length,
        totalIncome: totals.totalIncome,
        totalExpense: totals.totalExpense,
        net: totals.totalIncome - totals.totalExpense,
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
        value: Number(row.amount),
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
