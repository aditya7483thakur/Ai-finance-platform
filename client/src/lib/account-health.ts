import { AccountType } from "@/types";
import { toAmount } from "@/lib/money";

export type AccountAlert = {
  account: AccountType;
  message: string;
  overdrawn: boolean;
};

export function getAccountAlerts(accounts: AccountType[]): AccountAlert[] {
  return accounts.flatMap((account) => {
    const issues: AccountAlert[] = [];
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
}

export function getAccountsAtRisk(accounts: AccountType[]): AccountType[] {
  const ids = new Set(getAccountAlerts(accounts).map((alert) => alert.account.id));
  return accounts.filter((account) => ids.has(account.id));
}

export function getFinancialHealth(accounts: AccountType[]) {
  if (!accounts.length) {
    return {
      score: 0,
      label: "Get started",
      detail: "Add an account to see a snapshot of your financial wellness.",
    };
  }

  const alerts = getAccountAlerts(accounts);
  const overdrawn = accounts.filter((account) => toAmount(account.balance) < 0).length;
  const budgeted = accounts.filter((account) => toAmount(account.budget) > 0);
  const exceeded = budgeted.filter(
    (account) => toAmount(account.usedAmount) > toAmount(account.budget),
  ).length;
  const tight = budgeted.filter((account) => {
    const ratio = toAmount(account.usedAmount) / toAmount(account.budget);
    return ratio >= 0.9 && ratio <= 1;
  }).length;

  let score = 78;
  score -= overdrawn * 22;
  score -= exceeded * 16;
  score -= tight * 8;

  if (budgeted.length) {
    const averageUsed =
      budgeted.reduce((sum, account) => {
        const budget = toAmount(account.budget);
        return sum + Math.min(1, toAmount(account.usedAmount) / budget);
      }, 0) / budgeted.length;
    score += Math.round((1 - averageUsed) * 18);
  } else {
    score -= 6;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const label =
    score >= 80 ? "Good" : score >= 60 ? "Fair" : score >= 40 ? "Watch" : "At risk";

  const pressure = exceeded + overdrawn;
  const detail =
    alerts.length === 0
      ? "You're on track across your accounts. Keep spending within budget."
      : pressure > 0
        ? `You're ${overdrawn > 0 ? "overdrawn" : "over budget"} across ${pressure} account${pressure === 1 ? "" : "s"}. Keep track to stay on target.`
        : "A few budgets are almost exhausted. Keep track to stay on target.";

  return { score, label, detail };
}

export function greetingForHour(hour = new Date().getHours()) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
