import { formatMoney } from "@/lib/money";
import { chartColors } from "@/lib/colors";
import { getCategoryLabel } from "@/lib/categories";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { useFetchExpenseBreakdown } from "@/services/graphs/query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const ExpenseBreakdown = () => {
  const { userId } = useUserContext();
  const openAsk = useAskBudgetly();
  const { data: pieData, isPending } = useFetchExpenseBreakdown({ userId });

  const rows =
    pieData?.data?.map((item: { name: string; value: number }) => ({
      ...item,
      label: getCategoryLabel(item.name),
    })) ?? [];

  const totalExpenses = rows.reduce(
    (sum: number, item: { value: number }) => sum + item.value,
    0,
  );
  const topCategory = rows.reduce(
    (
      current: { name: string; label: string; value: number } | null,
      item: { name: string; label: string; value: number },
    ) => (!current || item.value > current.value ? item : current),
    null,
  );

  if (isPending) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Spending by Category
          </h2>
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-muted-foreground">
            This month
          </span>
        </div>
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Spending by Category
        </h2>
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-muted-foreground">
          This month
        </span>
      </div>

      {rows.length ? (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative h-52 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rows}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {rows.map(
                      (entry: { name: string }, index: number) => (
                        <Cell
                          key={`cell-${index}-${entry.name}`}
                          fill={chartColors[index % chartColors.length]}
                          stroke="none"
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      formatMoney(Number(value)),
                      "Amount",
                    ]}
                    contentStyle={{
                      background: "#101723",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Total Spent
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {formatMoney(totalExpenses)}
                </p>
              </div>
            </div>

            <div className="w-full space-y-3 md:w-1/2">
              {rows.map(
                (
                  item: { name: string; label: string; value: number },
                  index: number,
                ) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center">
                      <div
                        className="mr-2 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                      <span className="truncate text-sm text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatMoney(item.value)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {totalExpenses
                          ? `${Math.round((item.value / totalExpenses) * 100)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
          {topCategory && (
            <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {topCategory.label} is{" "}
                {Math.round((topCategory.value / totalExpenses) * 100)}% of
                your spending this month.
              </p>
              <button
                type="button"
                onClick={() =>
                  openAsk(
                    `Why is ${topCategory.label} my largest expense this month?`,
                  )
                }
                className="shrink-0 text-xs font-medium text-primary hover:underline"
              >
                View insights →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-56 flex-col items-center justify-center px-6 text-center">
          <p className="font-medium text-foreground">No expenses this month</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Your expense breakdown will appear here once you add transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdown;
