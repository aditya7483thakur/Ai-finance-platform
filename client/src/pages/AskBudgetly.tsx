import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUp, Loader2, Paperclip, Sparkles } from "lucide-react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgent } from "@/contexts/agentContext";
import { useUserContext } from "@/contexts/userContext";
import { useGetAllAccounts } from "@/services/accounts/query";
import { useFetchExpenseBreakdown } from "@/services/graphs/query";
import { fetchFilteredTransactions } from "@/services/transactions/api";
import {
  useCreateTransaction,
  useScanReceipt,
} from "@/services/transactions/mutation";
import { AccountType, Transaction } from "@/types";
import { buildAgentReply } from "@/lib/agent/respond";
import type { ProposalDraft, SimulationDraft, ThreadMessage } from "@/lib/agent/types";
import {
  AnalysisCard,
  ClarificationCard,
  CompletedCard,
  InsightCard,
  ProposalCard,
  SimulationCard,
  ToolActivity,
} from "@/components/custom/AskBudgetlyCards";

const QUICK_ACTIONS = [
  { label: "Analyze my spending", prompt: "Analyze my spending" },
  { label: "Where did I spend the most?", prompt: "Where did I spend the most?" },
  { label: "Check my budget risks", prompt: "Check my budget risks" },
  { label: "Simulate an expense", prompt: "Simulate an expense" },
  { label: "Can I afford something?", prompt: "Can I afford this purchase?" },
  { label: "Summarize this month", prompt: "Summarize this month" },
];

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const AskBudgetly = () => {
  const { userId } = useUserContext();
  const { consumeDraft } = useAgent();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const startedRef = useRef(false);
  const { data: accountsData, isPending: accountsLoading } =
    useGetAllAccounts(userId);
  const { data: expenseData } = useFetchExpenseBreakdown(!!userId);
  const accounts = (accountsData?.data ?? []) as AccountType[];

  const transactionQueries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ["transactions", { accountId: account.id, page: 1, limit: 100 }],
      queryFn: () =>
        fetchFilteredTransactions({
          accountId: account.id,
          page: 1,
          limit: 100,
        }),
      enabled: Boolean(account.id),
    })),
  });

  const workspace = useMemo(
    () => ({
      accounts,
      transactions: transactionQueries.flatMap(
        (query) => (query.data?.data ?? []) as Transaction[],
      ),
      monthCategories: (expenseData?.data ?? []) as {
        name: string;
        value: number;
      }[],
    }),
    [accounts, transactionQueries, expenseData?.data],
  );
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;

  const { mutate: createTransaction } = useCreateTransaction();
  const { mutate: scanReceipt, isPending: isScanning } = useScanReceipt();

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isWorking) {
      return;
    }

    const userMessage: ThreadMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsWorking(true);
    setActiveTools([]);

    const reply = buildAgentReply(trimmed, workspaceRef.current);
    for (const step of reply.tools) {
      setActiveTools((current) => [...current, step]);
      await wait(220);
    }

    const agentMessage: ThreadMessage = {
      id: `agent-${Date.now()}`,
      role: "agent",
      text: reply.text,
      kind: reply.kind,
      tools: reply.tools,
      analysis: reply.analysis,
      insight: reply.insight,
      simulation: reply.simulation,
      proposal: reply.proposal,
      clarification: reply.clarification,
      status: "open",
    };

    setMessages((current) => [...current, agentMessage]);
    setActiveTools([]);
    setIsWorking(false);
  };

  useEffect(() => {
    if (startedRef.current || accountsLoading) {
      return;
    }

    const fromRoute = (location.state as { prompt?: string } | null)?.prompt;
    const pending = fromRoute || consumeDraft();
    if (pending) {
      startedRef.current = true;
      navigate(".", { replace: true, state: {} });
      void sendPrompt(pending);
    }
  }, [accountsLoading, consumeDraft, location.state, navigate]);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, activeTools, isWorking]);

  const updateMessage = (
    id: string,
    updater: (message: ThreadMessage) => ThreadMessage,
  ) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? updater(message) : message)),
    );
  };

  const confirmProposal = (message: ThreadMessage, draft: ProposalDraft) => {
    if (!userId || !draft.accountId || !draft.amount) {
      return;
    }

    setConfirmingId(message.id);
    createTransaction(
      {
        accountId: draft.accountId,
        type: draft.type,
        amount: draft.amount,
        category: draft.category,
        date: draft.date,
        description: draft.description,
        isRecurring: false,
      } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getAllAccounts"] });
          queryClient.invalidateQueries({ queryKey: ["fetchExpenseBreakdown"] });
          updateMessage(message.id, (current) => ({
            ...current,
            kind: "completed",
            status: "confirmed",
            completed: { accountId: draft.accountId },
          }));
          setConfirmingId(null);
          setEditingId(null);
        },
        onError: () => {
          updateMessage(message.id, (current) => ({
            ...current,
            kind: "error",
            text: "I couldn't create this transaction. Check the amount, account, and try again.",
          }));
          setConfirmingId(null);
        },
      },
    );
  };

  const handleReceipt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    scanReceipt(file, {
      onSuccess: (response) => {
        const parsed = response?.data ?? response;
        if (!parsed?.amount) {
          void sendPrompt("I uploaded a receipt but no amount was found.");
          return;
        }

        const account = accounts[0];
        if (!account) {
          void sendPrompt("Add a transaction from this receipt");
          return;
        }

        const prompt = `Add a $${parsed.amount} ${parsed.category || "expense"} ${
          parsed.description || ""
        }`.trim();
        void sendPrompt(prompt);
      },
    });
    event.target.value = "";
  };

  const clearConversation = () => {
    setMessages([]);
    setActiveTools([]);
    setEditingId(null);
  };

  const isEmpty = messages.length === 0 && !isWorking;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-6 pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Ask Budgetly</h2>
            <p className="text-sm text-muted-foreground">Your AI financial assistant</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearConversation}
            disabled={isEmpty}
          >
            New Conversation
          </Button>
        </div>

        <div ref={threadRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-4">
          {isEmpty && (
            <div className="flex flex-col items-center px-4 py-16 text-center">
              <Sparkles className="size-6 text-accent" aria-hidden />
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                Ask Budgetly
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your AI financial workspace
              </p>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Ask questions about your finances, analyze spending, or simulate
                decisions.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => void sendPrompt(action.prompt)}
                    className="rounded-full border border-accent/25 bg-card px-3 py-1.5 text-sm text-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <p key={message.id} className="text-right text-sm font-medium text-foreground">
                {message.text}
              </p>
            ) : (
              <div key={message.id} className="space-y-3">
                {message.tools && message.tools.length > 0 && (
                  <ToolActivity steps={message.tools} />
                )}
                {message.text && message.kind !== "analysis" && (
                  <p className="text-sm text-foreground/80">{message.text}</p>
                )}
                {message.kind === "analysis" && message.analysis && (
                  <AnalysisCard analysis={message.analysis} />
                )}
                {message.kind === "insight" && message.insight && (
                  <InsightCard insight={message.insight} />
                )}
                {message.kind === "clarification" && message.clarification && (
                  <ClarificationCard
                    clarification={message.clarification}
                    onSelect={(prompt) => void sendPrompt(prompt)}
                  />
                )}
                {message.kind === "simulation" && message.simulation && (
                  <SimulationCard
                    simulation={message.simulation}
                    accounts={accounts}
                    editing={editingId === message.id}
                    discarded={message.status === "discarded"}
                    onChange={(next: SimulationDraft) =>
                      updateMessage(message.id, (current) => ({
                        ...current,
                        simulation: next,
                      }))
                    }
                    onApply={() =>
                      updateMessage(message.id, (current) => ({
                        ...current,
                        kind: "proposal",
                        text: "I turned that simulation into a proposed transaction. Confirm to save it.",
                        proposal: current.simulation,
                        status: "open",
                      }))
                    }
                    onEdit={() =>
                      setEditingId((current) =>
                        current === message.id ? null : message.id,
                      )
                    }
                    onDiscard={() =>
                      updateMessage(message.id, (current) => ({
                        ...current,
                        status: "discarded",
                      }))
                    }
                  />
                )}
                {message.kind === "proposal" && message.proposal && (
                  <ProposalCard
                    proposal={message.proposal}
                    accounts={accounts}
                    editing={editingId === message.id}
                    confirming={confirmingId === message.id}
                    onChange={(next: ProposalDraft) =>
                      updateMessage(message.id, (current) => ({
                        ...current,
                        proposal: next,
                      }))
                    }
                    onEdit={() =>
                      setEditingId((current) =>
                        current === message.id ? null : message.id,
                      )
                    }
                    onCancel={() =>
                      updateMessage(message.id, (current) => ({
                        ...current,
                        kind: "text",
                        text: "Proposal cancelled. Nothing was saved.",
                        proposal: undefined,
                      }))
                    }
                    onConfirm={() => confirmProposal(message, message.proposal!)}
                  />
                )}
                {message.kind === "completed" && message.completed && (
                  <CompletedCard accountId={message.completed.accountId} />
                )}
                {message.kind === "error" && (
                  <p className="text-sm text-foreground/80">{message.text}</p>
                )}
              </div>
            ),
          )}

          {isWorking && (
            <div className="space-y-2">
              <ToolActivity steps={activeTools} />
              {activeTools.length === 0 && (
                <p className="text-sm text-accent">Looking at your workspace…</p>
              )}
            </div>
          )}
        </div>

        <form
          className="sticky bottom-0 rounded-xl border border-border bg-card p-2"
          onSubmit={(event) => {
            event.preventDefault();
            void sendPrompt(input);
          }}
        >
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="mb-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Scan a receipt"
              disabled={isScanning || isWorking}
              onClick={() => fileInputRef.current?.click()}
            >
              {isScanning ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Paperclip className="size-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleReceipt}
            />
            <label className="sr-only" htmlFor="ask-budgetly-input">
              Ask Budgetly anything
            </label>
            <Input
              id="ask-budgetly-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                isEmpty
                  ? "Ask anything about your finances..."
                  : "Ask Budgetly anything..."
              }
              className="border-0 shadow-none focus-visible:ring-0"
              disabled={isWorking}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isWorking || !input.trim()}
              aria-label="Send"
            >
              {isWorking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskBudgetly;
