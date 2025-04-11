import { useFetchTransactionGraph } from "@/services/graphs/query";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

const TransactionGraph = () => {
  const { accountId } = useParams();
  const [selectedRange, setSelectedRange] = useState("last_7_days");

  const { data, isPending } = useFetchTransactionGraph({
    accountId,
    filter: selectedRange,
  });
  console.log(data);
  const range: { key: string; label: string }[] = [
    { key: "last_7_days", label: "Last 7 days" },
    { key: "last_month", label: "Last month" },
    { key: "last_6_months", label: "Last 6 months" },
  ];

  if (isPending)
    return (
      <div className="max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>

        {/* Summary Stats */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>

        {/* Graph Bars */}
        <div className="h-64 grid grid-cols-12 gap-2 items-end">
          {Array.from({ length: 12 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="rounded-t"
              style={{
                height: `${Math.floor(Math.random() * 60 + 40)}%`,
              }}
            />
          ))}
        </div>
      </div>
    );

  return (
    <>
      <div className="max-w-7xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transaction Overview</h2>
          <div className="relative">
            <Select
              defaultValue="last_7_days"
              onValueChange={(value) => setSelectedRange(value)}
            >
              <SelectTrigger className="w-[180px]" disabled={isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {range.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex justify-between text-sm mb-6">
          <div>
            <p className="text-gray-500">Total Income</p>
            <p className="text-xl font-bold text-green-500">
              ${data.meta.totalIncome}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total Expenses</p>
            <p className="text-xl font-bold text-red-500">
              ${data.meta.totalExpense}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Net</p>
            <p
              className={`text-xl font-bold ${
                data.meta.net < 0 ? "text-red-500" : " text-green-500"
              }`}
            >
              ${data.meta.net}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.data}
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
