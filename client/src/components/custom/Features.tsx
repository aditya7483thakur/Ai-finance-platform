import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  Briefcase,
  Dumbbell,
  Home,
  PiggyBank,
  Plane,
  Repeat,
  ScanLine,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Every tile maps to a shipped feature; visuals use illustrative sample data.

const Tile = ({
  className,
  icon: Icon,
  tone,
  eyebrow,
  title,
  description,
  children,
  index,
}: {
  className?: string;
  icon: LucideIcon;
  tone: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  index: number;
}) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.07 }}
    className={cn(
      "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-white/14",
      className,
    )}
  >
    <div className="relative min-h-56 flex-1 overflow-hidden border-b border-white/6 bg-[#090d15] p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgb(38 121 243 / 10%), transparent 70%)",
        }}
      />
      <div aria-hidden className="relative h-full">
        {children}
      </div>
    </div>
    <div className="p-6">
      <p
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium",
          tone,
        )}
      >
        <Icon className="size-3.5" aria-hidden />
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  </motion.li>
);

const ACCOUNTS = [
  {
    name: "Savings",
    icon: PiggyBank,
    iconTone: "bg-primary/15 text-primary",
    balance: "$8,240",
    used: 42,
    status: "Healthy",
    statusTone: "bg-success/15 text-success",
    bar: "bg-primary",
  },
  {
    name: "Travel",
    icon: Plane,
    iconTone: "bg-warning/15 text-warning",
    balance: "$1,180",
    used: 92,
    status: "At Risk",
    statusTone: "bg-warning/15 text-warning",
    bar: "bg-warning",
  },
  {
    name: "Shopping",
    icon: ShoppingBag,
    iconTone: "bg-error/15 text-error",
    balance: "-$45",
    used: 100,
    status: "Overdrawn",
    statusTone: "bg-error/15 text-error",
    bar: "bg-error",
  },
];

