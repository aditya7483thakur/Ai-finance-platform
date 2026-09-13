import {
  endOfMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { formatMoney, formatSignedMoney, toAmount } from "@/lib/money";
import { getCategoryLabel } from "@/lib/categories";
import { AccountType, Transaction, TransactionCategory } from "@/types";
import type {
  AgentReply,
  PeriodKey,
  ProposalDraft,
  SimulationDraft,
  WorkspaceSnapshot,
} from "./types";

const CATEGORY_ALIASES: { match: RegExp; value: TransactionCategory }[] = [
  { match: /food|lunch|dinner|grocery|groceries|restaurant/i, value: "FOOD" },
  { match: /shop|laptop|clothes|amazon/i, value: "SHOPPING" },
  { match: /rent|house|apartment|housing/i, value: "HOUSING" },
  { match: /uber|bus|train|gas|transport/i, value: "TRANSPORT" },
  { match: /movie|netflix|game|entertainment/i, value: "ENTERTAINMENT" },
  { match: /flight|hotel|travel/i, value: "TRAVEL" },
  { match: /gym|doctor|health|pharmacy/i, value: "HEALTH" },
  { match: /salary|paycheck|income/i, value: "SALARY" },
  { match: /invest/i, value: "INVESTMENTS" },
];

const periodRange = (period: PeriodKey) => {
  const now = new Date();
  if (period === "week") {
    return { start: startOfWeek(now), end: now, label: "this week" };
  }
  if (period === "last_month") {
    const start = startOfMonth(subMonths(now, 1));
    return { start, end: endOfMonth(start), label: "last month" };
  }
  return { start: startOfMonth(now), end: now, label: "this month" };
};

const inPeriod = (value: string | Date, period: PeriodKey) => {
  const { start, end } = periodRange(period);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return isWithinInterval(date, { start, end });
};

const parseAmount = (prompt: string) => {
  const match = prompt.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
  return match ? Number(match[1]) : null;
};

const parseCategory = (prompt: string): TransactionCategory | null => {
  const found = CATEGORY_ALIASES.find((item) => item.match.test(prompt));
  return found?.value ?? null;
};

const parseAccount = (prompt: string, accounts: AccountType[]) =>
  accounts.find((account) =>
    prompt.toLowerCase().includes(account.name.toLowerCase()),
  ) ?? null;

const parsePeriod = (prompt: string): PeriodKey | null => {
  if (/last month/i.test(prompt)) return "last_month";
  if (/this week|last 7|past week/i.test(prompt)) return "week";
  if (/this month|summarize this month/i.test(prompt)) return "month";
  return null;
};

const parseDate = (prompt: string) => {
  if (/yesterday/i.test(prompt)) {
    return subDays(new Date(), 1);
  }
  if (/next week/i.test(prompt)) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  return new Date();
};

const isIncomePrompt = (prompt: string) =>
  /income|salary|received|deposit|got paid/i.test(prompt);

const expensesIn = (transactions: Transaction[], period: PeriodKey) =>
  transactions.filter(
    (row) => row.type === "EXPENSE" && inPeriod(row.date, period),
  );

const incomeIn = (transactions: Transaction[], period: PeriodKey) =>
  transactions.filter(
    (row) => row.type === "INCOME" && inPeriod(row.date, period),
  );

const sumAmount = (rows: Transaction[]) =>
  rows.reduce((sum, row) => sum + toAmount(row.amount), 0);

const groupExpenses = (rows: Transaction[]) => {
  const grouped = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + toAmount(row.amount);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
};

const simulationTitle = (prompt: string) => {
  const match = prompt.match(
    /(?:buy|purchase|afford|for|simulate)\s+(?:a|an|the)?\s*([a-zA-Z][\w\s-]{1,24})/i,
  );
  if (match?.[1]) {
    const name = match[1].replace(/\b(expense|purchase|transaction)\b/i, "").trim();
    if (name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)} purchase`;
    }
  }
  return "Expense simulation";
};

const buildDraft = (
  prompt: string,
  account: AccountType,
  amount: number,
): ProposalDraft => {
  const type = isIncomePrompt(prompt) ? "INCOME" : "EXPENSE";
  const category =
    parseCategory(prompt) ?? (type === "INCOME" ? "SALARY" : "MISCELLANEOUS");
  const date = parseDate(prompt).toISOString();

  return {
    amount,
    type,
    accountId: account.id,
    accountName: account.name,
    category,
    date,
    description:
      prompt.replace(/add|create|record|log|simulate|an?|the/gi, "").trim() ||
      `${getCategoryLabel(category)} ${type === "INCOME" ? "income" : "expense"}`,
  };
};

const withSimulation = (
  draft: ProposalDraft,
  account: AccountType,
): SimulationDraft => {
  const currentBalance = toAmount(account.balance);
  const used = toAmount(account.usedAmount);
  const afterBalance =
    draft.type === "INCOME"
      ? currentBalance + draft.amount
      : currentBalance - draft.amount;
  const usedAfter = draft.type === "EXPENSE" ? used + draft.amount : used;

  return {
    ...draft,
    title: simulationTitle(draft.description),
    currentBalance,
    afterBalance,
    budget: account.budget == null ? null : toAmount(account.budget),
    usedAfter,
  };
};

const missingAccountReply = (accounts: AccountType[], action: string): AgentReply => {
  if (!accounts.length) {
    return {
      kind: "error",
      text: `I couldn't ${action} because you don't have an account yet.`,
      tools: ["Checking your accounts"],
      clarification: {
        question: "Create an account first, then we can continue.",
        options: [{ label: "Go to Dashboard", prompt: "__dashboard__" }],
      },
    };
  }

  return {
    kind: "clarification",
    text: `I couldn't ${action} because you haven't selected an account.`,
    tools: ["Checking your accounts"],
    clarification: {
      question: "Would you like to use:",
      options: accounts.slice(0, 4).map((account) => ({
        label: account.name,
        prompt: `${action} on ${account.name}`,
      })),
    },
  };
};

const spendingAnalysis = (
  workspace: WorkspaceSnapshot,
  period: PeriodKey,
  accountName?: string,
): AgentReply => {
  const scoped = accountName
    ? workspace.transactions.filter((row) => {
        const account = workspace.accounts.find((item) => item.id === row.accountId);
        return account?.name.toLowerCase() === accountName.toLowerCase();
      })
    : workspace.transactions;

  const expenses = expensesIn(scoped, period);
  const income = incomeIn(scoped, period);
  const spent = sumAmount(expenses);
  const earned = sumAmount(income);
  const { label } = periodRange(period);
  const categories = groupExpenses(expenses);
  const previous =
    period === "month" ? expensesIn(scoped, "last_month") : [];
  const previousTotal = sumAmount(previous);

  let footnote: string | undefined;
  if (period === "month" && previousTotal > 0 && spent > 0) {
    const change = Math.round(((spent - previousTotal) / previousTotal) * 100);
    if (change !== 0) {
      footnote =
        change > 0
          ? `You spent ${change}% more than last month.`
          : `You spent ${Math.abs(change)}% less than last month.`;
    }
  }

  return {
    kind: "analysis",
    text:
      spent > 0
        ? `You spent ${formatMoney(spent)} ${label}${accountName ? ` in ${accountName}` : ""}.`
        : `No expenses ${label}${accountName ? ` in ${accountName}` : ""}.`,
    tools: [
      "Checking your accounts",
      "Checking your transactions",
      "Calculating your expenses",
      ...(period === "month" ? ["Comparing spending periods"] : []),
    ],
    analysis: {
      headline: spent > 0 ? `You spent ${formatMoney(spent)} ${label}.` : `No expenses ${label}.`,
      rows: [
        ...categories.slice(0, 4).map((item) => ({
          label: getCategoryLabel(item.name),
          value: formatMoney(item.value),
        })),
        { label: "Income", value: formatSignedMoney(earned, "INCOME") },
      ],
      footnote,
      href: "/dashboard",
      hrefLabel: "View Details",
    },
  };
};

const budgetRisks = (accounts: AccountType[]): AgentReply => {
  const risks = accounts.flatMap((account) => {
    const items: { label: string; value: string }[] = [];
    const balance = toAmount(account.balance);
    const budget = toAmount(account.budget);
    const used = toAmount(account.usedAmount);

    if (balance < 0) {
      items.push({
        label: account.name,
        value: `Overdrawn at ${formatMoney(balance)}`,
      });
    } else if (budget > 0 && used > budget) {
      items.push({
        label: account.name,
        value: "Budget exceeded",
      });
    } else if (budget > 0 && used / budget >= 0.9) {
      items.push({
        label: account.name,
        value: `${Math.round((used / budget) * 100)}% of budget used`,
      });
    }
    return items;
  });

  if (!risks.length) {
    return {
      kind: "analysis",
      text: "No budget risks right now. Every account with a budget is within a healthy range.",
      tools: ["Checking your accounts", "Reviewing budget usage"],
      analysis: {
        headline: "No budget risks right now.",
        rows: accounts.slice(0, 4).map((account) => ({
          label: account.name,
          value: formatMoney(account.balance),
        })),
      },
    };
  }

  return {
    kind: "insight",
    text: "I found budget risks in your workspace.",
    tools: ["Checking your accounts", "Reviewing budget usage"],
    insight: {
      body: "These accounts need attention based on your current balances and budgets.",
      stats: risks,
      href: "/dashboard",
      hrefLabel: "Review accounts",
    },
  };
};

const topCategoryInsight = (workspace: WorkspaceSnapshot): AgentReply | null => {
  const thisMonth = groupExpenses(expensesIn(workspace.transactions, "month"));
  const lastMonth = groupExpenses(expensesIn(workspace.transactions, "last_month"));
  if (!thisMonth.length) {
    return null;
  }

  const top = thisMonth[0];
  const previous = lastMonth.find((item) => item.name === top.name);
  const total = thisMonth.reduce((sum, item) => sum + item.value, 0);

  if (previous && previous.value > 0) {
    const change = Math.round(((top.value - previous.value) / previous.value) * 100);
    if (Math.abs(change) >= 10) {
      return {
        kind: "insight",
        text: `Most of your spending this month has been in ${getCategoryLabel(top.name)}.`,
        tools: [
          "Checking your transactions",
          "Calculating your expenses",
          "Comparing spending periods",
        ],
        insight: {
          body: `Your ${getCategoryLabel(top.name)} spending ${
            change > 0 ? "increased" : "decreased"
          } ${Math.abs(change)}% compared to last month.`,
          stats: [
            { label: "This month", value: formatMoney(top.value) },
            { label: "Last month", value: formatMoney(previous.value) },
          ],
          href: "/dashboard",
          hrefLabel: "Explore Spending",
        },
      };
    }
  }

  return {
    kind: "insight",
    text: `Most of your spending this month has been in ${getCategoryLabel(top.name)}.`,
    tools: ["Checking your transactions", "Calculating your expenses"],
    insight: {
      body: `${formatMoney(top.value)} of ${formatMoney(total)} total expenses.`,
      href: "/dashboard",
      hrefLabel: "Explore Spending",
    },
  };
};

export const buildAgentReply = (
  prompt: string,
  workspace: WorkspaceSnapshot,
): AgentReply => {
  const amount = parseAmount(prompt);
  const namedAccount = parseAccount(prompt, workspace.accounts);
  const period = parsePeriod(prompt);
  const accountHint = prompt.match(/account:\s*(.+)$/i)?.[1]?.trim();

  if (/__dashboard__/i.test(prompt)) {
    return {
      kind: "text",
      text: "Open Dashboard from the sidebar to create an account.",
      tools: [],
    };
  }

  if (
    /how much did i spend|how much have i spent|how much i spend/i.test(prompt) &&
    !period
  ) {
    return {
      kind: "clarification",
      text: "Which period would you like me to analyze?",
      tools: ["Checking your accounts"],
      clarification: {
        question: "Which period would you like me to analyze?",
        options: [
          { label: "This Week", prompt: "How much did I spend this week?" },
          { label: "This Month", prompt: "How much did I spend this month?" },
          { label: "Last Month", prompt: "How much did I spend last month?" },
        ],
      },
    };
  }

  if (/budget risk|overdrawn|left to spend|still spend|budget/i.test(prompt) &&
    !/simulate|add |create |afford/i.test(prompt)
  ) {
    return budgetRisks(workspace.accounts);
  }

  if (
    /simulate|what if|afford|can i afford|if i (buy|spend|purchase)/i.test(prompt)
  ) {
    if (amount == null) {
      return {
        kind: "clarification",
        text: "How much should I simulate?",
        tools: ["Checking your accounts"],
        clarification: {
          question: "How much should I simulate?",
          options: [
            { label: "$50", prompt: `${prompt} $50` },
            { label: "$100", prompt: `${prompt} $100` },
            { label: "$500", prompt: `${prompt} $500` },
          ],
        },
      };
    }

    const account =
      namedAccount ??
      (workspace.accounts.length === 1 ? workspace.accounts[0] : null);
    if (!account) {
      return missingAccountReply(workspace.accounts, `Simulate a $${amount} expense`);
    }

    const draft = buildDraft(prompt, account, amount);
    const simulation = withSimulation(draft, account);
    simulation.title = simulationTitle(prompt);
    const affordable = simulation.afterBalance >= 0;

    return {
      kind: "simulation",
      text: affordable
        ? `${account.name} can cover this without going below zero. Preview only — nothing is saved yet.`
        : `This would put ${account.name} below zero. Preview only — nothing is saved yet.`,
      tools: ["Checking your accounts", "Reviewing account balances"],
      simulation,
    };
  }

  if (/add |create |record |log a |log \$/i.test(prompt) && amount != null) {
    const account =
      namedAccount ??
      (workspace.accounts.length === 1 ? workspace.accounts[0] : null);
    if (!account) {
      return missingAccountReply(
        workspace.accounts,
        `Add a $${amount} ${isIncomePrompt(prompt) ? "income" : "expense"}`,
      );
    }

    return {
      kind: "proposal",
      text: "I found the following transaction. Review it before anything is saved.",
      tools: ["Checking your accounts", "Preparing a transaction preview"],
      proposal: buildDraft(prompt, account, amount),
    };
  }

  if (/add |create |record /i.test(prompt) && amount == null) {
    return {
      kind: "clarification",
      text: "What amount should I add?",
      tools: ["Checking your accounts"],
      clarification: {
        question: "What amount should I add?",
        options: [
          { label: "$25", prompt: `${prompt} $25` },
          { label: "$50", prompt: `${prompt} $50` },
          { label: "$100", prompt: `${prompt} $100` },
        ],
      },
    };
  }

  if (/where did i spend|top categor|\bmost\b|largest|why is/i.test(prompt)) {
    return topCategoryInsight(workspace) ?? spendingAnalysis(workspace, period ?? "month", accountHint);
  }

  if (
    /analyze|summarize|spending|explain my spending|transaction overview/i.test(
      prompt,
    )
  ) {
    return spendingAnalysis(workspace, period ?? "month", accountHint ?? namedAccount?.name);
  }

  if (/how much did i spend|how much have i spent/i.test(prompt) && period) {
    return spendingAnalysis(workspace, period, namedAccount?.name);
  }

  const combined = workspace.accounts.reduce(
    (sum, account) => sum + toAmount(account.balance),
    0,
  );

  return {
    kind: "analysis",
    text: workspace.accounts.length
      ? `You have ${workspace.accounts.length} accounts and a combined balance of ${formatMoney(combined)}.`
      : "Create an account first. Then I can analyze balances, budgets, and propose transactions.",
    tools: ["Checking your accounts"],
    analysis: {
      headline: workspace.accounts.length
        ? `Combined balance ${formatMoney(combined)}.`
        : "No accounts yet.",
      rows: workspace.accounts.slice(0, 4).map((account) => ({
        label: account.name,
        value: formatMoney(account.balance),
      })),
      href: "/dashboard",
      hrefLabel: "Open Dashboard",
    },
  };
};
