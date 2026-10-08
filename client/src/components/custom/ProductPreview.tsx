import {
  Briefcase,
  Home,
  List,
  PieChart,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Utensils,
  Wallet,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Illustrative sample data only; this is a static picture of the dashboard.
const NAV: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Ask Budgetly", icon: Sparkles },
  { label: "Add Transaction", icon: PlusCircle },
  { label: "Accounts", icon: WalletCards },
  { label: "Transactions", icon: List },
];

const KPIS: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: string;
  glow?: boolean;
}[] = [
  {
    label: "Total Balance",
    value: "$12,480",
    hint: "Across 3 accounts",
    icon: Wallet,
    tone: "border-cyan-400/30 text-cyan-300",
    glow: true,
  },
  {
    label: "Total Spent",
    value: "$1,920",
    hint: "of $3,000 used",
    icon: TrendingUp,
    tone: "border-rose-400/30 text-rose-300",
  },
  {
    label: "Budget Remaining",
    value: "$1,080",
    hint: "64% used",
    icon: PieChart,
    tone: "border-violet-400/30 text-violet-300",
  },
  {
    label: "Accounts at Risk",
    value: "1",
    hint: "Travel needs attention",
    icon: TriangleAlert,
    tone: "border-orange-400/30 text-orange-300",
  },
];

const ROWS = [
  {
    label: "Groceries",
    meta: "Food · Today",
    amount: "-$84",
    icon: Utensils,
    tone: "bg-warning/15 text-warning",
    income: false,
  },
  {
    label: "Salary",
    meta: "Income · Oct 1",
    amount: "+$4,200",
    icon: Briefcase,
    tone: "bg-success/15 text-success",
    income: true,
  },
  {
    label: "New sneakers",
    meta: "Shopping · Sep 29",
    amount: "-$120",
    icon: ShoppingBag,
    tone: "bg-accent/15 text-accent",
    income: false,
  },
];

// Donut segments as [colour, share%]; circumference of r=15.9 is ~100.
const DONUT = (
  [
    ["#f59e0b", 38],
    ["#6366f1", 26],
    ["#2679f3", 14],
    ["#22c55e", 12],
    ["#f43f5e", 10],
  ] as const
).map(([color, share], index, all) => ({
  color,
  dash: `${share - 1.5} ${100 - share + 1.5}`,
  // Start at 12 o'clock (offset 25) and step back by the previous shares.
  offset: 25 - all.slice(0, index).reduce((sum, [, prev]) => sum + prev, 0),
}));

// Hand-tuned balance curve for the mini chart (viewBox 0 0 400 120).
const LINE =
  "M0 78 C 30 74, 50 60, 80 64 S 130 84, 160 70 S 210 40, 240 46 S 290 66, 320 50 S 370 22, 400 28";

