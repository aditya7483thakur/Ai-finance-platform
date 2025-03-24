import { useUserContext } from "@/contexts/userContext";
import { usegetAllAccounts } from "@/services/accounts/query";
import { Wallet } from "lucide-react";

const accountData = [
  {
    name: "Checking Account",
    balance: "$2,309,091",
    institution: "Chase",
    lastUpdated: "Today",
  },
  {
    name: "Savings Account",
    balance: "$76,981",
    institution: "Bank of America",
    lastUpdated: "Today",
  },
  {
    name: "Investment Account",
    balance: "$543,062",
    institution: "Fidelity",
    lastUpdated: "Yesterday",
  },
];
const Accounts = () => {
  const { userId } = useUserContext();
  const {} = usegetAllAccounts(userId);
  return (
    <>
      <div className="mb-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accountData.map((account, index) => (
            <div
              key={index}
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
                    <p className="text-xs text-gray-500">
                      {account.institution}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold text-gray-800">
                  {account.balance}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {account.lastUpdated}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Accounts;
