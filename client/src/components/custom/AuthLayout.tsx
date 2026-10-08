import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BellRing, Check, ScanLine, Sparkles, Wallet } from "lucide-react";
import { useDarkRoot } from "@/hooks/useDarkRoot";
import BrandLogo from "./BrandLogo";

const HIGHLIGHTS = [
  "Budgets and a health check for every account",
  "Receipts scanned and filled in by AI",
  "An email alert before a budget runs out",
];

const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) => {
  useDarkRoot();

  return (
    <div className="dark grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <BrandLogo />

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          </div>
        </main>

        <p className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>

      {/* Brand panel, desktop only. Sample data, decorative. */}
      <aside className="relative hidden overflow-hidden border-l border-white/6 bg-[#080b12] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 30%, rgb(38 121 243 / 24%) 0%, rgb(99 102 241 / 10%) 45%, transparent 75%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_50%_at_70%_30%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 5%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div aria-hidden className="relative mx-auto h-[430px] w-full max-w-md">
          {/* Balance card */}
          <div className="absolute top-0 left-0 w-72 rounded-2xl border border-cyan-400/40 bg-card p-5 shadow-[0_0_40px_rgb(34_211_238/0.15)]">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-white/5 text-cyan-300">
                <Wallet className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Total Balance</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  $12,480
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Across 3 accounts
                </p>
              </div>
            </div>
            <svg viewBox="0 0 240 48" className="mt-4 h-12 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="auth-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 36 C 30 34, 40 22, 70 26 S 120 40, 150 28 S 200 8, 240 12 L240 48 L0 48 Z"
                fill="url(#auth-spark)"
              />
              <path
                d="M0 36 C 30 34, 40 22, 70 26 S 120 40, 150 28 S 200 8, 240 12"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Budget alert */}
          <div className="animate-float-slow absolute top-[176px] right-0 w-64 rounded-xl border border-orange-400/30 bg-popover/95 p-3.5 shadow-2xl backdrop-blur">
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/15 text-orange-300">
                <BellRing className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  Travel is at 92% of budget
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-warning to-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Receipt scanned */}
          <div className="animate-float absolute top-[268px] left-0 w-60 rounded-xl border border-sky-400/25 bg-popover/95 p-3 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/15 text-sky-300">
                <ScanLine className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Receipt scanned
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Whole Foods · $84.20 · Food
                </p>
              </div>
            </div>
          </div>

          {/* AI answer */}
          <div className="absolute right-4 bottom-0 w-72 rounded-xl border border-accent/30 bg-popover/95 p-3.5 shadow-2xl backdrop-blur">
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Ask Budgetly
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground">
                  Yes, you can afford the $600 trip. You'd still have $480 left
                  in Travel.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-md">
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
            Know where your money goes, before it's gone.
          </h2>
          <ul className="mt-5 space-y-2.5">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <Check className="size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
