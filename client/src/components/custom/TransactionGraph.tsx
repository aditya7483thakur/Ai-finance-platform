import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const TransactionGraph = () => {
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

  return (
    <>
      {/* Transaction Overview */}
      <div className="max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm">
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
    </>
  );
};

export default TransactionGraph;
