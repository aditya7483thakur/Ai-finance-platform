import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const pieData = [
  { name: "Software", value: 2500 },
  { name: "Marketing", value: 4500 },
  { name: "Rent", value: 3000 },
  { name: "Payroll", value: 8000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpenseBreakdown = () => {
  return (
    <>
      {" "}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
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
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
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
    </>
  );
};

export default ExpenseBreakdown;
