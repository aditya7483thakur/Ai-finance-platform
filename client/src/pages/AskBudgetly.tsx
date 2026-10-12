import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_ACTIONS = [
  { label: "Analyze my spending", prompt: "Analyze my spending" },
  { label: "Where did I spend the most?", prompt: "Where did I spend the most?" },
  { label: "Check my budget risks", prompt: "Check my budget risks" },
  { label: "Simulate an expense", prompt: "Simulate an expense" },
  { label: "Can I afford something?", prompt: "Can I afford this purchase?" },
  { label: "Summarize this month", prompt: "Summarize this month" },
];

// UI shell only: the agent (backend tool calling, conversation state) is not
// wired up yet, so sending a message does nothing.
const AskBudgetly = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  // Other pages link here with a suggested prompt; prefill it once.
  useEffect(() => {
    const prompt = (location.state as { prompt?: string } | null)?.prompt;
    if (prompt) {
      setInput(prompt);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const sendPrompt = (prompt: string) => {
    if (!prompt.trim()) return;
    // Not connected to the agent backend yet.
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-6 pt-6">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-4">
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <Sparkles className="size-6 text-accent" aria-hidden />
            <h1 className="mt-4 text-2xl font-semibold text-foreground">
              Ask Budgetly
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Ask questions about your finances, analyze spending, or simulate
              decisions.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendPrompt(action.prompt)}
                  className="rounded-full border border-accent/25 bg-card px-3 py-1.5 text-sm text-accent hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form
          className="sticky bottom-0 rounded-xl border border-border bg-card p-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendPrompt(input);
          }}
        >
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="mb-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Attach a receipt"
            >
              <Paperclip className="size-4" />
            </button>
            <label className="sr-only" htmlFor="ask-budgetly-input">
              Ask Budgetly anything
            </label>
            <Input
              id="ask-budgetly-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything about your finances..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={!input.trim()}
              aria-label="Send"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskBudgetly;
