import RecentTransactions from "@/components/custom/RecentTransactions";
import ExpenseBreakdown from "@/components/custom/ExpenseBreakdown";
import Accounts from "@/components/custom/Accounts";
import TransactionGraph from "@/components/custom/TransactionGraph";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AccountType } from "@/types";
import { dashControl } from "@/lib/dashboard-chrome";
import { formatMoney, toAmount } from "@/lib/money";
import {
  getAccountAlerts,
  getAccountsAtRisk,
  getFinancialHealth,
  greetingForHour,
} from "@/lib/account-health";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FlaskConical,
  Gauge,
  PieChart,
  Plus,
  Shield,
  ShieldCheck,
  Target,
  TriangleAlert,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AGENT_CHIPS = [
  {
    label: "Simulate an expense",
    prompt: "Simulate an expense",
    icon: FlaskConical,
    tone: "bg-violet-400/15 text-violet-400",
  },
  {
    label: "Analyze my spending",
    prompt: "Analyze my spending",
    icon: BarChart3,
    tone: "bg-sky-400/15 text-sky-400",
  },
  {
    label: "Check budget risks",
    prompt: "Find budget risks",
    icon: ShieldCheck,
    tone: "bg-violet-400/15 text-violet-400",
  },
  {
    label: "Plan a purchase",
    prompt: "Can I afford this purchase?",
    icon: Target,
    tone: "bg-emerald-400/15 text-emerald-400",
  },
];

type KpiKey = "balance" | "spent" | "remaining" | "risk";

const MiniSpark = ({ color, bars }: { color: string; bars: number[] }) => (
  <div className="flex h-6 items-end gap-[2px]" aria-hidden>
    {bars.map((height, index) => (
      <span
        key={`${color}-${index}`}
        className="w-[2.5px] rounded-sm"
        style={{
          height: `${height}%`,
          backgroundColor: color,
          opacity: 0.35 + index * 0.08,
        }}
      />
    ))}
  </div>
);

const KpiCard = ({
  tone,
  active,
  icon: Icon,
  label,
  value,
  valueClassName,
  hint,
  sparkColor,
  spark,
  onSelect,
}: {
  tone: KpiKey;
  active: boolean;
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
  hint: string;
  sparkColor: string;
  spark: number[];
  onSelect: () => void;
}) => (
  <button
    type="button"
    data-tone={tone}
    data-active={active}
    onClick={onSelect}
    className="dash-kpi w-full"
  >
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg border bg-white/5",
          tone === "balance" && "border-cyan-400/30 text-cyan-300",
          tone === "spent" && "border-rose-400/30 text-rose-300",
          tone === "remaining" && "border-violet-400/30 text-violet-300",
          tone === "risk" && "border-orange-400/30 text-orange-300",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <p
            className={cn(
              "text-2xl font-semibold tracking-tight text-foreground",
              valueClassName,
            )}
          >
            {value}
          </p>
          <MiniSpark color={sparkColor} bars={spark} />
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  </button>
);

const Panel = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={cn("rounded-2xl border border-border bg-card p-5", className)}
  >
    {children}
  </section>
);

