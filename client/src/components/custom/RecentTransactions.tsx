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
  accounts: AccountType[];
  accountsLoading: boolean;
}
const RecentTransactions = ({ accounts, accountsLoading }: props) => {
  const [filters, setFilters] = useState({
    accountId: accounts ? accounts[0].id : "",
    page: 1,
    limit: 5,
  });
  useEffect(() => {
    if (accounts && accounts.length > 0 && !filters.accountId) {
      setFilters((prev) => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accounts]);
  console.log(filters);
  const { data: transactionData, isPending } = useFilteredTransactions(filters);
  return (
    <>
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <Select
            value={filters.accountId}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, accountId: value }))
            }
          >
            <SelectTrigger className="w-[180px]" disabled={accountsLoading}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {accounts?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {isPending ? (
            <>
              <Skeleton className="h-8 w-full"></Skeleton>
              <Skeleton className="h-8 w-full"></Skeleton>
              <Skeleton className="h-8 w-full"></Skeleton>
              <Skeleton className="h-8 w-full"></Skeleton>
              <Skeleton className="h-8 w-full"></Skeleton>
            </>
          ) : transactionData?.data?.length > 0 ? (
            transactionData.data.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
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
                    <p className="font-medium text-gray-800">
                      {transaction.category}
                    </p>
                    {/* <p className="text-xs text-gray-500">
                      {transaction.date} · {transaction.category}
                    </p> */}
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
                  {transaction.amount}
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
    </>
  );
};

export default RecentTransactions;
