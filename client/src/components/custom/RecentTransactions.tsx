import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
const transactionData = [
  {
    id: 1,
    name: "Stripe",
    amount: "$15,000",
    category: "Income",
    date: "Mar 15",
    type: "credit",
  },
  {
    id: 2,
    name: "Airbnb",
    amount: "$2,500",
    category: "Expense",
    date: "Mar 14",
    type: "debit",
  },
  {
    id: 3,
    name: "DoorDash",
    amount: "$80",
    category: "Food",
    date: "Mar 13",
    type: "debit",
  },
  {
    id: 4,
    name: "Slack",
    amount: "$25",
    category: "Software",
    date: "Mar 12",
    type: "debit",
  },
];

const RecentTransactions = () => {
  return (
    <>
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {transactionData.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-md mr-3 ${
                    transaction.type === "credit"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {transaction.type === "credit" ? (
                    <ArrowUpRight
                      className={`h-5 w-5 ${
                        transaction.type === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  ) : (
                    <ArrowDownLeft
                      className={`h-5 w-5 ${
                        transaction.type === "credit"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {transaction.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.date} · {transaction.category}
                  </p>
                </div>
              </div>
              <p
                className={`font-medium ${
                  transaction.type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"}
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecentTransactions;
