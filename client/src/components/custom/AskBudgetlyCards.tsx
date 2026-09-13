import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES, getCategoryLabel } from "@/lib/categories";
import {
  balanceToneClass,
  formatMoney,
  formatShortDate,
  formatSignedMoney,
  toAmount,
} from "@/lib/money";
import { cn } from "@/lib/utils";
import { AccountType } from "@/types";
import { Check, FlaskConical, Sparkles } from "lucide-react";
import type {
  AnalysisBlock,
  ClarificationBlock,
  InsightBlock,
  ProposalDraft,
  SimulationDraft,
} from "@/lib/agent/types";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <dt className="text-slate-500">{label}</dt>
    <dd className="font-medium text-slate-900">{children}</dd>
  </div>
);

export const ToolActivity = ({ steps }: { steps: string[] }) => (
  <ul className="space-y-1.5 text-xs text-slate-500">
    {steps.map((step) => (
      <li key={step} className="flex items-center gap-2">
        <Check className="size-3 text-accent" aria-hidden />
        {step}
      </li>
    ))}
  </ul>
);

export const AnalysisCard = ({ analysis }: { analysis: AnalysisBlock }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
      AI Analysis
    </p>
    <p className="mt-2 text-base font-semibold text-slate-900">
      {analysis.headline}
    </p>
    {analysis.rows.length > 0 && (
      <dl className="mt-4 space-y-2">
        {analysis.rows.map((row) => (
          <Field key={row.label} label={row.label}>
            {row.value}
          </Field>
        ))}
      </dl>
    )}
    {analysis.footnote && (
      <p className="mt-4 text-sm text-slate-600">{analysis.footnote}</p>
    )}
    {analysis.href && (
      <Link
        to={analysis.href}
        className="mt-4 inline-flex text-sm font-medium text-primary hover:text-primary/80"
      >
        {analysis.hrefLabel ?? "View Details"}
      </Link>
    )}
  </div>
);

export const InsightCard = ({ insight }: { insight: InsightBlock }) => (
  <div className="rounded-xl border border-accent/20 bg-accent/10 p-4">
    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
      <Sparkles className="size-3.5" aria-hidden />
      Insight
    </p>
    <p className="mt-2 text-sm text-accent">{insight.body}</p>
    {insight.stats && (
      <dl className="mt-3 space-y-2">
        {insight.stats.map((row) => (
          <Field key={row.label} label={row.label}>
            {row.value}
          </Field>
        ))}
      </dl>
    )}
    {insight.href && (
      <Link
        to={insight.href}
        className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
      >
        {insight.hrefLabel ?? "Explore Spending"}
      </Link>
    )}
  </div>
);

export const ClarificationCard = ({
  clarification,
  onSelect,
}: {
  clarification: ClarificationBlock;
  onSelect: (prompt: string) => void;
}) => (
  <div>
    <p className="text-sm text-slate-700">{clarification.question}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {clarification.options.map((option) =>
        option.prompt === "__dashboard__" ? (
          <Button key={option.label} size="sm" variant="outline" asChild>
            <Link to="/dashboard">{option.label}</Link>
          </Button>
        ) : (
          <Button
            key={option.label}
            size="sm"
            variant="outline"
            onClick={() => onSelect(option.prompt)}
          >
            {option.label}
          </Button>
        ),
      )}
    </div>
  </div>
);