const AccountsVisual = () => (
  <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3">
    {ACCOUNTS.map((account, index) => (
      <div
        key={account.name}
        className={cn(
          "rounded-2xl border border-white/8 bg-card p-4",
          index > 0 && "hidden sm:block",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              account.iconTone,
            )}
          >
            <account.icon className="size-4" />
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              account.statusTone,
            )}
          >
            {account.status}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{account.name}</p>
        <p
          className={cn(
            "text-xl font-semibold tracking-tight",
            account.balance.startsWith("-") ? "text-error" : "text-foreground",
          )}
        >
          {account.balance}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div
            className={cn("h-full rounded-full", account.bar)}
            style={{ width: `${account.used}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          {account.used}% of budget used
        </p>
      </div>
    ))}
  </div>
);

const ReceiptVisual = () => (
  <div className="flex h-full items-center justify-center gap-4">
    <div className="relative w-32 overflow-hidden rounded-lg bg-[#e8ecf2] p-3 text-[#1b2230] shadow-xl">
      <p className="text-center text-[9px] font-bold tracking-wide">WHOLE FOODS</p>
      <div className="mt-2 space-y-1">
        {["w-16", "w-20", "w-12", "w-[4.5rem]"].map((width, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className={cn("h-1 rounded bg-[#1b2230]/25", width)} />
            <span className="h-1 w-5 rounded bg-[#1b2230]/25" />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between border-t border-dashed border-[#1b2230]/30 pt-1.5 text-[9px] font-bold">
        <span>TOTAL</span>
        <span>$84.20</span>
      </div>
      <span className="animate-scan absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-sky-400/40 to-transparent" />
      <span className="animate-scan absolute inset-x-0 h-px bg-sky-400 shadow-[0_0_12px_2px_rgb(56_189_248/0.7)]" />
    </div>
    <ul className="space-y-1.5">
      {[
        ["Amount", "$84.20"],
        ["Date", "Oct 6"],
        ["Category", "Food"],
      ].map(([label, value]) => (
        <li
          key={label}
          className="rounded-lg border border-white/8 bg-card px-2.5 py-1.5"
        >
          <p className="text-[9px] text-muted-foreground">{label}</p>
          <p className="text-xs font-medium text-foreground">{value}</p>
        </li>
      ))}
    </ul>
  </div>
);

const AlertVisual = () => (
  <div className="flex h-full flex-col justify-center gap-2.5">
    <div className="rounded-xl border border-white/8 bg-card p-3 opacity-50">
      <div className="h-1.5 w-24 rounded bg-white/15" />
      <div className="mt-2 h-1.5 w-36 rounded bg-white/8" />
    </div>
    <div className="rounded-xl border border-orange-400/30 bg-card p-3 shadow-[0_0_30px_-8px_rgb(249_115_22/0.4)]">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-orange-400/15 text-orange-300">
          <BellRing className="size-3.5" />
        </span>
        <p className="text-xs font-semibold text-foreground">Budget alert</p>
        <span className="ml-auto text-[10px] text-muted-foreground">now</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Your <span className="text-foreground">Travel</span> account has used
        92% of its monthly budget.
      </p>
    </div>
  </div>
);

const RECURRING = [
  { label: "Rent", icon: Home, every: "Monthly", next: "Nov 1", amount: "-$1,400" },
  { label: "Salary", icon: Briefcase, every: "Monthly", next: "Nov 1", amount: "+$4,200" },
  { label: "Gym", icon: Dumbbell, every: "Weekly", next: "Oct 13", amount: "-$15" },
];

const RecurringVisual = () => (
  <ul className="flex h-full flex-col justify-center divide-y divide-white/6 rounded-xl border border-white/8 bg-card px-3">
    {RECURRING.map((item) => (
      <li key={item.label} className="flex items-center gap-2.5 py-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
          <item.icon className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-foreground">{item.label}</p>
          <p className="text-[10px] text-muted-foreground">
            {item.every} · next {item.next}
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-semibold",
            item.amount.startsWith("+") ? "text-success" : "text-foreground",
          )}
        >
          {item.amount}
        </span>
      </li>
    ))}
  </ul>
);

const CATEGORY_BARS = [
  { label: "Food", share: 38, color: "#f59e0b" },
  { label: "Housing", share: 26, color: "#6366f1" },
  { label: "Transport", share: 14, color: "#2679f3" },
  { label: "Health", share: 12, color: "#22c55e" },
];

const SummaryVisual = () => (
  <div className="flex h-full flex-col justify-center rounded-xl border border-white/8 bg-card p-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-foreground">October summary</p>
      <p className="text-[10px] text-muted-foreground">$1,920 spent</p>
    </div>
    <ul className="mt-3 space-y-2">
      {CATEGORY_BARS.map((bar) => (
        <li key={bar.label}>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">{bar.label}</span>
            <span className="text-foreground">{bar.share}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full"
              style={{ width: `${bar.share * 2.2}%`, backgroundColor: bar.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const Features = () => (
  <section id="features" className="scroll-mt-20 py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Features</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          Everything you need to stay on budget
        </h2>
        <p className="mt-5 text-pretty text-muted-foreground sm:text-lg">
          The tracking you'd do in a spreadsheet, with an assistant that spots
          problems early and explains them.
        </p>
      </div>

      <ul className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Tile
          index={0}
          className="md:col-span-2 lg:col-span-4"
          icon={PiggyBank}
          tone="text-cyan-300"
          eyebrow="Accounts & budgets"
          title="A health check on every account"
          description="Separate accounts for each goal, each with its own monthly budget and a Healthy, At Risk or Overdrawn status you can read at a glance."
        >
          <AccountsVisual />
        </Tile>
        <Tile
          index={1}
          className="lg:col-span-2"
          icon={ScanLine}
          tone="text-sky-300"
          eyebrow="Receipt scanning"
          title="Snap it, done"
          description="AI reads the receipt and fills in the amount, date, category and description."
        >
          <ReceiptVisual />
        </Tile>
        <Tile
          index={2}
          className="lg:col-span-2"
          icon={BellRing}
          tone="text-orange-300"
          eyebrow="Budget alerts"
          title="A heads-up at 90%"
          description="An email when an account reaches 90% of its budget, while there's still time to adjust."
        >
          <AlertVisual />
        </Tile>
        <Tile
          index={3}
          className="lg:col-span-2"
          icon={Repeat}
          tone="text-emerald-300"
          eyebrow="Recurring transactions"
          title="Bills on autopilot"
          description="Rent, salary and subscriptions post themselves daily, weekly, monthly or yearly."
        >
          <RecurringVisual />
        </Tile>
        <Tile
          index={4}
          className="md:col-span-2 lg:col-span-2"
          icon={ShoppingBag}
          tone="text-rose-300"
          eyebrow="Monthly summaries"
          title="Your month, in your inbox"
          description="A category breakdown every month, with AI tips on where to cut back."
        >
          <SummaryVisual />
        </Tile>
      </ul>
    </div>
  </section>
);

export default Features;
