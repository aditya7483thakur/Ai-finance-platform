import { AccountType, Transaction, TransactionCategory, TransactionType } from "@/types";

export type PeriodKey = "week" | "month" | "last_month";

export type WorkspaceSnapshot = {
  accounts: AccountType[];
  transactions: Transaction[];
  monthCategories: { name: string; value: number }[];
};

export type ProposalDraft = {
  amount: number;
  type: TransactionType;
  accountId: string;
  accountName: string;
  category: TransactionCategory;
  date: string;
  description: string;
};

export type SimulationDraft = ProposalDraft & {
  title: string;
  currentBalance: number;
  afterBalance: number;
  budget: number | null;
  usedAfter: number;
};

export type AnalysisBlock = {
  headline: string;
  rows: { label: string; value: string }[];
  footnote?: string;
  href?: string;
  hrefLabel?: string;
};

export type InsightBlock = {
  body: string;
  stats?: { label: string; value: string }[];
  href?: string;
  hrefLabel?: string;
};

export type ClarificationBlock = {
  question: string;
  options: { label: string; prompt: string }[];
};

export type AgentReply = {
  kind:
    | "analysis"
    | "insight"
    | "simulation"
    | "proposal"
    | "clarification"
    | "error"
    | "text";
  text: string;
  tools: string[];
  analysis?: AnalysisBlock;
  insight?: InsightBlock;
  simulation?: SimulationDraft;
  proposal?: ProposalDraft;
  clarification?: ClarificationBlock;
};

export type ThreadMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  kind?: AgentReply["kind"] | "completed";
  tools?: string[];
  analysis?: AnalysisBlock;
  insight?: InsightBlock;
  simulation?: SimulationDraft;
  proposal?: ProposalDraft;
  clarification?: ClarificationBlock;
  completed?: {
    accountId: string;
    transactionId?: string;
  };
  status?: "open" | "editing" | "discarded" | "confirmed";
};
