import { useParams } from "react-router-dom";
import { useState } from "react";
import AccountTransaction from "@/components/custom/AccountTransaction";
import TransactionGraph from "@/components/custom/TransactionGraph";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleAccount } from "@/services/accounts/query";

const Transaction = () => {
  const { accountId } = useParams();
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const { data: account, isPending } = useGetSingleAccount(accountId);

  return (
    <div className="bg-gray-50 px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="bg-white max-w-7xl p-6 mx-auto shadow-sm rounded-lg">
        {isPending ? (
          // 🔹 Skeleton while loading
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-primary">
                {account?.data?.name || "Account"}
              </h1>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold">${account?.data?.balance}</p>
              <p className="text-gray-500">{totalTransactions} transactions</p>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Graph */}
      {isPending ? <Skeleton className="h-40 w-full" /> : <TransactionGraph />}

      {/* Transactions List */}
      <AccountTransaction setTotalTransactions={setTotalTransactions} />
    </div>
  );
};

export default Transaction;
