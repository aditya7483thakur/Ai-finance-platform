import { useUserContext } from "@/contexts/userContext";
import { useFetchExpenseBreakdown } from "@/services/graphs/query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#0088FE", // Bright blue
  "#FF8042", // Orange
  "#00C49F", // Teal
  "#FF1493", // Deep pink
  "#FFBB28", // Amber/gold
  "#9932CC", // Dark orchid purple
  "#32CD32", // Lime green
  "#FF4500", // Red-orange
  "#1E90FF", // Dodger blue
  "#8B4513", // Saddle brown
];

const ExpenseBreakdown = () => {
  const { userId } = useUserContext();
  const { data: pieData, isPending } = useFetchExpenseBreakdown({ userId });

  // Calculate total expenses dynamically
  const totalExpenses =
    pieData?.data?.reduce((sum: any, item: any) => sum + item.value, 0) || 0;

  // Get current month/year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (isPending) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Expense Breakdown
          </h2>
          <div className="text-sm text-gray-500">{monthYear}</div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Expense Breakdown
        </h2>
        <div className="text-sm text-gray-500">{monthYear}</div>
      </div>

      {pieData?.data?.length ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.data.map((entry: any, index: any) => (
                    <Cell
                      key={`cell-${index}-${entry}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2">
            <div className="space-y-3 max-h-48 overflow-y-auto pr-4">
              {pieData.data.map((item: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
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
                <span className="font-bold text-gray-800">
                  ${totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">No expense data available</div>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdown;