const Dashboard = () => {
  const { user, userId } = useUserContext();
  const openAsk = useAskBudgetly();
  const location = useLocation();
  const { data: accounts, isPending: accountsLoading } =
    useGetAllAccounts(userId);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [activeKpi, setActiveKpi] = useState<KpiKey>("balance");

  const accountList: AccountType[] = (accounts?.data ?? []) as AccountType[];

  useEffect(() => {
    const list = (accounts?.data ?? []) as AccountType[];
    if (!list.length) {
      setSelectedAccount(null);
      return;
    }

    setSelectedAccount((current) => {
      if (!current) {
        return list[0];
      }

      return (
        list.find((account: AccountType) => account.id === current.id) ??
        list[0]
      );
    });
  }, [accounts?.data]);

  useEffect(() => {
    if (location.hash !== "#accounts") {
      return;
    }
    document
      .getElementById("accounts")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, accountsLoading]);

  const totals = useMemo(() => {
    const list = (accounts?.data ?? []) as AccountType[];
    return list.reduce(
      (
        summary: {
          balance: number;
          spent: number;
          remaining: number;
          budget: number;
        },
        account: AccountType,
      ) => {
        const budget = toAmount(account.budget);
        const used = toAmount(account.usedAmount);
        return {
          balance: summary.balance + toAmount(account.balance),
          spent: summary.spent + used,
          remaining: summary.remaining + (budget > 0 ? budget - used : 0),
          budget: summary.budget + budget,
        };
      },
      { balance: 0, spent: 0, remaining: 0, budget: 0 },
    );
  }, [accounts?.data]);

  const alerts = getAccountAlerts(accountList);
  const atRisk = getAccountsAtRisk(accountList);
  const health = getFinancialHealth(accountList);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const greeting = greetingForHour();

  const submitAgent = (prompt: string) => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt) {
      openAsk();
      return;
    }
    openAsk(nextPrompt);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 lg:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {greeting}, {firstName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {alerts.length === 0
                ? "Your finances are looking good this month."
                : "A few accounts need attention this month."}
            </p>
          </div>
          <Button size="sm" variant="outline" className={dashControl} asChild>
            <Link to="/dashboard/add-transaction">
              <Plus className="size-4" aria-hidden />
              Add Transaction
            </Link>
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            tone="balance"
            active={activeKpi === "balance"}
            icon={Wallet}
            label="Total Balance"
            value={formatMoney(totals.balance)}
            valueClassName={totals.balance < 0 ? "text-error" : undefined}
            hint={`Across ${accountList.length} account${accountList.length === 1 ? "" : "s"}`}
            sparkColor="#22d3ee"
            spark={[28, 46, 38, 62, 54, 78, 70]}
            onSelect={() => setActiveKpi("balance")}
          />
          <KpiCard
            tone="spent"
            active={activeKpi === "spent"}
            icon={TrendingUp}
            label="Total Spent"
            value={formatMoney(totals.spent)}
            hint={
              totals.budget > 0
                ? `${formatMoney(totals.spent)} of ${formatMoney(totals.budget)} used`
                : "No budgets set yet"
            }
            sparkColor="#fb7185"
            spark={[40, 32, 58, 44, 70, 52, 84]}
            onSelect={() => setActiveKpi("spent")}
          />
          <KpiCard
            tone="remaining"
            active={activeKpi === "remaining"}
            icon={PieChart}
            label="Budget Remaining"
            value={formatMoney(totals.remaining)}
            valueClassName={totals.remaining < 0 ? "text-error" : undefined}
            hint={
              totals.budget > 0
                ? `${Math.round((totals.spent / totals.budget) * 100)}% of ${formatMoney(totals.budget)} used`
                : "Set a budget to track leftover"
            }
            sparkColor="#a78bfa"
            spark={[34, 50, 42, 66, 48, 72, 60]}
            onSelect={() => setActiveKpi("remaining")}
          />
          <KpiCard
            tone="risk"
            active={activeKpi === "risk"}
            icon={TriangleAlert}
            label="Accounts at Risk"
            value={String(atRisk.length)}
            hint={
              atRisk[0]
                ? `${atRisk[0].name} needs attention`
                : "All accounts look healthy"
            }
            sparkColor="#fb923c"
            spark={[22, 36, 28, 48, 40, 64, 52]}
            onSelect={() => {
              setActiveKpi("risk");
              if (alerts.length) {
                document
                  .getElementById("accounts")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          />
        </section>

        {alerts.length > 0 && (
          <section className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={`${alert.account.id}-${alert.message}`}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                  alert.overdrawn
                    ? "border border-error/30 bg-error/10"
                    : "border border-warning/30 bg-warning/10",
                )}
              >
                <div>
                  <p
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium",
                      alert.overdrawn ? "text-error" : "text-warning",
                    )}
                  >
                    <TriangleAlert className="size-4" aria-hidden />
                    {alert.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current balance {formatMoney(alert.account.balance)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className={dashControl}
                  onClick={() => {
                    setSelectedAccount(alert.account);
                    document
                      .getElementById("accounts")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  View Account
                </Button>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <Panel className="xl:col-span-3">
            <TransactionGraph
              accountId={selectedAccount?.id}
              currentBalance={toAmount(selectedAccount?.balance)}
              variant="embedded"
              title="Cash Flow"
              subtitle="Income vs expenses"
              accountName={selectedAccount?.name}
            />
          </Panel>
          <Panel className="xl:col-span-2">
            <ExpenseBreakdown />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <Panel className="xl:col-span-3">
            <Accounts
              accounts={accountList}
              accountsLoading={accountsLoading}
              selectedAccountId={selectedAccount?.id}
              onAccountClick={setSelectedAccount}
              createOpen={createOpen}
              onCreateOpenChange={setCreateOpen}
            />
          </Panel>
          <Panel className="xl:col-span-2">
            <RecentTransactions
              accounts={accountList}
              accountsLoading={accountsLoading}
              selectedAccountId={selectedAccount?.id}
              onAccountSelect={(accountId) => {
                const match = accountList.find(
                  (account) => account.id === accountId,
                );
                if (match) {
                  setSelectedAccount(match);
                }
              }}
            />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <Panel className="xl:col-span-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-success/10 text-success">
                  <Shield className="size-4" aria-hidden />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Financial Health
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    A quick view of your financial wellness.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="size-4 text-muted-foreground" aria-hidden />
                <p className="text-sm font-semibold text-foreground">
                  {health.score}
                  <span className="text-muted-foreground"> / 100</span>
                </p>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                  {health.label}
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-error via-warning to-success"
                style={{ width: `${Math.max(6, health.score)}%` }}
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">{health.detail}</p>
              <button
                type="button"
                onClick={() => submitAgent("Find budget risks")}
                className="shrink-0 text-xs font-medium text-primary hover:underline"
              >
                View recommendations →
              </button>
            </div>
          </Panel>
          <Panel className="xl:col-span-2">
            <h3 className="text-sm font-semibold text-foreground">
              Quick Actions
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {AGENT_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => submitAgent(chip.prompt)}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2.5 text-left text-sm text-foreground hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md",
                      chip.tone,
                    )}
                  >
                    <chip.icon className="size-3.5" aria-hidden />
                  </span>
                  {chip.label}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
