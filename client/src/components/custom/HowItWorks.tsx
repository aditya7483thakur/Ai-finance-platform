import { motion } from "framer-motion";
import { Eye, ScanLine, WalletCards, type LucideIcon } from "lucide-react";

const STEPS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Create your accounts",
    description:
      "Add an account for each goal, set its opening balance and an optional monthly budget.",
    icon: WalletCards,
  },
  {
    title: "Log or scan transactions",
    description:
      "Enter spending by hand, scan a receipt, or set it to repeat. Balances update instantly.",
    icon: ScanLine,
  },
  {
    title: "Let Budgetly watch",
    description:
      "See trends on your dashboard, get alerts before budgets run out, and ask the AI anything.",
    icon: Eye,
  },
];

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="scroll-mt-20 border-y border-white/6 bg-white/[0.015] py-28"
  >
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">How it works</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          Set up in minutes
        </h2>
        <p className="mt-5 text-pretty text-muted-foreground sm:text-lg">
          No bank connections or spreadsheets. Three steps and you're tracking.
        </p>
      </div>

      <ol className="relative mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Connector line behind the step badges */}
        <span
          aria-hidden
          className="absolute top-[3.25rem] right-[16.66%] left-[16.66%] hidden h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 md:block"
        />
        {STEPS.map((step, index) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="relative rounded-3xl border border-border bg-card p-7 text-center"
          >
            <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-[#0b1220] text-primary shadow-[0_0_30px_-6px_rgb(38_121_243/0.5)]">
              <step.icon className="size-6" aria-hidden />
              <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                {index + 1}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
