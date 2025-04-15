import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountType, Transaction } from "@/types";
import { useEffect, useState } from "react";
import { useFilteredTransactions } from "@/services/transactions/query";
import { Skeleton } from "../ui/skeleton";

interface props {
  accounts: AccountType[] | undefined;
  accountsLoading: boolean;
}

const RecentTransactions = ({ accounts, accountsLoading }: props) => {
  // If accounts is undefined, fallback to empty array
  const safeAccounts = accounts || [];
  const [filters, setFilters] = useState({
    accountId: safeAccounts.length > 0 ? safeAccounts[0].id : "",
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    if (safeAccounts.length > 0 && !filters.accountId) {
      setFilters((prev) => ({ ...prev, accountId: safeAccounts[0].id }));
    }
  }, [safeAccounts]);

  const { data: transactionData, isPending } = useFilteredTransactions(filters);

  // Check if there are no accounts
  const noAccounts = safeAccounts.length === 0;

  {
    console.log(isPending);
  }
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
      {/* Recent Transactions Title and Account Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Transactions
        </h2>

        {/* Account Selector */}
        {!noAccounts && (
          <Select
            value={filters.accountId}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, accountId: value }))
            }
            disabled={accountsLoading}
          >
            <SelectTrigger className="w-[180px]" disabled={accountsLoading}>
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
      </div>

      <div className="space-y-4 ">
        {noAccounts ? (
          <p className="text-gray-500 text-center py-4 mt-20">
            No accounts available to show transactions.
          </p>
        ) : isPending ? (
          <>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </>
        ) : transactionData?.data?.length > 0 ? (
          transactionData.data.map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-0 hover:bg-gray-50 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-md mr-3 ${
                    transaction.type === "INCOME"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "INCOME" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {transaction.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p
                className={`font-medium ${
                  transaction.type === "INCOME"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {transaction.amount}$
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No recent transactions.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
