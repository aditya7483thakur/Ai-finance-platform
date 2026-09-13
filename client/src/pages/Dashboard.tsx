import RecentTransactions from "@/components/custom/RecentTransactions";
import ExpenseBreakdown from "@/components/custom/ExpenseBreakdown";
import Accounts from "@/components/custom/Accounts";
import { useUserContext } from "@/contexts/userContext";
import { useAskBudgetly } from "@/hooks/useAskBudgetly";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useEffect, useMemo, useState } from "react";
import { AccountType } from "@/types";
import { balanceToneClass, formatMoney, toAmount } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Plus, Sparkles, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const AGENT_CHIPS = [
  { label: "Analyze spending", prompt: "Analyze my spending" },
  { label: "Simulate expense", prompt: "Simulate an expense" },
  { label: "Budget insights", prompt: "Find budget risks" },
  { label: "Can I afford this?", prompt: "Can I afford this purchase?" },
];

const Dashboard = () => {
  const { userId } = useUserContext();
  const openAsk = useAskBudgetly();
  const { data: accounts, isPending: accountsLoading } =
    useGetAllAccounts(userId);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [agentDraft, setAgentDraft] = useState("");

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

  const totals = useMemo(() => {
    const list = (accounts?.data ?? []) as AccountType[];
    return list.reduce(
      (
        summary: { balance: number; spent: number; remaining: number },
        account: AccountType,
      ) => {
        const budget = toAmount(account.budget);
        const used = toAmount(account.usedAmount);
        return {
          balance: summary.balance + toAmount(account.balance),
          spent: summary.spent + used,
          remaining:
            summary.remaining + (budget > 0 ? budget - used : 0),
        };
      },
      { balance: 0, spent: 0, remaining: 0 },
    );
  }, [accounts?.data]);

  const alerts = accountList.flatMap((account) => {
    const issues: { account: AccountType; message: string; overdrawn: boolean }[] =
      [];
    const balance = toAmount(account.balance);
    const budget = toAmount(account.budget);
    const used = toAmount(account.usedAmount);

    if (balance < 0) {
      issues.push({
        account,
        message: `${account.name} is overdrawn`,
        overdrawn: true,
      });
    }

    if (budget > 0 && used > budget) {
      issues.push({
        account,
        message: `${account.name} budget exceeded`,
        overdrawn: false,
      });
    } else if (budget > 0 && used / budget >= 0.9) {
      issues.push({
        account,
        message: `${account.name} budget almost exhausted`,
        overdrawn: false,
      });
    }

    return issues;
  });

  const selectedBalance = toAmount(selectedAccount?.balance);
  const selectedBudget = toAmount(selectedAccount?.budget);
  const selectedUsed = toAmount(selectedAccount?.usedAmount);
  const selectedHasBudget = Boolean(selectedAccount?.budget);
  const selectedPercent = selectedHasBudget
    ? Math.min(100, (selectedUsed / selectedBudget) * 100)
    : 0;

  const submitAgent = (prompt: string) => {
    const nextPrompt = prompt.trim();
    if (!nextPrompt) {
      openAsk();
      return;
    }
    openAsk(nextPrompt);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your financial overview at a glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/add-transaction">
                <Plus className="size-4" aria-hidden />
                Add Transaction
              </Link>
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" aria-hidden />
              Add Account
            </Button>
          </div>
        </header>

        <section className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-5">
          <div className="mb-3 flex items-start gap-2">
            <Sparkles className="mt-0.5 size-4 text-ai" aria-hidden />
            <div>
              <h3 className="text-sm font-semibold text-indigo-950">
                Ask Budgetly
              </h3>
              <p className="text-xs text-indigo-800/80">
                Ask questions, analyze your spending, or simulate a financial
                decision.
              </p>
            </div>
          </div>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              submitAgent(agentDraft);
              setAgentDraft("");
            }}
          >
            <label className="sr-only" htmlFor="dashboard-agent-input">
              Ask anything about your finances
            </label>
            <Input
              id="dashboard-agent-input"
              value={agentDraft}
              onChange={(event) => setAgentDraft(event.target.value)}
              placeholder="Ask anything about your finances..."
              className="border-indigo-200 bg-white"
            />
            <Button
              type="submit"
              className="bg-ai text-ai-foreground hover:bg-ai/90"
            >
              Ask
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {AGENT_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => submitAgent(chip.prompt)}
                className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-900 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Combined balance
              </p>
              <p
                className={cn(
                  "mt-1 text-4xl font-semibold tracking-tight",
                  balanceToneClass(totals.balance),
                )}
              >
                {formatMoney(totals.balance)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total spent
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {formatMoney(totals.spent)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Budget remaining
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-semibold",
                  totals.remaining < 0 ? "text-red-600" : "text-slate-900",
                )}
              >
                {formatMoney(totals.remaining)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total accounts
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {accountList.length}
              </p>
            </div>
          </div>
        </section>

        {alerts.length > 0 && (
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Attention required
            </h3>
            <div className="mt-3 space-y-3">
              {alerts.map((alert) => (
                  <div
                    key={`${alert.account.id}-${alert.message}`}
                    className={cn(
                      "flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
                      alert.overdrawn
                        ? "border border-red-200 bg-red-50"
                        : "border border-amber-200 bg-amber-50",
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium",
                          alert.overdrawn ? "text-red-800" : "text-amber-950",
                        )}
                      >
                        <TriangleAlert className="size-4" aria-hidden />
                        {alert.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Current balance{" "}
                        <span className={balanceToneClass(alert.account.balance)}>
                          {formatMoney(alert.account.balance)}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
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
            </div>
          </section>
        )}

        <Accounts
          accounts={accountList}
          accountsLoading={accountsLoading}
          selectedAccountId={selectedAccount?.id}
          onAccountClick={setSelectedAccount}
          createOpen={createOpen}
          onCreateOpenChange={setCreateOpen}
        />

        <section>
          <h3 className="text-lg font-semibold text-slate-900">
            Budget overview
          </h3>
          {selectedAccount ? (
            <div className="mt-4 grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedAccount.name}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                  Current balance
                </p>
                <p
                  className={cn(
                    "mt-1 text-3xl font-semibold",
                    balanceToneClass(selectedBalance),
                  )}
                >
                  {formatMoney(selectedBalance)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedBalance < 0 ? "Below zero" : "Available in this account"}
                </p>
              </div>
              <div className="border-t border-slate-200 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Budget
                </p>
                {selectedHasBudget ? (
                  <>
                    <p className="mt-2 text-sm text-slate-700">
                      {formatMoney(selectedUsed)} spent of{" "}
                      {formatMoney(selectedBudget)}
                    </p>
                    <Progress value={selectedPercent} className="mt-3 h-2" />
                    <div className="mt-2 flex justify-between text-sm text-slate-500">
                      <span>
                        {formatMoney(selectedBudget - selectedUsed)} remaining
                      </span>
                      <span>{Math.round(selectedPercent)}% used</span>
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No budget set for this account.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Add an account to see budget usage separately from balance.
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ExpenseBreakdown />
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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
