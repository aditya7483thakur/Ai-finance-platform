import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Transaction = () => {
  // Sample data for the chart (based on the image)
  const chartData = [
    { date: "Nov 15", income: 5000, expense: 2000 },
    { date: "Nov 16", income: 2000, expense: 2500 },
    { date: "Nov 17", income: 3000, expense: 1000 },
    { date: "Nov 18", income: 0, expense: 3000 },
    { date: "Nov 19", income: 5000, expense: 0 },
    { date: "Nov 20", income: 2000, expense: 1500 },
    { date: "Nov 21", income: 0, expense: 2000 },
    { date: "Nov 22", income: 3000, expense: 1000 },
    { date: "Nov 23", income: 1000, expense: 2000 },
    { date: "Nov 24", income: 0, expense: 0 },
    { date: "Nov 25", income: 5000, expense: 3000 },
    { date: "Nov 26", income: 2000, expense: 2000 },
    { date: "Nov 27", income: 6500, expense: 3000 },
    { date: "Nov 28", income: 6000, expense: 5000 },
    { date: "Nov 29", income: 8000, expense: 4000 },
    { date: "Nov 30", income: 0, expense: 800 },
    { date: "Dec 01", income: 2000, expense: 0 },
    { date: "Dec 02", income: 3500, expense: 3000 },
    { date: "Dec 03", income: 0, expense: 0 },
    { date: "Dec 04", income: 6000, expense: 0 },
    { date: "Dec 05", income: 0, expense: 1000 },
    { date: "Dec 06", income: 5500, expense: 0 },
    { date: "Dec 09", income: 0, expense: 3000 },
  ];

  // Sample transaction data
  const transactions = [
    {
      id: "c67da400-be0e-4e1a-ab97-7c6dbf4bca82",
      type: "EXPENSE",
      amount: "100",
      description: "TV recharge",
      date: "2024-03-11T00:00:00.000Z",
      category: "ENTERTAINMENT",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
    {
      id: "d78eb500-cf1f-5f2b-bc98-8d7dbf5cbd93",
      type: "INCOME",
      amount: "1500",
      description: "Freelance payment",
      date: "2024-03-12T00:00:00.000Z",
      category: "WORK",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
    {
      id: "d78eb500-cf1f-5f2b-b5cbd93",
      type: "INCOME",
      amount: "1500",
      description: "Freelance payment",
      date: "2024-03-12T00:00:00.000Z",
      category: "WORK",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
    {
      id: "d78eb500-cf1f-2b-bc98-8d7dbf5cbd93",
      type: "INCOME",
      amount: "1500",
      description: "Freelance payment",
      date: "2024-03-12T00:00:00.000Z",
      category: "WORK",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
    {
      id: "d78eb500-cf1ff2b-bc98-8d7dbf5cbd93",
      type: "INCOME",
      amount: "1500",
      description: "Freelance payment",
      date: "2024-03-12T00:00:00.000Z",
      category: "WORK",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
    {
      id: "d78eb500-cf1f-5f2b-bc98-8d7dbf5c93",
      type: "INCOME",
      amount: "1500",
      description: "Freelance payment",
      date: "2024-03-12T00:00:00.000Z",
      category: "WORK",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
    {
      id: "d78eb500-cf1f-5f2b-bc98-8d7dbf5cbd3",
      type: "INCOME",
      amount: "1500",
      description: "Freelance payment",
      date: "2024-03-12T00:00:00.000Z",
      category: "WORK",
      receiptUrl: null,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      userId: "59da1140-6735-45c7-8f9d-65dca84e5072",
      accountId: "b6a7a8fc-86d5-4bd5-8b04-ae9dbb6a2626",
      createdAt: "2025-03-13T20:20:28.479Z",
      updatedAt: "2025-03-14T17:52:25.563Z",
    },
  ];

  // Format date for display
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category icon based on category name
  const getCategoryIcon = (category: any) => {
    switch (category) {
      case "ENTERTAINMENT":
        return "🎭";
      case "WORK":
        return "💼";
      default:
        return "💰";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-600">Personal</h1>
            <p className="text-gray-500">Savings Account</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">$152124.40</p>
            <p className="text-gray-500">187 transactions</p>
          </div>
        </div>
      </div>

      {/* Transaction Overview */}
      <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transaction Overview</h2>
          <div className="relative">
            <select className="p-2 pr-8 border rounded-md appearance-none bg-white">
              <option>Last Month</option>
              <option>Last 7 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex justify-between text-sm mb-6">
          <div>
            <p className="text-gray-500">Total Income</p>
            <p className="text-xl font-bold text-green-500">$57378.46</p>
          </div>
          <div>
            <p className="text-gray-500">Total Expenses</p>
            <p className="text-xl font-bold text-red-500">$16118.94</p>
          </div>
          <div>
            <p className="text-gray-500">Net</p>
            <p className="text-xl font-bold text-green-500">$41259.52</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions List */}
      <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add Transaction
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-500">
                  Description
                </th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="p-3 text-right text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <span className="inline-flex items-center">
                      <span className="mr-2">
                        {getCategoryIcon(transaction.category)}
                      </span>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {transaction.description}
                  </td>
                  <td
                    className={`p-3 text-sm font-medium text-right ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}$
                    {transaction.amount}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 px-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 px-2">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
