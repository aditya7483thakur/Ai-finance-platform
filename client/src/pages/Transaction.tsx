import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import AccountTransaction from "@/components/custom/AccountTransaction";
import TransactionGraph from "@/components/custom/TransactionGraph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useFilteredTransactions } from "@/services/transactions/query";
import { dashControl, dashSelect } from "@/lib/dashboard-chrome";
import { CATEGORIES, getCategoryLabel } from "@/lib/categories";
import { formatMoney, formatSignedMoney, toAmount } from "@/lib/money";
import { cn } from "@/lib/utils";
import { AccountType, Transaction as TransactionRecord } from "@/types";
import {
  ArrowLeftRight,
  Plus,
  Repeat,
  ScanLine,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

type TypeFilter = "ALL" | "INCOME" | "EXPENSE";
type RecurringFilter = "ALL" | "true" | "false";

const isSameMonth = (value: string | Date, now = new Date()) => {
  const date = new Date(value);
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const Transaction = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountId = searchParams.get("accountId");
  const { userId } = useUserContext();
  const openAsk = useAskBudgetly();
  const { data: accountsData, isPending: accountsLoading } =
    useGetAllAccounts(userId);
  const accounts = (accountsData?.data ?? []) as AccountType[];

  const [description, setDescription] = useState("");
  const [appliedDescription, setAppliedDescription] = useState("");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [category, setCategory] = useState("ALL");
  const [isRecurring, setIsRecurring] = useState<RecurringFilter>("ALL");

  useEffect(() => {
    if (accountsLoading || !accountId) {
      return;
    }
    if (!accounts.some((account) => account.id === accountId)) {
      setSearchParams({}, { replace: true });
    }
  }, [accountId, accounts, accountsLoading, setSearchParams]);

  const selectedAccount = accounts.find((account) => account.id === accountId);
  const setAccountId = (nextId: string) => {
    const next = new URLSearchParams(searchParams);
    if (!nextId || nextId === "ALL") {
      next.delete("accountId");
    } else {
      next.set("accountId", nextId);
    }
    setSearchParams(next, { replace: true });
  };

  const listFilters = useMemo(
    () => ({
      ...(accountId ? { accountId } : {}),
      ...(appliedDescription ? { description: appliedDescription } : {}),
      type,
      category,
      isRecurring,
    }),
    [accountId, appliedDescription, category, isRecurring, type],
  );

  const { data: ledger } = useFilteredTransactions(
    { ...listFilters, page: 1, limit: 200 },
    { enabled: Boolean(userId) },
  );

  const monthRows: TransactionRecord[] = useMemo(() => {
    const rows: TransactionRecord[] = ledger?.data ?? [];
    return rows.filter((row) => isSameMonth(row.date));
  }, [ledger?.data]);

  const totals = useMemo(() => {
    const knownCount = ledger?.pagination?.totalTransactions ?? monthRows.length;
    const complete = knownCount <= (ledger?.data?.length ?? 0);

    const income = monthRows.reduce(
      (sum, row) =>
        row.type === "INCOME" ? sum + toAmount(row.amount) : sum,
      0,
    );
    const expenses = monthRows.reduce(
      (sum, row) =>
        row.type === "EXPENSE" ? sum + toAmount(row.amount) : sum,
      0,
    );

    return {
      complete,
      income,
      expenses,
      net: income - expenses,
    };
  }, [ledger, monthRows]);

  const insight = useMemo(() => {
    const expenses = monthRows.filter((row) => row.type === "EXPENSE");
    if (!expenses.length) {
      return null;
    }

    const grouped = expenses.reduce<Record<string, number>>((acc, row) => {
      acc[row.category] = (acc[row.category] ?? 0) + toAmount(row.amount);
      return acc;
    }, {});

    const [topCategory, amount] = Object.entries(grouped).sort(
      (left, right) => right[1] - left[1],
    )[0];
    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

    if (!topCategory || amount <= 0 || total <= 0) {
      return null;
    }

    return {
      category: topCategory,
      amount,
      share: Math.round((amount / total) * 100),
    };
  }, [monthRows]);

  const applySearch = () => {
    setAppliedDescription(description.trim());
  };

  const quickFilter =
    type === "INCOME"
      ? "income"
      : type === "EXPENSE"
        ? "expense"
        : isRecurring === "true"
          ? "recurring"
          : isRecurring === "false"
            ? "one-time"
            : "all";

  const setQuickFilter = (next: typeof quickFilter) => {
    if (next === "all") {
      setType("ALL");
      setIsRecurring("ALL");
      return;
    }
    if (next === "income") {
      setType("INCOME");
      return;
    }
    if (next === "expense") {
      setType("EXPENSE");
      return;
    }
    if (next === "recurring") {
      setIsRecurring("true");
      return;
    }
    setIsRecurring("false");
  };

  const balance = toAmount(selectedAccount?.balance);
  const budget = toAmount(selectedAccount?.budget);
  const used = toAmount(selectedAccount?.usedAmount);
  const hasBudget = Boolean(selectedAccount?.budget);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 lg:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Transactions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedAccount
                ? `Activity in ${selectedAccount.name}.`
                : "Track and manage all your financial activity."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className={dashControl} asChild>
              <Link to="/dashboard/add-transaction">
                <ScanLine className="size-4" aria-hidden />
                Scan receipt
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard/add-transaction">
                <Plus className="size-4" aria-hidden />
                Add Transaction
              </Link>
            </Button>
          </div>
        </header>

        {selectedAccount && balance < 0 && (
          <section className="flex flex-col gap-2 rounded-xl border border-error/30 bg-error/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm font-medium text-error">
              <TriangleAlert className="size-4" aria-hidden />
              {selectedAccount.name} is below zero
            </p>
            <p className="text-sm text-muted-foreground">
              Current balance {formatMoney(balance)}
            </p>
          </section>
        )}

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="dash-kpi pointer-events-none">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-white/5 text-cyan-300">
                <TrendingUp className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Income this month</p>
                <p className="mt-1 text-2xl font-semibold text-success">
                  {formatSignedMoney(totals.income, "INCOME")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totals.complete
                    ? selectedAccount
                      ? selectedAccount.name
                      : "All accounts"
                    : "Based on recent transactions"}
                </p>
              </div>
            </div>
          </article>
          <article className="dash-kpi pointer-events-none">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-rose-400/30 bg-white/5 text-rose-300">
                <TrendingDown className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Expenses this month
                </p>
                <p className="mt-1 text-2xl font-semibold text-error">
                  {formatSignedMoney(totals.expenses, "EXPENSE")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {hasBudget
                    ? `${formatMoney(used)} of ${formatMoney(budget)} budget used`
                    : "From recorded expenses"}
                </p>
              </div>
            </div>
          </article>
          <article className="dash-kpi pointer-events-none">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-violet-400/30 bg-white/5 text-violet-300">
                <ArrowLeftRight className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Net cash flow</p>
                <p
                  className={cn(
                    "mt-1 text-2xl font-semibold",
                    totals.net >= 0 ? "text-success" : "text-error",
                  )}
                >
                  {formatMoney(totals.net)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Income minus expenses this month
                </p>
              </div>
            </div>
          </article>
          <article className="dash-kpi pointer-events-none">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border border-violet-400/30 bg-white/5 text-violet-300">
                <Sparkles className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Budgetly insight</p>
                {insight ? (
                  <>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {getCategoryLabel(insight.category)} is {insight.share}% of
                      spending this month.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        openAsk(
                          selectedAccount
                            ? `Why is ${getCategoryLabel(insight.category)} my largest expense in ${selectedAccount.name} this month?`
                            : `Why is ${getCategoryLabel(insight.category)} my largest expense this month?`,
                        )
                      }
                      className="pointer-events-auto mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Ask Budgetly →
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No expenses this month yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAsk("Analyze my spending")}
                      className="pointer-events-auto mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Ask Budgetly →
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="min-w-0 space-y-4">
            <form
              className="flex flex-col gap-2 lg:flex-row lg:items-center"
              onSubmit={(event) => {
                event.preventDefault();
                applySearch();
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Search transactions"
                  className="h-8 rounded-lg border-white/10 bg-white/[0.03] pl-8 text-xs shadow-none"
                />
              </div>
              <Select
                value={accountId ?? "ALL"}
                onValueChange={setAccountId}
                disabled={accountsLoading}
              >
                <SelectTrigger className={cn(dashSelect, "w-full lg:w-40")}>
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={cn(dashSelect, "w-full lg:w-40")}>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All categories</SelectItem>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TypeFilter)}
              >
                <SelectTrigger className={cn(dashSelect, "w-full lg:w-36")}>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All types</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={isRecurring}
                onValueChange={(value) =>
                  setIsRecurring(value as RecurringFilter)
                }
              >
                <SelectTrigger className={cn(dashSelect, "w-full lg:w-36")}>
                  <SelectValue placeholder="Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All schedules</SelectItem>
                  <SelectItem value="true">Recurring</SelectItem>
                  <SelectItem value="false">One-time</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="sm" className={cn(dashControl, "lg:hidden")}>
                Search
              </Button>
            </form>

            <AccountTransaction
              accounts={accounts}
              listFilters={listFilters}
              enabled={Boolean(userId)}
            />
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Quick filters
              </h3>
              <div className="mt-3 space-y-1">
                {(
                  [
                    ["all", "All transactions"],
                    ["income", "Income"],
                    ["expense", "Expenses"],
                    ["recurring", "Recurring"],
                    ["one-time", "One-time"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setQuickFilter(key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm",
                      quickFilter === key
                        ? "bg-primary/15 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground">
                Common actions
              </h3>
              <div className="mt-3 space-y-1">
                <button
                  type="button"
                  onClick={() => setQuickFilter("recurring")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <Repeat className="size-3.5" aria-hidden />
                  View recurring payments
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openAsk(
                      selectedAccount
                        ? `Analyze this account: ${selectedAccount.name}`
                        : "Analyze my spending",
                    )
                  }
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <Sparkles className="size-3.5" aria-hidden />
                  Analyze spending
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
              <p className="text-sm font-medium text-foreground">
                Need deeper insights?
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask Budgetly to analyze your spending and find unusual entries.
              </p>
              <Button
                type="button"
                size="sm"
                className="mt-3 w-full"
                onClick={() => openAsk()}
              >
                Open Ask Budgetly
              </Button>
            </section>
          </aside>
        </div>

        {selectedAccount && (
          <TransactionGraph
            currentBalance={balance}
            accountId={selectedAccount.id}
            accountName={selectedAccount.name}
            variant="embedded"
          />
        )}
      </div>
    </div>
  );
};

export default Transaction;
