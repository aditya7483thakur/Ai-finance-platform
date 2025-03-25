import { Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ExpenseBreakdown from "@/components/custom/ExpenseBreakdown";
import Accounts from "@/components/custom/Accounts";
import { useUserContext } from "@/contexts/userContext";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useState } from "react";
import { AccountType } from "@/types";

const Dashboard = () => {
  const { userId } = useUserContext();
  const { data: accounts, isPending: accountsLoading } =
    useGetAllAccounts(userId);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(
    null
  );
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Budget Section */}
        <div className="bg-white mb-6 p-3 shadow-md rounded-md">
          <span className="block text-lg font-medium">Account Budget</span>
          {selectedAccount ? (
            <>
              <div className="flex gap-2 items-center mb-2">
                <span className="text-gray-400">
                  ${selectedAccount.usedAmount}/
                  {selectedAccount.budget ?? "Not Set"} spent
                </span>
                <Pencil size={18} />
              </div>
              <Progress
                value={
                  selectedAccount.budget
                    ? (selectedAccount.usedAmount / selectedAccount.budget) *
                      100
                    : 0
                }
                className="h-2.5"
              />
              <div className="text-end text-gray-400">
                {selectedAccount.budget
                  ? `${Math.round(
                      (selectedAccount.usedAmount / selectedAccount.budget) *
                        100
                    )}% used`
                  : "Budget not set"}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">
              Click on an account to see budget details
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpenseBreakdown />
          <RecentTransactions />
        </div>
        <Accounts
          accounts={accounts?.data}
          accountsLoading={accountsLoading}
          onAccountClick={setSelectedAccount}
        />
      </div>
    </div>
  );
};

export default Dashboard;
