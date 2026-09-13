import { useFetchTransactionGraph } from "@/services/graphs/query";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import { Skeleton } from "../ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus } from "lucide-react";
import {
  formatMoney,
  formatSignedMoney,
  toAmount,
} from "@/lib/money";
import { cn } from "@/lib/utils";

const RANGES = [
  { key: "last_7_days", label: "Last 7 days" },
  { key: "last_month", label: "Last month" },
  { key: "last_6_months", label: "Last 6 months" },
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

const TransactionGraph = ({
  currentBalance = 0,
}: {
  currentBalance?: number;
}) => {
  const { accountId } = useParams();
  const [selectedRange, setSelectedRange] = useState("last_7_days");
  const [view, setView] = useState<"balance" | "spending">("balance");

  const { data, isPending } = useFetchTransactionGraph({
    accountId,
    filter: selectedRange,
  });

  const series = useMemo(
    () => buildBalanceSeries(data?.data ?? [], currentBalance),
    [data?.data, currentBalance],
  );

  const hasActivity = series.some(
    (day) => day.income > 0 || day.expense > 0,
  );

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

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Transaction Overview
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {hasActivity && (
            <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-0.5">
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
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          <Select
            value={selectedRange}
            onValueChange={setSelectedRange}
          >
            <SelectTrigger className="w-[160px]">
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
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Income</p>
          <p className="mt-1 text-xl font-semibold text-green-600">
            {formatSignedMoney(income, "INCOME")}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Expenses</p>
          <p className="mt-1 text-xl font-semibold text-red-600">
            {formatSignedMoney(expenses, "EXPENSE")}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Net</p>
          <p
            className={cn(
              "mt-1 text-xl font-semibold",
              net < 0 ? "text-red-600" : net > 0 ? "text-green-600" : "text-slate-900",
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

      {hasActivity ? (
        <div className="h-64">
          <p className="mb-2 text-sm font-medium text-slate-700">
            {view === "balance" ? "Balance Over Time" : "Income and expenses"}
          </p>
          <ResponsiveContainer width="100%" height="100%">
            {view === "balance" ? (
              <LineChart
                data={series}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={28} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [formatMoney(Number(value)), "Balance"]}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#2679f3"
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={28} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    formatMoney(Number(value)),
                    name === "income" ? "Income" : "Expenses",
                  ]}
                />
                <Bar dataKey="income" fill="#22c55e" name="income" />
                <Bar dataKey="expense" fill="#ef4444" name="expense" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <BarChart3 className="size-8 text-slate-400" aria-hidden />
          <p className="mt-3 font-medium text-slate-800">
            No activity in this period
          </p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
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