const ProductPreview = ({ className }: { className?: string }) => {
  return (
    <div
      role="img"
      aria-label="Preview of the Budgetly dashboard showing balances, a cash flow chart, spending by category and recent transactions"
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#080b12] shadow-[0_40px_140px_-30px_rgb(38_121_243/0.45)]",
        className,
      )}
    >
      {/* Window chrome */}
      <div
        aria-hidden
        className="flex items-center gap-1.5 border-b border-white/6 px-4 py-2.5"
      >
        <span className="size-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="size-2.5 rounded-full bg-[#febc2e]/70" />
        <span className="size-2.5 rounded-full bg-[#28c840]/70" />
        <span className="mx-auto hidden rounded-md bg-white/[0.04] px-16 py-0.5 text-[10px] text-muted-foreground sm:block">
          budgetly.app/dashboard
        </span>
      </div>

      <div aria-hidden className="flex">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 border-r border-white/6 p-3 md:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-white">
              <Sparkles className="size-3" />
            </span>
            <span className="text-xs font-semibold text-foreground">Budgetly</span>
          </div>
          <ul className="space-y-0.5">
            {NAV.map((item) => (
              <li
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]",
                  item.active
                    ? "bg-primary text-white"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1 space-y-3 p-3 sm:p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Good morning, Alex
            </p>
            <p className="text-[11px] text-muted-foreground">
              A few accounts need attention this month.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {KPIS.map((kpi, index) => (
              <div
                key={kpi.label}
                className={cn(
                  "rounded-xl border bg-card p-2.5",
                  kpi.glow
                    ? "border-cyan-400/50 shadow-[0_0_24px_rgb(34_211_238/0.18)]"
                    : "border-white/8",
                  index > 1 && "hidden lg:block",
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md border bg-white/5",
                      kpi.tone,
                    )}
                  >
                    <kpi.icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] text-muted-foreground">
                      {kpi.label}
                    </p>
                    <p className="text-base font-semibold tracking-tight text-foreground">
                      {kpi.value}
                    </p>
                    <p className="truncate text-[9px] text-muted-foreground">
                      {kpi.hint}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-5">
            <div className="rounded-xl border border-white/8 bg-card p-3 lg:col-span-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-foreground">
                  Cash Flow
                </p>
                <div className="flex gap-1 text-[9px]">
                  <span className="rounded bg-white/8 px-1.5 py-0.5 text-foreground">
                    7D
                  </span>
                  <span className="px-1.5 py-0.5 text-muted-foreground">30D</span>
                  <span className="px-1.5 py-0.5 text-muted-foreground">6M</span>
                </div>
              </div>
              <svg
                viewBox="0 0 400 120"
                className="h-28 w-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="preview-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2679f3" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2679f3" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[30, 60, 90].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="400"
                    y1={y}
                    y2={y}
                    stroke="rgb(255 255 255 / 6%)"
                    strokeDasharray="3 4"
                  />
                ))}
                {[40, 110, 180, 250, 320].map((x, index) => (
                  <rect
                    key={x}
                    x={x}
                    y={index % 2 ? 84 : 92}
                    width="14"
                    height={index % 2 ? 26 : 18}
                    rx="2"
                    fill={index === 3 ? "#22c55e" : "#f43f5e"}
                    opacity="0.55"
                  />
                ))}
                <path d={`${LINE} L400 120 L0 120 Z`} fill="url(#preview-fill)" />
                <path d={LINE} fill="none" stroke="#2679f3" strokeWidth="2.5" />
                <circle cx="320" cy="50" r="4" fill="#07090f" stroke="#2679f3" strokeWidth="2" />
              </svg>
            </div>

            <div className="hidden rounded-xl border border-white/8 bg-card p-3 sm:block lg:col-span-2">
              <p className="mb-2 text-[11px] font-semibold text-foreground">
                Spending by Category
              </p>
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 42 42" className="size-24 shrink-0 -rotate-90">
                  {DONUT.map((segment) => (
                    <circle
                      key={segment.color}
                      cx="21"
                      cy="21"
                      r="15.9"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="4.5"
                      strokeDasharray={segment.dash}
                      strokeDashoffset={segment.offset}
                    />
                  ))}
                </svg>
                <ul className="min-w-0 space-y-1 text-[10px]">
                  {[
                    ["Food", "#f59e0b", "38%"],
                    ["Housing", "#6366f1", "26%"],
                    ["Transport", "#2679f3", "14%"],
                  ].map(([label, color, share]) => (
                    <li key={label} className="flex items-center gap-1.5">
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-muted-foreground">{label}</span>
                      <span className="ml-auto pl-2 text-foreground">{share}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/8 bg-card p-3">
            <p className="mb-2 text-[11px] font-semibold text-foreground">
              Recent Transactions
            </p>
            <ul className="divide-y divide-white/6">
              {ROWS.map((row) => (
                <li key={row.label} className="flex items-center gap-2.5 py-1.5">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md",
                      row.tone,
                    )}
                  >
                    <row.icon className="size-3" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground">
                    {row.label}
                    <span className="ml-2 font-normal text-muted-foreground">
                      {row.meta}
                    </span>
                  </p>
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      row.income ? "text-success" : "text-foreground",
                    )}
                  >
                    {row.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
