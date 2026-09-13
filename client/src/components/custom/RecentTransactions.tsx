import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatShortDate, formatSignedMoney } from "@/lib/money";
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

const categoryClass = (category: string): string => {
  switch (category) {
    case "SALARY":
      return "bg-green-100 text-green-800";
    case "INVESTMENTS":
      return "bg-teal-100 text-teal-800";
    case "FOOD":
      return "bg-orange-100 text-orange-800";
    case "TRANSPORT":
      return "bg-blue-100 text-blue-800";
    case "HOUSING":
      return "bg-indigo-100 text-indigo-800";
    case "ENTERTAINMENT":
      return "bg-purple-100 text-purple-800";
    case "TRAVEL":
      return "bg-cyan-100 text-cyan-800";
    case "HEALTH":
      return "bg-red-100 text-red-800";
    case "SHOPPING":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

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

  const { data: transactionData, isPending } = useFilteredTransactions(filters);
  const noAccounts = safeAccounts.length === 0;
  const selectedName =
    safeAccounts.find((account) => account.id === filters.accountId)?.name ??
    "Account";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Transactions
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {!noAccounts && (
            <Select
              value={filters.accountId}
              onValueChange={(value) => {
                onAccountSelect?.(value);
                setFilters((prev) => ({ ...prev, accountId: value }));
              }}
              disabled={accountsLoading}
            >
              <SelectTrigger className="w-[160px]" disabled={accountsLoading}>
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
              to={`/dashboard/transactions/${filters.accountId}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View All Transactions
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {noAccounts ? (
          <div className="py-10 text-center">
            <p className="font-medium text-slate-800">No accounts yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add an account to start seeing activity here.
            </p>
          </div>
        ) : isPending ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : transactionData?.data?.length > 0 ? (
          <>
            {transactionData.data.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-start justify-between gap-3 rounded-lg py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selectedName}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {formatShortDate(transaction.date)}
                  </p>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      categoryClass(transaction.category),
                    )}
                  >
                    {transaction.category}
                  </span>
                </div>
                <p
                  className={cn(
                    "shrink-0 text-sm font-semibold",
                    transaction.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {formatSignedMoney(transaction.amount, transaction.type)}
                </p>
              </div>
            ))}
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="font-medium text-slate-800">
              No transactions in this period
            </p>
            <p className="mt-1 text-sm text-slate-500">
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
    </div>
  );
};

export default RecentTransactions;
