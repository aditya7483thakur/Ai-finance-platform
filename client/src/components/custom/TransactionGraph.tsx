import { useFetchTransactionGraph } from "@/services/graphs/query";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus } from "lucide-react";
import { formatMoney, formatSignedMoney, toAmount } from "@/lib/money";
import { cn } from "@/lib/utils";
import { colors } from "@/lib/colors";

const RANGES = [
  { key: "last_7_days", label: "Last 7 days", short: "7D" },
  { key: "last_month", label: "Last month", short: "30D" },
  { key: "last_6_months", label: "Last 6 months", short: "6M" },
];

type DayPoint = {
  date: string;
  income: number;
  expense: number;
  balance: number;
};

const buildBalanceSeries = (
  days: { date: string; income: number; expense: number }[],
  currentBalance: number,
): DayPoint[] => {
  const series = days.map((day) => ({
    date: day.date,
    income: toAmount(day.income),
    expense: toAmount(day.expense),
    balance: 0,
  }));

  if (!series.length) {
    return series;
  }

  series[series.length - 1].balance = currentBalance;
  for (let index = series.length - 2; index >= 0; index -= 1) {
    const next = series[index + 1];
    series[index].balance = next.balance - next.income + next.expense;
  }

  return series;
};

const formatTick = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const chartTooltipStyle = {
  background: "#101723",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
};

const TransactionGraph = ({
  currentBalance = 0,
  accountId: accountIdProp,
  variant = "page",
  title,
  subtitle,
  accountName,
}: {
  currentBalance?: number;
  accountId?: string;
  variant?: "page" | "embedded";
  title?: string;
  subtitle?: string;
  accountName?: string;
}) => {
  const { accountId: accountIdFromParams } = useParams();
  const accountId = accountIdProp ?? accountIdFromParams;
  const [selectedRange, setSelectedRange] = useState("last_7_days");
  const [view, setView] = useState<"balance" | "spending">("balance");

  const { data, isPending } = useFetchTransactionGraph(
    {
      accountId,
      filter: selectedRange,
    },
    { enabled: Boolean(accountId) },
  );

  const series = useMemo(
    () => buildBalanceSeries(data?.data ?? [], currentBalance),
    [data?.data, currentBalance],
  );

  const hasActivity = series.some((day) => day.income > 0 || day.expense > 0);

  if (!accountId) {
    return (
      <section>
        {title && (
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              {accountName && (
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {accountName}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
        <div className="flex h-56 flex-col items-center justify-center px-6 text-center">
          <BarChart3 className="size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-medium text-foreground">
            Add an account to see cash flow
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Income, expenses, and balance trends will show up here.
          </p>
        </div>
      </section>
    );
  }

  if (isPending) {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </section>
    );
  }

  const income = toAmount(data?.meta?.totalIncome);
  const expenses = toAmount(data?.meta?.totalExpense);
  const net = toAmount(data?.meta?.net);

  const rangeControls =
    variant === "embedded" ? (
      <div className="flex items-center gap-1 text-xs">
        {RANGES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSelectedRange(item.key)}
            className={cn(
              "rounded-md px-2 py-1 font-medium",
              selectedRange === item.key
                ? "bg-white/8 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.short}
          </button>
        ))}
      </div>
    ) : (
      <Select value={selectedRange} onValueChange={setSelectedRange}>
        <SelectTrigger className="h-8 w-[160px] rounded-lg border-white/10 bg-white/[0.03] text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {RANGES.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {variant === "page" ? (
          <h2 className="text-lg font-semibold text-foreground">
            Transaction Overview
          </h2>
        ) : title ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              {accountName && (
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {accountName}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        ) : (
          <div />
        )}
        <div className="flex flex-wrap items-center gap-2">
          {variant === "page" && hasActivity && (
            <div className="grid grid-cols-2 rounded-lg border border-border bg-card p-0.5">
              {(
                [
                  { value: "balance", label: "Balance" },
                  { value: "spending", label: "Spending" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setView(option.value)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium",
                    view === option.value
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-white/5",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          {rangeControls}
        </div>
      </div>

      {variant === "page" && (
        <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Income</p>
            <p className="mt-1 text-xl font-semibold text-success">
              {formatSignedMoney(income, "INCOME")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Expenses</p>
            <p className="mt-1 text-xl font-semibold text-error">
              {formatSignedMoney(expenses, "EXPENSE")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Net</p>
            <p
              className={cn(
                "mt-1 text-xl font-semibold",
                net < 0
                  ? "text-error"
                  : net > 0
                    ? "text-success"
                    : "text-foreground",
              )}
            >
              {net < 0
                ? formatSignedMoney(Math.abs(net), "EXPENSE")
                : net > 0
                  ? formatSignedMoney(net, "INCOME")
                  : formatMoney(0)}
            </p>
          </div>
        </div>
      )}

      {hasActivity ? (
        <div className={variant === "embedded" ? "h-64" : "h-64"}>
          {variant === "page" && (
            <p className="mb-2 text-sm font-medium text-foreground">
              {view === "balance" ? "Balance Over Time" : "Income and expenses"}
            </p>
          )}
          {variant === "embedded" && (
            <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-success" />
                Income
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-error" />
                Expenses
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                Balance
              </span>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            {variant === "embedded" ? (
              <ComposedChart
                data={series}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#8b95a8" }}
                  minTickGap={28}
                  tickFormatter={formatTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#8b95a8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value, name) => [
                    formatMoney(Number(value)),
                    name === "income"
                      ? "Income"
                      : name === "expense"
                        ? "Expenses"
                        : "Balance",
                  ]}
                  labelFormatter={formatTick}
                />
                <Bar
                  dataKey="income"
                  fill={colors.success}
                  name="income"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill={colors.error}
                  name="expense"
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={false}
                  name="balance"
                />
              </ComposedChart>
            ) : view === "balance" ? (
              <LineChart
                data={series}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#8b95a8" }}
                  minTickGap={28}
                  tickFormatter={formatTick}
                />
                <YAxis tick={{ fontSize: 12, fill: "#8b95a8" }} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value) => [formatMoney(Number(value)), "Balance"]}
                  labelFormatter={formatTick}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={false}
                  name="Balance"
                />
              </LineChart>
            ) : (
              <BarChart
                data={series}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#8b95a8" }}
                  minTickGap={28}
                  tickFormatter={formatTick}
                />
                <YAxis tick={{ fontSize: 12, fill: "#8b95a8" }} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  formatter={(value, name) => [
                    formatMoney(Number(value)),
                    name === "income" ? "Income" : "Expenses",
                  ]}
                  labelFormatter={formatTick}
                />
                <Bar dataKey="income" fill={colors.success} name="income" />
                <Bar dataKey="expense" fill={colors.error} name="expense" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <BarChart3 className="size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-medium text-foreground">
            No activity in this period
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Add a transaction to start seeing your account trends.
          </p>
          <Button size="sm" className="mt-4" asChild>
            <Link to="/dashboard/add-transaction">
              <Plus className="size-4" aria-hidden />
              Add Transaction
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
};

export default TransactionGraph;
