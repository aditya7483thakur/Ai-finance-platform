import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import AccountTransaction from "@/components/custom/AccountTransaction";
import TransactionGraph from "@/components/custom/TransactionGraph";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetSingleAccount } from "@/services/accounts/query";
import { useFilteredTransactions } from "@/services/transactions/query";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import {
  balanceToneClass,
  formatMoney,
  formatSignedMoney,
  toAmount,
} from "@/lib/money";
import { getCategoryLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Plus, Sparkles, TriangleAlert } from "lucide-react";
import { Transaction as TransactionRecord } from "@/types";

const Transaction = () => {
  const { accountId } = useParams();
  const openAsk = useAskBudgetly();
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const { data: account, isPending } = useGetSingleAccount(accountId);
  const { data: ledger } = useFilteredTransactions({
    accountId,
    page: 1,
    limit: 200,
  });

  const accountData = account?.data;
  const balance = toAmount(accountData?.balance);
  const budget = toAmount(accountData?.budget);
  const used = toAmount(accountData?.usedAmount);
  const hasBudget = Boolean(accountData?.budget);
  const accountName = accountData?.name || "Account";

  const totals = useMemo(() => {
    const rows: TransactionRecord[] = ledger?.data ?? [];
    const knownCount = ledger?.pagination?.totalTransactions ?? rows.length;
    const complete = knownCount <= rows.length;

    if (!complete) {
      return {
        complete: false,
        income: null as number | null,
        expenses: used,
        opening: null as number | null,
      };
    }

    const income = rows.reduce(
      (sum, row) =>
        row.type === "INCOME" ? sum + toAmount(row.amount) : sum,
      0,
    );
    const expenses = rows.reduce(
      (sum, row) =>
        row.type === "EXPENSE" ? sum + toAmount(row.amount) : sum,
      0,
    );

    return {
      complete: true,
      income,
      expenses: knownCount === 0 ? used : expenses,
      opening: balance - income + expenses,
    };
  }, [ledger, balance, used]);

  const insight = useMemo(() => {
    const rows: TransactionRecord[] = ledger?.data ?? [];
    const now = new Date();
    const monthExpenses = rows.filter((row) => {
      if (row.type !== "EXPENSE") return false;
      const date = new Date(row.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    if (!monthExpenses.length) {
      return null;
    }

    const grouped = monthExpenses.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.category] = (acc[row.category] ?? 0) + toAmount(row.amount);
        return acc;
      },
      {},
    );

    const [category, amount] = Object.entries(grouped).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

    if (!category || amount <= 0 || total <= 0) {
      return null;
    }

    return { category, amount, total };
  }, [ledger?.data]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
        ) : (
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                {accountName}
              </h2>
              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                Current balance
              </p>
              <p
                className={cn(
                  "mt-1 text-4xl font-semibold tracking-tight",
                  balanceToneClass(balance),
                )}
              >
                {formatMoney(balance)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {totalTransactions === 1
                  ? "1 transaction"
                  : `${totalTransactions} transactions`}
              </p>
            </div>
            <Button size="sm" asChild>
              <Link to="/dashboard/add-transaction">
                <Plus className="size-4" aria-hidden />
                Add Transaction
              </Link>
            </Button>
          </header>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              openAsk(`Analyze this account: ${accountName}`)
            }
            className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-900 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai"
          >
            Analyze this account
          </button>
          <button
            type="button"
            onClick={() =>
              openAsk(`Simulate a transaction in ${accountName}`)
            }
            className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-900 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai"
          >
            Simulate a transaction
          </button>
          <button
            type="button"
            onClick={() =>
              openAsk(`Explain my spending in ${accountName}`)
            }
            className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-900 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai"
          >
            Explain my spending
          </button>
        </div>

        {!isPending && balance < 0 && (
          <section className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm font-medium text-red-800">
              <TriangleAlert className="size-4" aria-hidden />
              Account is below zero
            </p>
            <p className="text-sm text-slate-600">
              Current balance{" "}
              <span className={balanceToneClass(balance)}>
                {formatMoney(balance)}
              </span>
            </p>
          </section>
        )}

        {!isPending && (
          <section className="grid grid-cols-2 gap-6 lg:grid-cols-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current Balance
              </p>
              <p className={cn("mt-1 text-xl font-semibold", balanceToneClass(balance))}>
                {formatMoney(balance)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Opening Balance
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {totals.opening == null ? "—" : formatMoney(totals.opening)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Income
              </p>
              <p className="mt-1 text-xl font-semibold text-green-600">
                {totals.income == null
                  ? "—"
                  : formatSignedMoney(totals.income, "INCOME")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Expenses
              </p>
              <p className="mt-1 text-xl font-semibold text-red-600">
                {formatSignedMoney(totals.expenses, "EXPENSE")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Budget Remaining
              </p>
              <p
                className={cn(
                  "mt-1 text-xl font-semibold",
                  hasBudget && budget - used < 0
                    ? "text-red-600"
                    : "text-slate-900",
                )}
              >
                {hasBudget ? formatMoney(budget - used) : "No budget"}
              </p>
            </div>
          </section>
        )}

        {insight && (
          <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-indigo-950">
              <Sparkles className="size-4 text-ai" aria-hidden />
              Budgetly Insight
            </p>
            <p className="mt-2 text-sm text-indigo-900">
              Most of your spending this month has been in{" "}
              {getCategoryLabel(insight.category)}.
            </p>
            <p className="mt-1 text-xs text-indigo-800/80">
              {formatMoney(insight.amount)} of {formatMoney(insight.total)} total
              expenses.
            </p>
            <button
              type="button"
              onClick={() =>
                openAsk(
                  `Why is ${getCategoryLabel(insight.category)} my largest expense in ${accountName} this month?`,
                )
              }
              className="mt-3 text-sm font-medium text-ai hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai"
            >
              Ask Budgetly about this →
            </button>
          </section>
        )}

        {isPending ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <TransactionGraph currentBalance={balance} />
        )}

        <AccountTransaction setTotalTransactions={setTotalTransactions} />
      </div>
    </div>
  );
};

export default Transaction;