const ProposalFields = ({
  draft,
  accounts,
  editing,
  onChange,
}: {
  draft: ProposalDraft;
  accounts: AccountType[];
  editing: boolean;
  onChange: (next: ProposalDraft) => void;
}) => {
  if (!editing) {
    return (
      <dl className="space-y-2">
        <Field label="Amount">
          <span
            className={
              draft.type === "INCOME" ? "text-success" : "text-error"
            }
          >
            {formatSignedMoney(draft.amount, draft.type)}
          </span>
        </Field>
        <Field label="Account">{draft.accountName}</Field>
        <Field label="Category">{getCategoryLabel(draft.category)}</Field>
        <Field label="Date">{formatShortDate(draft.date)}</Field>
        {draft.description && (
          <Field label="Description">{draft.description}</Field>
        )}
      </dl>
    );
  }

  return (
    <div className="grid gap-3">
      <label className="text-sm">
        <span className="mb-1 block text-slate-500">Amount</span>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={draft.amount}
          onChange={(event) =>
            onChange({ ...draft, amount: Number(event.target.value) || 0 })
          }
        />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-slate-500">Account</span>
        <Select
          value={draft.accountId}
          onValueChange={(accountId) => {
            const account = accounts.find((item) => item.id === accountId);
            onChange({
              ...draft,
              accountId,
              accountName: account?.name ?? draft.accountName,
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-slate-500">Category</span>
        <Select
          value={draft.category}
          onValueChange={(category) =>
            onChange({
              ...draft,
              category: category as ProposalDraft["category"],
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-slate-500">Date</span>
        <Input
          type="date"
          value={draft.date.slice(0, 10)}
          onChange={(event) =>
            onChange({
              ...draft,
              date: new Date(`${event.target.value}T12:00:00`).toISOString(),
            })
          }
        />
      </label>
    </div>
  );
};

export const SimulationCard = ({
  simulation,
  accounts,
  editing,
  discarded,
  onChange,
  onApply,
  onEdit,
  onDiscard,
}: {
  simulation: SimulationDraft;
  accounts: AccountType[];
  editing: boolean;
  discarded: boolean;
  onChange: (next: SimulationDraft) => void;
  onApply: () => void;
  onEdit: () => void;
  onDiscard: () => void;
}) => {
  const account =
    accounts.find((item) => item.id === simulation.accountId) ?? null;
  const current = account ? toAmount(account.balance) : simulation.currentBalance;
  const used = account ? toAmount(account.usedAmount) : 0;
  const after =
    simulation.type === "INCOME"
      ? current + simulation.amount
      : current - simulation.amount;
  const usedAfter =
    simulation.type === "EXPENSE" ? used + simulation.amount : used;
  const budget = account?.budget == null ? simulation.budget : toAmount(account.budget);
  const percent = budget && budget > 0 ? Math.min(100, (usedAfter / budget) * 100) : 0;

  if (discarded) {
    return <p className="text-sm text-slate-500">Simulation discarded.</p>;
  }

  return (
    <div className="rounded-xl border border-accent/20 bg-white p-4">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent">
        <FlaskConical className="size-3.5" aria-hidden />
        Simulation
      </p>
      <p className="mt-1 text-xs text-slate-500">Preview only</p>
      <h3 className="mt-3 text-base font-semibold text-slate-900">
        {simulation.title}
      </h3>
      <div className="mt-4">
        <ProposalFields
          draft={simulation}
          accounts={accounts}
          editing={editing}
          onChange={(next) => onChange({ ...simulation, ...next })}
        />
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Current balance
        </p>
        <p className={cn("text-lg font-semibold", balanceToneClass(current))}>
          {formatMoney(current)}
        </p>
        <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
          After purchase
        </p>
        <p className={cn("text-lg font-semibold", balanceToneClass(after))}>
          {formatMoney(after)}
        </p>
      </div>
      {budget != null && budget > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Budget impact
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {formatMoney(usedAfter)} of {formatMoney(budget)} used
          </p>
          <Progress value={percent} className="mt-2 h-1.5" />
          <p className="mt-1 text-xs text-slate-500">
            {Math.max(0, Math.round(100 - percent))}% remaining
          </p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onApply}>
          Apply Transaction
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          {editing ? "Done" : "Modify Simulation"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onDiscard}>
          Discard
        </Button>
      </div>
    </div>
  );
};

export const ProposalCard = ({
  proposal,
  accounts,
  editing,
  confirming,
  onChange,
  onEdit,
  onCancel,
  onConfirm,
}: {
  proposal: ProposalDraft;
  accounts: AccountType[];
  editing: boolean;
  confirming: boolean;
  onChange: (next: ProposalDraft) => void;
  onEdit: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
      Proposed Transaction
    </p>
    <div className="mt-3">
      <ProposalFields
        draft={proposal}
        accounts={accounts}
        editing={editing}
        onChange={onChange}
      />
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <Button size="sm" onClick={onConfirm} disabled={confirming}>
        {confirming ? "Creating..." : "Confirm Transaction"}
      </Button>
      <Button size="sm" variant="outline" onClick={onEdit}>
        {editing ? "Done" : "Edit"}
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </div>
);

export const CompletedCard = ({
  accountId,
}: {
  accountId: string;
}) => (
  <div className="rounded-xl border border-success/30 bg-success/10 p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-success">
      Completed
    </p>
    <p className="mt-2 text-sm font-medium text-success">
      Transaction created
    </p>
    <Link
      to={`/dashboard/transactions/${accountId}`}
      className="mt-3 inline-flex text-sm font-medium text-success hover:underline"
    >
      View Transaction →
    </Link>
  </div>
);
