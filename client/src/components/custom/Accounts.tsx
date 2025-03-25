import { AccountType } from "@/types";
import { SquareArrowOutUpRight, Wallet } from "lucide-react";
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
          {accounts?.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <Wallet className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {account.name}
                    </h3>
                    <p className="text-xs text-gray-500">{account.userId}</p>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold text-gray-800">
                  {account.balance}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {account.updatedAt}
                </p>
              </div>
              <SquareArrowOutUpRight
                onClick={() =>
                  navigate(`/dashboard/transactions/${account.id}`)
                }
              />
              <Button onClick={() => onAccountClick(account)}>budget</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Accounts;
