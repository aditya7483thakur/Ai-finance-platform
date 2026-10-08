import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";
import AccountTransaction from "@/components/custom/AccountTransaction";
import TransactionGraph from "@/components/custom/TransactionGraph";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useTransactionSummary } from "@/services/transactions/query";
import { useDeleteBulkTransactions } from "@/services/transactions/mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dashControl, dashFieldHeight, dashSelect } from "@/lib/dashboard-chrome";
import { CATEGORIES, getCategoryLabel } from "@/lib/categories";
import { formatMoney, formatSignedMoney, toAmount } from "@/lib/money";
import { cn } from "@/lib/utils";
import { AccountType } from "@/types";
import {
  ArrowLeftRight,
  CalendarDays,
  Loader2,
  Plus,
  ScanLine,
  Search,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

type ViewTab = "all" | "income" | "expense" | "recurring" | "one-time";

// Each tab maps to exactly one type + schedule combination, so there is a
// single source of truth for those two filters.
const VIEW_TABS: {
  key: ViewTab;
  label: string;
  type: "ALL" | "INCOME" | "EXPENSE";
  isRecurring: "ALL" | "true" | "false";
}[] = [
  { key: "all", label: "All", type: "ALL", isRecurring: "ALL" },
  { key: "income", label: "Income", type: "INCOME", isRecurring: "ALL" },
  { key: "expense", label: "Expenses", type: "EXPENSE", isRecurring: "ALL" },
  { key: "recurring", label: "Recurring", type: "ALL", isRecurring: "true" },
  { key: "one-time", label: "One-time", type: "ALL", isRecurring: "false" },
];

const currentMonthRange = (): DateRange => ({
  from: startOfMonth(new Date()),
  to: endOfMonth(new Date()),
});

const toDayStamp = (value?: Date) =>
  value ? format(value, "yyyy-MM-dd") : undefined;

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
  const [viewTab, setViewTab] = useState<ViewTab>("all");
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    () => new Set(),
  );
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const { mutate: bulkDelete, isPending: bulkDeleting } =
    useDeleteBulkTransactions();
  const selectedCount = selectedTransactions.size;

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    bulkDelete(Array.from(selectedTransactions), {
      onSuccess: () => {
        setSelectedTransactions(new Set());
        setConfirmBulkDelete(false);
      },
    });
  };
  const [category, setCategory] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    currentMonthRange,
  );

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

  const { type, isRecurring } =
    VIEW_TABS.find((tab) => tab.key === viewTab) ?? VIEW_TABS[0];

  const startDate = toDayStamp(dateRange?.from);
  const endDate = toDayStamp(dateRange?.to ?? dateRange?.from);

  const listFilters = useMemo(
    () => ({
      ...(accountId ? { accountId } : {}),
      ...(appliedDescription ? { description: appliedDescription } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
      type,
      category,
      isRecurring,
    }),
    [
      accountId,
      appliedDescription,
      category,
      endDate,
      isRecurring,
      startDate,
      type,
    ],
  );

  const { data: summaryResponse, isPending: summaryLoading } =
    useTransactionSummary(listFilters, {
    enabled: Boolean(userId),
  });
  const summary = summaryResponse?.data;
  const totals = {
    income: toAmount(summary?.income),
    expenses: toAmount(summary?.expense),
    net: toAmount(summary?.net),
  };
  const insight = summary?.topExpenseCategory
    ? {
        category: summary.topExpenseCategory.name,
        share: summary.topExpenseCategory.share,
      }
    : null;

  const rangeLabel =
    dateRange?.from && (dateRange.to || dateRange.from)
      ? `${format(dateRange.from, "MMM d, yyyy")} – ${format(
          dateRange.to ?? dateRange.from,
          "MMM d, yyyy",
        )}`
      : "All time";

  const applySearch = () => {
    setAppliedDescription(description.trim());
  };

  const balance = toAmount(selectedAccount?.balance);

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
                <p className="text-xs text-muted-foreground">Income</p>
                {summaryLoading ? (
                  <Skeleton className="mt-1.5 h-7 w-24" />
                ) : (
                  <p className="mt-1 text-2xl font-semibold text-success">
                    {formatSignedMoney(totals.income, "INCOME")}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {rangeLabel}
                  {selectedAccount ? ` · ${selectedAccount.name}` : ""}
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
                <p className="text-xs text-muted-foreground">Expenses</p>
                {summaryLoading ? (
                  <Skeleton className="mt-1.5 h-7 w-24" />
                ) : (
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {formatSignedMoney(totals.expenses, "EXPENSE")}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {rangeLabel}
                  {selectedAccount ? ` · ${selectedAccount.name}` : ""}
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
                {summaryLoading ? (
                  <Skeleton className="mt-1.5 h-7 w-24" />
                ) : (
                  <p
                    className={cn(
                      "mt-1 text-2xl font-semibold",
                      totals.net >= 0 ? "text-success" : "text-error",
                    )}
                  >
                    {formatMoney(totals.net)}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Income minus expenses in this range
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
                {summaryLoading ? (
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : insight ? (
                  <>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {getCategoryLabel(insight.category)} is {insight.share}% of
                      spending in this range.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        openAsk(
                          selectedAccount
                            ? `Why is ${getCategoryLabel(insight.category)} my largest expense in ${selectedAccount.name} from ${rangeLabel}?`
                            : `Why is ${getCategoryLabel(insight.category)} my largest expense from ${rangeLabel}?`,
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
                      No expenses in this range yet.
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

        {selectedAccount && (
          <section className="rounded-2xl border border-border bg-card p-5">
            <TransactionGraph
              currentBalance={balance}
              accountId={selectedAccount.id}
              title={`${selectedAccount.name} · Balance trend`}
              variant="embedded"
            />
          </section>
        )}

        <section className="min-w-0 space-y-4">
          <div
            role="tablist"
            aria-label="Transaction type"
            className="flex flex-wrap items-center gap-2"
          >
            {VIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={viewTab === tab.key}
                onClick={() => setViewTab(tab.key)}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  viewTab === tab.key
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form
            className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              applySearch();
            }}
          >
            <div className="relative min-w-0 md:min-w-[240px] md:flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Search transactions"
                className={cn(dashFieldHeight, "rounded-lg border-white/10 bg-white/[0.03] pl-8 text-xs shadow-none")}
              />
            </div>
            <Select
              value={accountId ?? "ALL"}
              onValueChange={setAccountId}
              disabled={accountsLoading}
            >
              <SelectTrigger className={cn(dashSelect, dashFieldHeight, "w-full md:w-40")}>
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
              <SelectTrigger className={cn(dashSelect, dashFieldHeight, "w-full md:w-40")}>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    dashSelect,
                    dashFieldHeight,
                    "w-full justify-start md:w-56",
                  )}
                >
                  <CalendarDays className="size-3.5" aria-hidden />
                  <span className="truncate">{rangeLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  defaultMonth={dateRange?.from}
                  numberOfMonths={1}
                  initialFocus
                />
                <div className="flex gap-2 border-t border-white/10 p-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => setDateRange(currentMonthRange())}
                  >
                    This month
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => setDateRange(undefined)}
                  >
                    All time
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={selectedCount === 0}
              onClick={() => setConfirmBulkDelete(true)}
              aria-label={
                selectedCount
                  ? `Delete ${selectedCount} selected transaction${selectedCount === 1 ? "" : "s"}`
                  : "Select transactions to delete"
              }
              title={
                selectedCount
                  ? `Delete ${selectedCount} selected`
                  : "Select transactions to delete"
              }
              className={cn(
                dashControl,
                "relative size-10 shrink-0 self-end border-error/40 text-error hover:bg-error/10 hover:text-error disabled:opacity-40 md:self-auto",
              )}
            >
              <Trash2 className="size-3.5" aria-hidden />
              {selectedCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold leading-none text-white">
                  {selectedCount}
                </span>
              )}
            </Button>
            <Button type="submit" size="sm" className={cn(dashControl, "md:hidden")}>
              Search
            </Button>
          </form>

          <AccountTransaction
            accounts={accounts}
            listFilters={listFilters}
            enabled={Boolean(userId)}
            selectedTransactions={selectedTransactions}
            setSelectedTransactions={setSelectedTransactions}
          />
        </section>

        <Dialog
          open={confirmBulkDelete}
          onOpenChange={(open) => {
            if (!bulkDeleting) setConfirmBulkDelete(open);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Delete {selectedCount} transaction{selectedCount === 1 ? "" : "s"}?
              </DialogTitle>
              <DialogDescription>
                This cannot be undone. Account balances will update after the
                transactions are removed.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmBulkDelete(false)}
                disabled={bulkDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
              >
                {bulkDeleting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                {bulkDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default Transaction;
