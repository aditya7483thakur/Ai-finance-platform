import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  Briefcase,
  Dumbbell,
  MoreHorizontal,
  PiggyBank,
  Plane,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { AccountType } from "@/types";
import { cn } from "@/lib/utils";
import { balanceToneClass, formatMoney, formatShortDate, toAmount } from "@/lib/money";
import { getAccountHealth } from "@/lib/account-health";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ICON_RULES: { match: RegExp; icon: LucideIcon; tone: string }[] = [
  { match: /gym|fit|health|sport/i, icon: Dumbbell, tone: "bg-error/15 text-error" },
  { match: /shop|store|market/i, icon: ShoppingBag, tone: "bg-success/15 text-success" },
  { match: /sav|bank|invest/i, icon: PiggyBank, tone: "bg-primary/15 text-primary" },
  { match: /free|work|business|job/i, icon: Briefcase, tone: "bg-accent/15 text-accent" },
  { match: /travel|vacation|trip|holiday/i, icon: Plane, tone: "bg-warning/15 text-warning" },
];

const iconFor = (name: string) =>
  ICON_RULES.find((rule) => rule.match.test(name)) ?? {
    icon: Wallet,
    tone: "bg-primary/15 text-primary",
  };

const HEALTH_TONE: Record<string, string> = {
  healthy: "bg-success/15 text-success",
  risk: "bg-warning/15 text-warning",
  overdrawn: "bg-error/15 text-error",
};

const SPARK_TONES: Record<string, string> = {
  healthy: "#22c55e",
  risk: "#f59e0b",
  overdrawn: "#f43f5e",
};

// Deterministic pseudo-random sparkline so each card keeps a stable shape.
const buildSpark = (seed: string, tone: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }

  return Array.from({ length: 12 }, (_, index) => {
    hash = (hash * 1103515245 + 12345) % 2147483648;
    const wobble = (hash % 40) - 20;
    const trend = tone === "overdrawn" ? -index * 2 : index * 1.5;
    return { value: Math.max(6, 50 + wobble + trend) };
  });
};

interface AccountCardProps {
  account: AccountType;
  onEdit?: (account: AccountType) => void;
  onViewTransactions?: (account: AccountType) => void;
}

const AccountActions = ({
  account,
  onEdit,
  onViewTransactions,
}: AccountCardProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="rounded-md p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Actions for ${account.name}`}
      >
        <MoreHorizontal className="size-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44">
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => onEdit?.(account)}
      >
        Edit account
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => onViewTransactions?.(account)}
      >
        View transactions
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const AccountCard = ({
  account,
  onEdit,
  onViewTransactions,
}: AccountCardProps) => {
  const balance = toAmount(account.balance);
  const budget = toAmount(account.budget);
  const used = toAmount(account.usedAmount);
  const remaining = budget - used;
  const hasBudget = budget > 0;
  const budgetPercent = hasBudget ? Math.min(100, (used / budget) * 100) : 0;

  const health = getAccountHealth(account);
  const { icon: Icon, tone: iconTone } = iconFor(account.name);
  const sparkColor = SPARK_TONES[health.tone];
  const spark = useMemo(
    () => buildSpark(account.id, health.tone),
    [account.id, health.tone],
  );

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              iconTone,
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <h3 className="truncate text-base font-semibold text-foreground">
            {account.name}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
            HEALTH_TONE[health.tone],
          )}
        >
          {health.label}
        </span>
      </div>

      <p
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight",
          balanceToneClass(balance),
        )}
      >
        {formatMoney(balance)}
      </p>

      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${account.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparkColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={sparkColor}
              strokeWidth={1.5}
              fill={`url(#spark-${account.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monthly Budget</span>
          <span className="font-medium text-foreground">
            {hasBudget ? formatMoney(budget) : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-medium text-foreground">{formatMoney(used)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span
            className={cn(
              "font-medium",
              remaining < 0 ? "text-error" : "text-foreground",
            )}
          >
            {hasBudget ? formatMoney(remaining) : "—"}
          </span>
        </div>
        {hasBudget && (
          <div className="pt-1">
            <Progress value={budgetPercent} className="h-1.5" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {Math.round(budgetPercent)}% used
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[11px] text-muted-foreground">
          Created on {formatShortDate(account.createdAt)}
        </span>
        <AccountActions
          account={account}
          onEdit={onEdit}
          onViewTransactions={onViewTransactions}
        />
      </div>
    </div>
  );
};

// Shared column template so the list header and rows stay aligned.
export const ACCOUNT_ROW_GRID =
  "md:grid md:grid-cols-[minmax(0,2fr)_96px_repeat(4,minmax(0,1fr))_minmax(0,1.2fr)_32px] md:items-center md:gap-4";

export const AccountListItem = ({
  account,
  onEdit,
  onViewTransactions,
}: AccountCardProps) => {
  const balance = toAmount(account.balance);
  const budget = toAmount(account.budget);
  const used = toAmount(account.usedAmount);
  const remaining = budget - used;
  const hasBudget = budget > 0;
  const budgetPercent = hasBudget ? Math.min(100, (used / budget) * 100) : 0;

  const health = getAccountHealth(account);
  const { icon: Icon, tone: iconTone } = iconFor(account.name);

  const statusBadge = (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
        HEALTH_TONE[health.tone],
      )}
    >
      {health.label}
    </span>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02]",
        ACCOUNT_ROW_GRID,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              iconTone,
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {account.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Created {formatShortDate(account.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:hidden">
          {statusBadge}
          <AccountActions
            account={account}
            onEdit={onEdit}
            onViewTransactions={onViewTransactions}
          />
        </div>
      </div>

      <div className="hidden md:block">{statusBadge}</div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4 md:contents">
        <div>
          <dt className="text-[11px] text-muted-foreground md:sr-only">Balance</dt>
          <dd className={cn("font-semibold", balanceToneClass(balance))}>
            {formatMoney(balance)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground md:sr-only">Budget</dt>
          <dd className="font-medium text-foreground">
            {hasBudget ? formatMoney(budget) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground md:sr-only">Spent</dt>
          <dd className="font-medium text-foreground">{formatMoney(used)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted-foreground md:sr-only">Remaining</dt>
          <dd
            className={cn(
              "font-medium",
              remaining < 0 ? "text-error" : "text-foreground",
            )}
          >
            {hasBudget ? formatMoney(remaining) : "—"}
          </dd>
        </div>
      </dl>

      <div>
        {hasBudget ? (
          <div className="flex items-center gap-2">
            <Progress value={budgetPercent} className="h-1.5 flex-1" />
            <span className="w-9 shrink-0 text-right text-[11px] text-muted-foreground">
              {Math.round(budgetPercent)}%
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground">No budget</span>
        )}
      </div>

      <div className="hidden justify-end md:flex">
        <AccountActions
          account={account}
          onEdit={onEdit}
          onViewTransactions={onViewTransactions}
        />
      </div>
    </div>
  );
};

export default AccountCard;
