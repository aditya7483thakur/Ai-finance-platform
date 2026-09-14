import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatShortDate, formatSignedMoney } from "@/lib/money";
import { getCategory, getCategoryIconClass, getCategoryLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AccountType, Transaction } from "@/types";
import { useEffect, useState } from "react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { Skeleton } from "../ui/skeleton";

interface props {
  accounts: AccountType[] | undefined;
  accountsLoading: boolean;
  selectedAccountId?: string;
  onAccountSelect?: (accountId: string) => void;
}

const RecentTransactions = ({
  accounts,
  accountsLoading,
  selectedAccountId,
  onAccountSelect,
}: props) => {
  const safeAccounts = accounts || [];
  const [filters, setFilters] = useState({
    accountId: selectedAccountId || safeAccounts[0]?.id || "",
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    if (!selectedAccountId) {
      return;
    }

    setFilters((prev) =>
      prev.accountId === selectedAccountId
        ? prev
        : { ...prev, accountId: selectedAccountId },
    );
  }, [selectedAccountId]);

  const { data: transactionData, isPending } = useFilteredTransactions(
    filters,
    { enabled: Boolean(filters.accountId) },
  );
  const noAccounts = safeAccounts.length === 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          Recent Transactions
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {!noAccounts && (
            <Select
              value={filters.accountId}
              onValueChange={(value) => {
                onAccountSelect?.(value);
                setFilters((prev) => ({ ...prev, accountId: value }));
              }}
              disabled={accountsLoading}
            >
              <SelectTrigger
                className="h-8 rounded-full border-white/10 bg-transparent px-3 text-xs text-muted-foreground shadow-none"
                disabled={accountsLoading}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {safeAccounts.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {filters.accountId && (
            <Link
              to={`/dashboard/transactions?accountId=${filters.accountId}`}
              className="inline-flex h-8 items-center rounded-full border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              View All →
            </Link>
          )}
        </div>
      </div>

      {noAccounts ? (
        <div className="py-10 text-center">
          <p className="font-medium text-foreground">No accounts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add an account to start seeing activity here.
          </p>
        </div>
      ) : isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : transactionData?.data?.length > 0 ? (
        <div>
          <div className="hidden grid-cols-[88px_minmax(0,1fr)_128px_80px] gap-3 border-b border-white/8 px-1 pb-2 text-[11px] text-muted-foreground sm:grid">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span className="text-right">Amount</span>
          </div>
          {transactionData.data.map((transaction: Transaction) => {
            const category = getCategory(transaction.category);
            const Icon = category?.icon;
            return (
              <div
                key={transaction.id}
                className="grid grid-cols-1 items-center gap-2 border-b border-white/8 px-1 py-2 last:border-b-0 sm:grid-cols-[88px_minmax(0,1fr)_128px_80px] sm:gap-3"
              >
                <p className="text-xs text-muted-foreground">
                  {formatShortDate(transaction.date)}
                </p>
                <p className="truncate text-sm text-foreground">
                  {transaction.description ||
                    getCategoryLabel(transaction.category)}
                </p>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  {Icon && (
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md",
                        getCategoryIconClass(transaction.category),
                      )}
                    >
                      <Icon className="size-3" aria-hidden />
                    </span>
                  )}
                  <span className="truncate">
                    {getCategoryLabel(transaction.category)}
                  </span>
                </p>
                <p
                  className={cn(
                    "text-sm font-medium sm:text-right",
                    transaction.type === "INCOME"
                      ? "text-success"
                      : "text-error",
                  )}
                >
                  {formatSignedMoney(transaction.amount, transaction.type)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="font-medium text-foreground">
            No transactions in this period
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a transaction to start seeing your spending trends.
          </p>
          <Link
            to="/dashboard/add-transaction"
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Add transaction
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
