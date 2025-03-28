import { AccountType } from "@/types";
import { Plus, Wallet } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface props {
  accounts: AccountType[];
  accountsLoading: boolean;
  onAccountClick: (account: AccountType) => void;
}
const Accounts = ({ accounts, accountsLoading, onAccountClick }: props) => {
  const navigate = useNavigate();
  if (accountsLoading) {
    return (
      <div className="mb-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-md mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:cursor-pointer border flex flex-col justify-center items-center border-gray-200 hover:shadow-md transition-shadow duration-200">
            <Plus className="h-10 w-10 text-slate-600" />
            <span className="text-slate-600 mt-2">Add account</span>
          </div>

          {accounts?.map((account) => (
            <>
              <div
                key={account.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2.5 rounded-lg">
                      <Wallet className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {account.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        {account.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-2xl font-bold text-gray-900">
                    ${account.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(account.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="text-gray-700 border-gray-300 w-1/2 hover:bg-gray-50"
                    onClick={() => onAccountClick(account)}
                  >
                    View Budget
                  </Button>
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 w-1/2 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/dashboard/transactions/${account.id}`)
                    }
                  >
                    View Transactions
                  </Button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Accounts;
