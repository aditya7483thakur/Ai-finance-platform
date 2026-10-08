import { ArrowRight, TriangleAlert, Wallet } from "lucide-react";
import { AccountType, Transaction } from "@/types";
import { formatMoney, toAmount } from "@/lib/money";
import { getAccountHealth } from "@/lib/account-health";
import { cn } from "@/lib/utils";

const HEALTH_TONE: Record<string, string> = {
  healthy: "bg-success/15 text-success",
  risk: "bg-warning/15 text-warning",
  overdrawn: "bg-error/15 text-error",
};

// Mirrors server/shared/utils/ledger.ts: income adds to the balance;
// an expense lowers the balance and counts against the budget.
const applyEntry = (
  amounts: { balance: number; used: number },
  type: "INCOME" | "EXPENSE",
  amount: number,
  direction: 1 | -1,
) =>
  type === "INCOME"
    ? { ...amounts, balance: amounts.balance + direction * amount }
    : {
        balance: amounts.balance - direction * amount,
        used: amounts.used + direction * amount,
      };

const TransactionImpact = ({
  account,
  type,
  amount,
  original,
}: {
  account?: AccountType;
  type: "INCOME" | "EXPENSE";
  amount: number | null;
  // When editing, the saved transaction is reversed before the new one applies.
  original?: Transaction | null;
}) => {
  if (!account) {
    return (
      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold text-foreground">Account impact</p>
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/10 p-4">
          <Wallet className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-xs text-muted-foreground">
            Pick an account to see how this changes its balance and budget.
          </p>
        </div>
      </section>
    );
  }

  const before = {
    balance: toAmount(account.balance),
    used: toAmount(account.usedAmount),
  };
  let after = before;
  if (original && original.accountId === account.id) {
    after = applyEntry(after, original.type, Math.abs(toAmount(original.amount)), -1);
  }
  if (amount != null) {
    after = applyEntry(after, type, amount, 1);
  }

  const budget = toAmount(account.budget);
  const hasBudget = budget > 0;
  const pct = (used: number) => (hasBudget ? (used / budget) * 100 : 0);
  const beforePct = pct(before.used);
  const afterPct = pct(after.used);

  const healthAfter = getAccountHealth({
    ...account,
    balance: after.balance,
    usedAmount: after.used,
  });
  const healthBefore = getAccountHealth(account);
  const changed =
    after.balance !== before.balance || after.used !== before.used;

  const warning =
    after.balance < 0 && before.balance >= 0
      ? `This puts ${account.name} below zero.`
      : hasBudget && afterPct > 100 && beforePct <= 100
        ? `This takes ${account.name} over its monthly budget.`
        : hasBudget && afterPct >= 90 && beforePct < 90
          ? `${account.name} will reach ${Math.round(afterPct)}% of its budget, the point where Budgetly emails a budget alert.`
          : null;

  return (
    <section
      aria-live="polite"
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Account impact</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium",
            HEALTH_TONE[healthAfter.tone],
          )}
        >
          {changed && healthAfter.tone !== healthBefore.tone
            ? `Becomes ${healthAfter.label}`
            : healthAfter.label}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{account.name}</p>

      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-xs text-muted-foreground">Balance</dt>
          <dd className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
            <span
              className={cn(
                "tabular-nums",
                changed ? "text-muted-foreground" : "font-semibold text-foreground",
              )}
            >
              {formatMoney(before.balance)}
            </span>
            {changed && (
              <>
                <ArrowRight
                  className="size-3.5 self-center text-muted-foreground"
                  aria-label="becomes"
                />
                <span
                  className={cn(
                    "text-base font-semibold tabular-nums",
                    after.balance < 0 ? "text-error" : "text-foreground",
                  )}
                >
                  {formatMoney(after.balance)}
                </span>
              </>
            )}
          </dd>
        </div>

        <div>
          <dt className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly budget</span>
            {hasBudget && (
              <span className="tabular-nums">
                {formatMoney(after.used)} of {formatMoney(budget)}
              </span>
            )}
          </dt>
          <dd className="mt-2">
            {hasBudget ? (
              <>
                <div
                  className="relative h-2 overflow-hidden rounded-full bg-white/8"
                  role="img"
                  aria-label={`${Math.round(afterPct)}% of budget used after this transaction`}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-white/20"
                    style={{ width: `${Math.min(100, beforePct)}%` }}
                  />
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-[width] duration-300",
                      afterPct > 100
                        ? "bg-error"
                        : afterPct >= 90
                          ? "bg-warning"
                          : "bg-primary",
                    )}
                    style={{ width: `${Math.min(100, afterPct)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {Math.round(beforePct)}% used
                  {Math.round(afterPct) !== Math.round(beforePct) &&
                    ` → ${Math.round(afterPct)}%`}
                  {type === "INCOME" &&
                    amount != null &&
                    " · Income doesn't count against the budget"}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                No budget set for this account.
              </p>
            )}
          </dd>
        </div>
      </dl>

      {warning && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-xs text-warning">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {warning}
        </p>
      )}
    </section>
  );
};

export default TransactionImpact;
