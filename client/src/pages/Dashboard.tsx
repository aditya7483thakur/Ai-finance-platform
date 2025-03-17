import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  LineChart,
  Wallet,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  // Sample data
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

  const pieData = [
    { name: "Software", value: 2500 },
    { name: "Marketing", value: 4500 },
    { name: "Rent", value: 3000 },
    { name: "Payroll", value: 8000 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Financial Dashboard
            </h1>
            <p className="text-gray-600">All your finances in one place</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Start free trial
          </button>
        </header>

        {/* Account Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Account Summary
            </h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accountData.map((account, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
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

          {/* Expense Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Expense Breakdown
              </h2>
              <div className="text-sm text-gray-500">March 2025</div>
            </div>
            <div className="flex">
              <div className="w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}-${entry}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2">
                <div className="space-y-3">
                  {pieData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="text-sm text-gray-600">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses</span>
                    <span className="font-bold text-gray-800">$18,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Record Payment
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100">
              <CreditCard className="h-6 w-6 text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Add Account
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
              <LineChart className="h-6 w-6 text-purple-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Generate Report
              </span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100">
              <ArrowUpRight className="h-6 w-6 text-yellow-500 mb-2" />
              <span className="text-sm font-medium text-gray-800">
                Schedule Transfer
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
