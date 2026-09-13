import { formatMoney } from "@/lib/money";
import { useUserContext } from "@/contexts/userContext";
import { useFetchExpenseBreakdown } from "@/services/graphs/query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#0088FE",
  "#FF8042",
  "#00C49F",
  "#4F46E5",
  "#FFBB28",
  "#9932CC",
  "#32CD32",
  "#FF4500",
  "#1E90FF",
  "#8B4513",
];

const ExpenseBreakdown = () => {
  const { userId } = useUserContext();
  const { data: pieData, isPending } = useFetchExpenseBreakdown({ userId });

  const totalExpenses =
    pieData?.data?.reduce((sum: number, item: { value: number }) => sum + item.value, 0) || 0;

  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (isPending) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Expense Breakdown
          </h2>
          <div className="text-sm text-slate-500">{monthYear}</div>
        </div>
        <div className="flex h-64 items-center justify-center text-slate-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Expense Breakdown
        </h2>
        <div className="text-sm text-slate-500">{monthYear}</div>
      </div>

      {pieData?.data?.length ? (
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="h-64 w-full md:w-1/2">
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
                  {pieData.data.map((entry: { name: string }, index: number) => (
                    <Cell
                      key={`cell-${index}-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    formatMoney(Number(value)),
                    "Amount",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2">
            <div className="max-h-48 space-y-3 overflow-y-auto pr-2">
              {pieData.data.map(
                (item: { name: string; value: number }, index: number) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="mr-2 h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {formatMoney(item.value)}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 flex justify-between border-t border-slate-100 pt-4">
              <span className="text-slate-600">Total Expenses</span>
              <span className="font-semibold text-slate-900">
                {formatMoney(totalExpenses)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-56 flex-col items-center justify-center px-6 text-center">
          <p className="font-medium text-slate-800">No expenses this month</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Your expense breakdown will appear here once you add transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdown;
