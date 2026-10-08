import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  BarChart3,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Prompts mirror the dashboard's quick actions. Answers are canned examples
// based on sample data, not live model output.
const PROMPTS: {
  label: string;
  question: string;
  answer: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  {
    label: "Analyze my spending",
    question: "Analyze my spending this month",
    answer:
      "You've spent $1,920 so far. Food is your biggest category at 38% ($730), up $60 on last month. Housing (26%) and Transport (14%) are steady.",
    icon: BarChart3,
    tone: "bg-sky-400/15 text-sky-400",
  },
  {
    label: "Plan a purchase",
    question: "Can I afford a $600 trip next month?",
    answer:
      "Yes. Your Travel account has $1,080 left this month. After a $600 trip you'd still have $480, and every other account stays healthy.",
    icon: Target,
    tone: "bg-emerald-400/15 text-emerald-400",
  },
  {
    label: "Check budget risks",
    question: "Which budgets are at risk?",
    answer:
      "Two need attention: Shopping is overdrawn by $45, and Travel has used 92% of its budget with 12 days left in the month.",
    icon: ShieldCheck,
    tone: "bg-violet-400/15 text-violet-400",
  },
  {
    label: "Simulate an expense",
    question: "What if I spend $250 on shopping?",
    answer:
      "Shopping would reach 118% of its budget. Paying from Savings instead keeps all three accounts healthy.",
    icon: FlaskConical,
    tone: "bg-orange-400/15 text-orange-400",
  },
];

const useTypewriter = (text: string, enabled: boolean) => {
  const [length, setLength] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setLength(text.length);
      return;
    }
    setLength(0);
    const id = window.setInterval(() => {
      setLength((current) => {
        if (current >= text.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 2;
      });
    }, 18);
    return () => window.clearInterval(id);
  }, [text, enabled]);

  return { shown: text.slice(0, length), done: length >= text.length };
};

const AskBudgetlyDemo = () => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const prompt = PROMPTS[active];
  const { shown, done } = useTypewriter(prompt.answer, !reduceMotion);

  return (
    <section id="ask" className="relative scroll-mt-20 overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgb(99 102 241 / 16%), transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            <Sparkles className="size-4" aria-hidden />
            Ask Budgetly
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            Ask your money anything
          </h2>
          <p className="mt-5 max-w-md text-pretty text-muted-foreground sm:text-lg">
            Budgetly's assistant reads your accounts and transactions, so its
            answers are about your numbers, not generic advice.
          </p>

          <div
            role="tablist"
            aria-label="Example questions"
            className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
          >
            {PROMPTS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="ask-demo-panel"
                onClick={() => setActive(index)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active === index
                    ? "border-accent/40 bg-accent/10 text-foreground"
                    : "border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md",
                    item.tone,
                  )}
                >
                  <item.icon className="size-3.5" aria-hidden />
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-beam rounded-3xl">
          <div
            id="ask-demo-panel"
            role="tabpanel"
            aria-live="polite"
            className="flex min-h-[380px] flex-col rounded-[calc(1.5rem-1px)] bg-card"
          >
            <div className="flex items-center gap-2.5 border-b border-white/6 px-5 py-3.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
                <Sparkles className="size-3.5" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-foreground">Ask Budgetly</p>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" aria-hidden />
                Online
              </span>
            </div>

            <div className="flex-1 space-y-4 p-5">
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">
                {prompt.question}
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Sparkles className="size-3.5" aria-hidden />
                </span>
                <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm leading-relaxed text-foreground">
                  {/* Screen readers get the full answer; the typed copy is visual only. */}
                  <span className="sr-only">{prompt.answer}</span>
                  <span aria-hidden>
                    {shown}
                    {!done && (
                      <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-accent" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/6 p-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] py-1.5 pr-1.5 pl-3.5">
                <span className="flex-1 truncate text-sm text-muted-foreground">
                  Ask about your budgets...
                </span>
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
                  <ArrowUp className="size-4" aria-hidden />
                </span>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Example answers based on sample data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskBudgetlyDemo;
